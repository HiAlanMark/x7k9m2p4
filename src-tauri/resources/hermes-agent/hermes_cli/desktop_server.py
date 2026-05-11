#!/usr/bin/env python3
"""
Hermes Desktop WebSocket Server
================================
这是 Hermes Desktop 的核心后端，它在底层运行完整的 Hermes Agent，
并通过 WebSocket 为桌面 GUI 提供 AI 能力。

架构：
  Tauri GUI (Rust/Vue) ← WebSocket ← Hermes Agent (Python, 本文件)
"""

import asyncio
import json
import os
import sys
import uuid
from datetime import datetime
from pathlib import Path

# ============================================================
# 导入 Hermes Agent 核心
# ============================================================

# 将 Hermes Agent 源码路径添加到 Python 路径
HERMES_HOME = os.environ.get("HERMES_HOME", str(Path.home() / ".hermes"))
HERMES_SRC = Path(__file__).parent.parent  # resources/hermes-agent/

if str(HERMES_SRC) not in sys.path:
    sys.path.insert(0, str(HERMES_SRC))

# 设置 HERMES_HOME 环境变量
os.environ["HERMES_HOME"] = HERMES_HOME

try:
    from hermes_constants import get_hermes_home
    from hermes_cli.config import load_config
    from run_agent import AIAgent
    HERMES_AVAILABLE = True
except ImportError as e:
    print(f"[WARN] Hermes Agent core not available: {e}", file=sys.stderr)
    print("[WARN] Using simulated mode. Install Hermes Agent for full functionality.", file=sys.stderr)
    HERMES_AVAILABLE = False

import websockets
from websockets.exceptions import ConnectionClosed

# ============================================================
# 全局状态
# ============================================================

active_connections = {}
hermes_agent = None
hermes_config = None

# ============================================================
# Agent 初始化
# ============================================================

def init_hermes_agent():
    """初始化 Hermes Agent 实例"""
    global hermes_agent, hermes_config

    if not HERMES_AVAILABLE:
        return False

    try:
        # 加载 Hermes 配置
        hermes_config = load_config()

        # 从环境变量或配置获取 API 设置
        model_config = hermes_config.get("model", {})
        base_url = os.environ.get("GFW_AI_BASE", model_config.get("base_url", "https://api.gfw.net/v1"))
        api_key = os.environ.get("GFW_API_KEY", model_config.get("api_key", ""))
        default_model = os.environ.get("DEFAULT_MODEL", model_config.get("default", "gpt-4o-mini"))
        max_iterations = hermes_config.get("agent", {}).get("max_turns", 90)

        # 创建 AIAgent 实例
        hermes_agent = AIAgent(
            base_url=base_url,
            api_key=api_key,
            model=default_model,
            max_iterations=max_iterations,
            platform="desktop",
            quiet_mode=True,
        )

        print(f"[Hermes] Agent initialized: model={default_model}, base_url={base_url}", flush=True)
        return True

    except Exception as e:
        print(f"[Hermes] Failed to initialize agent: {e}", file=sys.stderr)
        return False

def get_hermes_agent():
    """获取或创建 Agent 实例"""
    global hermes_agent

    if hermes_agent is None:
        if not init_hermes_agent():
            return None
    return hermes_agent

# ============================================================
# WebSocket 处理
# ============================================================

async def handle_client(websocket):
    """处理桌面客户端连接"""
    try:
        # 发送连接确认
        await websocket.send(json.dumps({
            "type": "connected",
            "hermes_version": "0.13.0",
            "hermes_available": HERMES_AVAILABLE,
            "gfw_base": os.environ.get("GFW_AI_BASE", "https://api.gfw.net/v1"),
            "timestamp": datetime.utcnow().isoformat()
        }))

        async for raw_message in websocket:
            try:
                data = json.loads(raw_message)
                msg_type = data.get("type")

                if msg_type == "chat":
                    await handle_chat(websocket, data)
                elif msg_type == "config_update":
                    await handle_config_update(data)
                elif msg_type == "cancel":
                    await handle_cancel(data.get("id"))
                elif msg_type == "ping":
                    await websocket.send(json.dumps({
                        "type": "pong",
                        "timestamp": datetime.utcnow().isoformat()
                    }))
            except json.JSONDecodeError:
                await send_error(websocket, "invalid_json", "无效的 JSON 消息")
            except Exception as e:
                await send_error(websocket, "internal_error", str(e))

    except ConnectionClosed:
        pass
    finally:
        ws_id = id(websocket)
        if ws_id in active_connections:
            del active_connections[ws_id]

async def handle_chat(websocket, data):
    """处理对话请求 — 真正调用 Hermes Agent"""
    msg_id = data["id"]
    content = data["content"]
    model = data.get("model")

    try:
        # 开始信号
        await websocket.send(json.dumps({
            "type": "chat_start",
            "id": msg_id,
            "model": model or "default",
            "timestamp": datetime.utcnow().isoformat()
        }))

        # 注册取消回调
        cancel_event = asyncio.Event()
        active_connections[id(websocket)] = {
            "msg_id": msg_id,
            "cancel_event": cancel_event
        }

        # 获取 Agent
        agent = get_hermes_agent()

        if agent is not None and HERMES_AVAILABLE:
            # 如果指定了模型，切换模型
            if model and model != agent.model:
                agent.model = model
                # 重新初始化客户端
                if hasattr(agent, '_reinitialize_client'):
                    agent._reinitialize_client()

            # 调用真正的 Hermes Agent
            await call_real_hermes_agent(websocket, msg_id, content, agent, cancel_event)
        else:
            # 降级到模拟模式
            print(f"[Hermes] Using simulated mode for message: {content[:50]}...", file=sys.stderr)
            await simulate_agent_response(websocket, msg_id, content, cancel_event)

    except asyncio.CancelledError:
        await websocket.send(json.dumps({
            "type": "cancelled",
            "id": msg_id,
            "timestamp": datetime.utcnow().isoformat()
        }))
    except Exception as e:
        error_code = classify_error(str(e))
        await send_error(websocket, error_code, str(e), msg_id)
        print(f"[Hermes] Chat error: {e}", file=sys.stderr)

async def call_real_hermes_agent(websocket, msg_id, content, agent, cancel_event):
    """调用真正的 Hermes Agent 并流式返回结果"""
    import time
    start_time = time.time()

    try:
        # 使用 Hermes Agent 的 chat 方法
        # 注意：这里需要适配 Hermes 的 API 以支持流式回调
        # 目前 Hermes 的 run_conversation 是同步的，我们需要在线程中运行它

        # 方案：使用 asyncio.to_thread 运行同步的 Hermes 调用
        result = await asyncio.to_thread(
            agent.chat,
            content
        )

        # 检查是否被取消
        if cancel_event.is_set():
            return

        # 发送最终响应
        duration_ms = int((time.time() - start_time) * 1000)

        # 尝试提取 token usage
        token_usage = {}
        if hasattr(agent, 'last_response') and agent.last_response:
            usage = agent.last_response.get('usage', {})
            if usage:
                token_usage = {
                    "prompt_tokens": usage.get('prompt_tokens', 0),
                    "completion_tokens": usage.get('completion_tokens', 0),
                    "total_tokens": usage.get('total_tokens', 0),
                }

        await websocket.send(json.dumps({
            "type": "chat_complete",
            "id": msg_id,
            "final_response": result if isinstance(result, str) else str(result),
            "token_usage": token_usage,
            "model": agent.model,
            "duration_ms": duration_ms,
            "timestamp": datetime.utcnow().isoformat()
        }))

    except Exception as e:
        # 如果 Hermes Agent 调用失败，尝试流式降级
        print(f"[Hermes] Agent call failed: {e}", file=sys.stderr)
        await send_error(websocket, "agent_error", str(e), msg_id)

async def simulate_agent_response(websocket, msg_id, content, cancel_event):
    """模拟 Agent 响应 (降级模式，当 Hermes Agent 不可用时)"""
    responses = [
        "收到你的消息了，让我来处理...",
        "好的，正在为你执行操作。",
        f"你发送了: {content[:50]}{'...' if len(content) > 50 else ''}",
    ]

    for chunk in responses:
        if cancel_event.is_set():
            return
        await websocket.send(json.dumps({
            "type": "stream_chunk",
            "id": msg_id,
            "content": chunk,
            "timestamp": datetime.utcnow().isoformat()
        }))
        await asyncio.sleep(0.5)

    # 完成信号
    await websocket.send(json.dumps({
        "type": "chat_complete",
        "id": msg_id,
        "final_response": " ".join(responses),
        "token_usage": {"prompt_tokens": 50, "completion_tokens": 30, "total_tokens": 80},
        "model": os.environ.get("DEFAULT_MODEL", "gpt-4o-mini"),
        "duration_ms": 1500,
        "timestamp": datetime.utcnow().isoformat()
    }))

async def handle_config_update(data):
    """热更新配置"""
    global hermes_agent

    gfw_config = data.get("gfw", {})
    if gfw_config:
        if "api_key" in gfw_config:
            os.environ["GFW_API_KEY"] = gfw_config["api_key"]
        if "default_model" in gfw_config:
            os.environ["DEFAULT_MODEL"] = gfw_config["default_model"]
        if "base_url" in gfw_config:
            os.environ["GFW_AI_BASE"] = gfw_config["base_url"]

    if "gfw_jwt" in data:
        os.environ["GFW_JWT"] = data["gfw_jwt"]

    # 如果 Agent 已初始化，重新初始化
    if hermes_agent is not None:
        print("[Hermes] Reinitializing agent with new config...", flush=True)
        hermes_agent = None
        init_hermes_agent()

async def handle_cancel(msg_id):
    """取消请求"""
    for ws_id, conn in active_connections.items():
        if conn.get("msg_id") == msg_id:
            conn["cancel_event"].set()
            break

async def send_error(websocket, error_code, message, msg_id=None):
    """发送错误"""
    await websocket.send(json.dumps({
        "type": "error",
        "id": msg_id,
        "error_code": error_code,
        "message": message,
        "recoverable": error_code in ["api_timeout", "rate_limited"],
        "timestamp": datetime.utcnow().isoformat()
    }))

def classify_error(error_msg: str) -> str:
    """错误分类"""
    error_msg_lower = error_msg.lower()
    if "timeout" in error_msg_lower:
        return "api_timeout"
    if "401" in error_msg_lower or "auth" in error_msg_lower:
        return "auth_failed"
    if "429" in error_msg_lower or "rate" in error_msg_lower:
        return "rate_limited"
    if "balance" in error_msg_lower or "quota" in error_msg_lower:
        return "insufficient_balance"
    return "internal_error"

# ============================================================
# 主函数
# ============================================================

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Hermes Desktop WebSocket Server")
    parser.add_argument("--port", type=int, default=0,
                       help="WebSocket 端口 (0=自动选择)")
    parser.add_argument("--host", default="127.0.0.1",
                       help="监听地址")
    parser.add_argument("--hermes-home", type=str, default=None,
                       help="Hermes Agent 主目录")
    args = parser.parse_args()

    if args.hermes_home:
        os.environ["HERMES_HOME"] = args.hermes_home

    # 尝试初始化 Hermes Agent
    if HERMES_AVAILABLE:
        success = init_hermes_agent()
        if success:
            print("[Hermes] Full agent mode enabled", flush=True)
        else:
            print("[Hermes] Using simulated mode (Hermes Agent init failed)", flush=True)
    else:
        print("[Hermes] Using simulated mode (Hermes Agent not installed)", flush=True)

    async def start():
        async with websockets.serve(handle_client, args.host, args.port) as server:
            port = server.sockets[0].getsockname()[1]
            print(f"HERMES_DESKTOP_PORT:{port}", flush=True)
            print(f"HERMES_DESKTOP_READY", flush=True)
            await asyncio.Future()

    asyncio.run(start())

if __name__ == "__main__":
    main()
