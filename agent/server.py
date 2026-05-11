#!/usr/bin/env python3
"""
Hi!XNS Agent Server — 本地 Agent 后端，通过 SSE 流式输出。
提供完整的 AI Agent 能力：终端命令、文件读写、网页搜索等。

启动方式：python agent/server.py --port 9800
前端通过 POST /v1/agent/chat 调用，SSE 流式返回。
"""

import asyncio
import json
import os
import subprocess
import sys
import platform
import time
import traceback
from pathlib import Path
from typing import Any

# --- HTTP Server (aiohttp) ---
try:
    from aiohttp import web
except ImportError:
    print("需要 aiohttp: pip install aiohttp")
    sys.exit(1)

try:
    import httpx
except ImportError:
    print("需要 httpx: pip install httpx")
    sys.exit(1)


# ============================================================
# 工具定义
# ============================================================

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "run_terminal",
            "description": "在本地终端执行 shell 命令。可以运行任何命令行工具、安装软件、编译代码、查看系统信息等。",
            "parameters": {
                "type": "object",
                "properties": {
                    "command": {"type": "string", "description": "要执行的 shell 命令"},
                    "workdir": {"type": "string", "description": "工作目录（可选）"},
                    "timeout": {"type": "integer", "description": "超时秒数，默认 30", "default": 30},
                },
                "required": ["command"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "read_file",
            "description": "读取本地文件内容。支持文本文件、代码文件、配置文件等。",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "文件路径（绝对或相对）"},
                    "offset": {"type": "integer", "description": "起始行号（从 1 开始）", "default": 1},
                    "limit": {"type": "integer", "description": "最大读取行数", "default": 200},
                },
                "required": ["path"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "write_file",
            "description": "写入内容到本地文件。会完全覆盖文件内容。自动创建目录。",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "文件路径"},
                    "content": {"type": "string", "description": "要写入的完整内容"},
                },
                "required": ["path", "content"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "list_directory",
            "description": "列出目录下的文件和子目录。",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "目录路径", "default": "."},
                },
                "required": [],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "search_files",
            "description": "在文件内容中搜索匹配的文本（类似 grep）。",
            "parameters": {
                "type": "object",
                "properties": {
                    "pattern": {"type": "string", "description": "搜索的正则表达式模式"},
                    "path": {"type": "string", "description": "搜索的目录", "default": "."},
                    "file_glob": {"type": "string", "description": "文件名过滤，如 *.py"},
                },
                "required": ["pattern"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "system_info",
            "description": "获取当前系统信息：操作系统、CPU、内存、磁盘、Python 版本等。",
            "parameters": {"type": "object", "properties": {}, "required": []},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "web_search",
            "description": "搜索网页获取信息（需要联网）。",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "搜索关键词"},
                },
                "required": ["query"],
            },
        },
    },
]

SYSTEM_PROMPT = """你是 Hi!XNS Agent，一个运行在用户电脑上的 AI 助手。你可以：
- 执行终端命令（run_terminal）
- 读写文件（read_file / write_file）
- 列出目录（list_directory）
- 搜索文件内容（search_files）
- 获取系统信息（system_info）
- 搜索网页（web_search）

你运行在用户的本地机器上，可以直接操作文件系统和执行命令。
回答时使用中文。对于需要操作的任务，先使用工具获取信息再回答。"""


# ============================================================
# 工具执行器
# ============================================================

def execute_tool(name: str, args: dict[str, Any]) -> str:
    """执行工具并返回结果字符串"""
    try:
        if name == "run_terminal":
            return _run_terminal(args)
        elif name == "read_file":
            return _read_file(args)
        elif name == "write_file":
            return _write_file(args)
        elif name == "list_directory":
            return _list_directory(args)
        elif name == "search_files":
            return _search_files(args)
        elif name == "system_info":
            return _system_info()
        elif name == "web_search":
            return _web_search(args)
        else:
            return json.dumps({"error": f"未知工具: {name}"})
    except Exception as e:
        return json.dumps({"error": str(e), "traceback": traceback.format_exc()})


def _run_terminal(args: dict) -> str:
    cmd = args.get("command", "")
    workdir = args.get("workdir")
    timeout = args.get("timeout", 30)
    try:
        result = subprocess.run(
            cmd, shell=True, capture_output=True, text=True,
            timeout=timeout, cwd=workdir,
        )
        output = result.stdout
        if result.stderr:
            output += "\n[stderr]\n" + result.stderr
        # 截断过长输出
        if len(output) > 20000:
            output = output[:10000] + f"\n\n... [截断，共 {len(output)} 字符] ...\n\n" + output[-5000:]
        return json.dumps({"exit_code": result.returncode, "output": output})
    except subprocess.TimeoutExpired:
        return json.dumps({"error": f"命令超时（{timeout}s）", "command": cmd})


def _read_file(args: dict) -> str:
    path = os.path.expanduser(args.get("path", ""))
    offset = max(1, args.get("offset", 1))
    limit = min(2000, args.get("limit", 200))
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            lines = f.readlines()
        total = len(lines)
        selected = lines[offset - 1: offset - 1 + limit]
        content = ""
        for i, line in enumerate(selected, start=offset):
            content += f"{i}|{line}"
        return json.dumps({"content": content, "total_lines": total, "path": path})
    except FileNotFoundError:
        return json.dumps({"error": f"文件不存在: {path}"})


def _write_file(args: dict) -> str:
    path = os.path.expanduser(args.get("path", ""))
    content = args.get("content", "")
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    return json.dumps({"success": True, "path": path, "bytes": len(content.encode("utf-8"))})


def _list_directory(args: dict) -> str:
    path = os.path.expanduser(args.get("path", "."))
    try:
        entries = []
        for entry in sorted(os.listdir(path)):
            full = os.path.join(path, entry)
            is_dir = os.path.isdir(full)
            size = os.path.getsize(full) if not is_dir else 0
            entries.append({"name": entry, "type": "dir" if is_dir else "file", "size": size})
        return json.dumps({"path": path, "entries": entries[:200]})
    except FileNotFoundError:
        return json.dumps({"error": f"目录不存在: {path}"})


def _search_files(args: dict) -> str:
    pattern = args.get("pattern", "")
    path = args.get("path", ".")
    file_glob = args.get("file_glob")
    cmd = f"grep -rn --include='{file_glob}' '{pattern}' {path}" if file_glob else f"grep -rn '{pattern}' {path}"
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=15)
        lines = result.stdout.strip().split("\n")[:50]
        return json.dumps({"matches": [l for l in lines if l], "count": len(lines)})
    except subprocess.TimeoutExpired:
        return json.dumps({"error": "搜索超时"})


def _system_info() -> str:
    import shutil
    info = {
        "os": f"{platform.system()} {platform.release()}",
        "arch": platform.machine(),
        "hostname": platform.node(),
        "python": sys.version.split()[0],
        "cwd": os.getcwd(),
        "home": str(Path.home()),
        "cpu_count": os.cpu_count(),
    }
    # 磁盘
    try:
        usage = shutil.disk_usage("/")
        info["disk_total_gb"] = round(usage.total / (1024**3), 1)
        info["disk_free_gb"] = round(usage.free / (1024**3), 1)
    except Exception:
        pass
    # 内存（Linux）
    try:
        with open("/proc/meminfo") as f:
            for line in f:
                if line.startswith("MemTotal:"):
                    info["mem_total_gb"] = round(int(line.split()[1]) / (1024**2), 1)
                elif line.startswith("MemAvailable:"):
                    info["mem_available_gb"] = round(int(line.split()[1]) / (1024**2), 1)
    except Exception:
        pass
    return json.dumps(info)


def _web_search(args: dict) -> str:
    query = args.get("query", "")
    # 简单实现：用 DuckDuckGo HTML
    try:
        import httpx as hx
        r = hx.get(
            "https://html.duckduckgo.com/html/",
            params={"q": query},
            headers={"User-Agent": "Mozilla/5.0"},
            timeout=10,
        )
        # 简单提取结果
        import re
        results = []
        for m in re.finditer(r'<a rel="nofollow" class="result__a" href="([^"]+)"[^>]*>(.*?)</a>', r.text):
            url, title = m.group(1), re.sub(r'<[^>]+>', '', m.group(2))
            results.append({"title": title.strip(), "url": url})
            if len(results) >= 5:
                break
        return json.dumps({"query": query, "results": results})
    except Exception as e:
        return json.dumps({"error": f"搜索失败: {e}"})


# ============================================================
# Agent Loop — LLM + Tool Calling 循环
# ============================================================

async def agent_loop(
    messages: list[dict],
    api_base: str,
    api_key: str,
    model: str,
    send_event,  # async callable(event_type, data_dict)
    max_iterations: int = 15,
):
    """
    核心 agent loop：
    1. 调用 LLM（带 tools）
    2. 如果 LLM 返回 tool_calls，执行工具，把结果追加到 messages
    3. 重复，直到 LLM 返回纯文本回复或达到最大迭代
    """
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

    for iteration in range(max_iterations):
        body = {
            "model": model,
            "messages": messages,
            "tools": TOOLS,
            "stream": True,
        }

        async with httpx.AsyncClient(timeout=120) as client:
            try:
                async with client.stream("POST", f"{api_base}/chat/completions", json=body, headers=headers) as resp:
                    if resp.status_code != 200:
                        error_text = ""
                        async for chunk in resp.aiter_text():
                            error_text += chunk
                        await send_event("error", {"message": f"API 错误 ({resp.status_code}): {error_text[:500]}"})
                        return

                    content_parts = []
                    tool_calls_acc: dict[int, dict] = {}  # index -> {id, name, arguments}
                    finish_reason = None

                    async for line in resp.aiter_lines():
                        if not line.startswith("data: "):
                            continue
                        data = line[6:].strip()
                        if data == "[DONE]":
                            break
                        try:
                            parsed = json.loads(data)
                        except json.JSONDecodeError:
                            continue

                        choice = parsed.get("choices", [{}])[0]
                        delta = choice.get("delta", {})
                        finish_reason = choice.get("finish_reason") or finish_reason

                        # 文本内容
                        if delta.get("content"):
                            content_parts.append(delta["content"])
                            await send_event("text", {"content": delta["content"]})

                        # Tool calls 累积
                        if delta.get("tool_calls"):
                            for tc in delta["tool_calls"]:
                                idx = tc.get("index", 0)
                                if idx not in tool_calls_acc:
                                    tool_calls_acc[idx] = {
                                        "id": tc.get("id", ""),
                                        "name": tc.get("function", {}).get("name", ""),
                                        "arguments": "",
                                    }
                                if tc.get("id"):
                                    tool_calls_acc[idx]["id"] = tc["id"]
                                if tc.get("function", {}).get("name"):
                                    tool_calls_acc[idx]["name"] = tc["function"]["name"]
                                if tc.get("function", {}).get("arguments"):
                                    tool_calls_acc[idx]["arguments"] += tc["function"]["arguments"]

                        # Usage
                        if parsed.get("usage"):
                            await send_event("usage", parsed["usage"])

            except httpx.ReadTimeout:
                await send_event("error", {"message": "LLM 请求超时"})
                return
            except Exception as e:
                await send_event("error", {"message": f"请求失败: {e}"})
                return

        full_content = "".join(content_parts)

        # 如果没有 tool calls，agent loop 结束
        if not tool_calls_acc:
            # 追加 assistant 消息
            messages.append({"role": "assistant", "content": full_content})
            await send_event("done", {"content": full_content})
            return

        # 有 tool calls — 执行工具
        # 构建 assistant 消息
        tc_list = []
        for idx in sorted(tool_calls_acc.keys()):
            tc = tool_calls_acc[idx]
            tc_list.append({
                "id": tc["id"],
                "type": "function",
                "function": {"name": tc["name"], "arguments": tc["arguments"]},
            })

        assistant_msg: dict[str, Any] = {"role": "assistant", "content": full_content or None, "tool_calls": tc_list}
        messages.append(assistant_msg)

        # 执行每个工具
        for tc in tc_list:
            tool_name = tc["function"]["name"]
            try:
                tool_args = json.loads(tc["function"]["arguments"])
            except json.JSONDecodeError:
                tool_args = {}

            await send_event("tool_call", {
                "id": tc["id"],
                "tool": tool_name,
                "args": tool_args,
                "status": "running",
            })

            # 执行（在线程中，避免阻塞）
            t0 = time.time()
            result = await asyncio.to_thread(execute_tool, tool_name, tool_args)
            duration = round(time.time() - t0, 2)

            await send_event("tool_result", {
                "id": tc["id"],
                "tool": tool_name,
                "result": result[:5000],  # 截断
                "duration": duration,
                "status": "completed",
            })

            # 追加 tool 结果到 messages
            messages.append({
                "role": "tool",
                "tool_call_id": tc["id"],
                "content": result,
            })

    # 超过最大迭代
    await send_event("error", {"message": f"Agent 已达最大迭代次数 ({max_iterations})"})


# ============================================================
# HTTP Server
# ============================================================

async def handle_chat(request: web.Request) -> web.StreamResponse:
    """POST /v1/agent/chat — SSE 流式 agent 对话"""
    try:
        body = await request.json()
    except Exception:
        return web.json_response({"error": "无效的 JSON"}, status=400)

    content = body.get("content", "")
    history = body.get("messages", [])
    api_base = body.get("api_base", "")
    api_key = body.get("api_key", "")
    model = body.get("model", "")

    if not content and not history:
        return web.json_response({"error": "content 不能为空"}, status=400)
    if not api_base or not api_key or not model:
        return web.json_response({"error": "需要 api_base, api_key, model"}, status=400)

    # 构建消息列表
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.extend(history)
    if content:
        messages.append({"role": "user", "content": content})

    # SSE response
    resp = web.StreamResponse(
        status=200,
        reason="OK",
        headers={
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
        },
    )
    await resp.prepare(request)

    async def send_event(event_type: str, data: dict):
        line = f"data: {json.dumps({'type': event_type, **data}, ensure_ascii=False)}\n\n"
        await resp.write(line.encode("utf-8"))

    try:
        await agent_loop(messages, api_base, api_key, model, send_event)
    except Exception as e:
        await send_event("error", {"message": str(e)})

    await resp.write(b"data: [DONE]\n\n")
    return resp


async def handle_health(request: web.Request) -> web.Response:
    """GET /v1/agent/health"""
    return web.json_response({
        "status": "ok",
        "agent": "Hi!XNS Agent",
        "version": "0.1.0",
        "tools": [t["function"]["name"] for t in TOOLS],
        "platform": f"{platform.system()} {platform.machine()}",
    })


async def handle_cors(request: web.Request) -> web.Response:
    """OPTIONS preflight"""
    return web.Response(
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }
    )


def create_app() -> web.Application:
    app = web.Application()
    app.router.add_get("/v1/agent/health", handle_health)
    app.router.add_post("/v1/agent/chat", handle_chat)
    app.router.add_route("OPTIONS", "/v1/agent/chat", handle_cors)
    app.router.add_route("OPTIONS", "/v1/agent/health", handle_cors)
    return app


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Hi!XNS Agent Server")
    parser.add_argument("--port", type=int, default=9800)
    parser.add_argument("--host", type=str, default="127.0.0.1")
    args = parser.parse_args()

    print(f"[Hi!XNS Agent] 启动中... http://{args.host}:{args.port}")
    print(f"[Hi!XNS Agent] 工具: {', '.join(t['function']['name'] for t in TOOLS)}")
    print(f"[Hi!XNS Agent] 平台: {platform.system()} {platform.machine()}")
    web.run_app(create_app(), host=args.host, port=args.port, print=None)
    print(f"[Hi!XNS Agent] 已启动: http://{args.host}:{args.port}")
