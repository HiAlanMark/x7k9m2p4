#!/usr/bin/env python3
"""
Hi!XNS Desktop - Hermes Agent Bridge Server

轻量 HTTP 服务，桥接前端与 hermes CLI agent。
支持 SSE 流式输出，保持会话上下文。

启动: python3 hermes_bridge.py [--port 9720]
前端调用: POST /api/chat  { "message": "...", "model": "...", "session_id": "..." }
         GET  /api/status
"""

import asyncio
import json
import os
import sys
import subprocess
import uuid
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import shutil

PORT = int(os.environ.get("BRIDGE_PORT", "9720"))
HERMES_BIN = shutil.which("hermes") or "hermes"

# 存储活跃会话
sessions: dict[str, dict] = {}


class BridgeHandler(BaseHTTPRequestHandler):
    """HTTP 请求处理器"""

    def log_message(self, format, *args):
        """静默日志，只打印重要信息"""
        pass

    def _cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)

        if parsed.path == "/api/status":
            self._json_response(200, {
                "status": "ok",
                "hermes": HERMES_BIN,
                "hermes_available": shutil.which("hermes") is not None,
                "sessions": len(sessions),
            })
        elif parsed.path == "/api/health":
            self._json_response(200, {"ok": True})
        else:
            self._json_response(404, {"error": "not found"})

    def do_POST(self):
        parsed = urlparse(self.path)

        if parsed.path == "/api/chat":
            self._handle_chat()
        elif parsed.path == "/api/cancel":
            self._handle_cancel()
        else:
            self._json_response(404, {"error": "not found"})

    def _read_body(self) -> dict:
        length = int(self.headers.get("Content-Length", 0))
        if length == 0:
            return {}
        raw = self.rfile.read(length)
        return json.loads(raw)

    def _json_response(self, code: int, data: dict):
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self._cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode())

    def _handle_chat(self):
        """处理聊天请求 — SSE 流式输出"""
        body = self._read_body()
        message = body.get("message", "").strip()
        model = body.get("model")
        session_id = body.get("session_id")
        max_turns = body.get("max_turns", 25)

        if not message:
            self._json_response(400, {"error": "message is required"})
            return

        # 构建 hermes 命令
        cmd = [HERMES_BIN, "chat", "-q", message, "-Q", "--max-turns", str(max_turns), "--yolo", "--source", "desktop"]

        if model:
            cmd.extend(["-m", model])

        if session_id and session_id in sessions:
            cmd.extend(["--resume", sessions[session_id]["hermes_session_id"]])

        # SSE 响应头
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Connection", "keep-alive")
        self._cors_headers()
        self.end_headers()

        # 生成/更新 session
        if not session_id:
            session_id = str(uuid.uuid4())[:8]

        start_time = time.time()

        def send_sse(event: str, data: dict):
            try:
                line = f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"
                self.wfile.write(line.encode())
                self.wfile.flush()
            except (BrokenPipeError, ConnectionResetError):
                pass

        # 发送 session 信息
        send_sse("session", {"session_id": session_id})

        try:
            # 运行 hermes 子进程
            proc = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                env={**os.environ, "PYTHONUNBUFFERED": "1", "NO_COLOR": "1"},
                text=True,
                bufsize=1,
            )

            hermes_session_id = None
            full_output = []
            tool_calls = []

            # 逐行读取输出
            for line in iter(proc.stdout.readline, ""):
                line = line.rstrip("\n")

                # 第一行通常是 session_id: xxx
                if line.startswith("session_id:"):
                    hermes_session_id = line.split(":", 1)[1].strip()
                    sessions[session_id] = {
                        "hermes_session_id": hermes_session_id,
                        "created": time.time(),
                    }
                    send_sse("meta", {"hermes_session_id": hermes_session_id})
                    continue

                # 工具调用标记（hermes -Q 模式下工具信息以特殊格式出现）
                if line.startswith("⚠️") or line.startswith("🔧") or line.startswith("✓") or line.startswith("✗"):
                    send_sse("tool", {"text": line})
                    tool_calls.append(line)
                    continue

                # 普通内容
                full_output.append(line)
                send_sse("content", {"text": line + "\n"})

            proc.wait()

            # 读取 stderr
            stderr_output = proc.stderr.read() if proc.stderr else ""

            duration_ms = int((time.time() - start_time) * 1000)

            # 发送完成事件
            send_sse("done", {
                "session_id": session_id,
                "hermes_session_id": hermes_session_id,
                "duration_ms": duration_ms,
                "exit_code": proc.returncode,
                "tool_calls_count": len(tool_calls),
                "error": stderr_output.strip() if proc.returncode != 0 else None,
            })

        except Exception as e:
            send_sse("error", {"message": str(e)})

    def _handle_cancel(self):
        """取消正在运行的请求（TODO: 实现进程终止）"""
        self._json_response(200, {"ok": True})


class ThreadedHTTPServer(HTTPServer):
    """支持并发的 HTTP 服务器"""
    allow_reuse_address = True

    def process_request(self, request, client_address):
        thread = threading.Thread(target=self.process_request_thread, args=(request, client_address))
        thread.daemon = True
        thread.start()

    def process_request_thread(self, request, client_address):
        try:
            self.finish_request(request, client_address)
        except Exception:
            self.handle_error(request, client_address)
        finally:
            self.shutdown_request(request)


def main():
    port = PORT
    if len(sys.argv) > 1:
        for i, arg in enumerate(sys.argv[1:], 1):
            if arg == "--port" and i < len(sys.argv) - 1:
                port = int(sys.argv[i + 1])

    # 检查 hermes 是否可用
    hermes_path = shutil.which("hermes")
    if not hermes_path:
        print("ERROR: hermes CLI not found in PATH", file=sys.stderr)
        print("Install: pip install hermes-agent", file=sys.stderr)
        sys.exit(1)

    print(f"Hi!XNS Hermes Bridge Server")
    print(f"  hermes: {hermes_path}")
    print(f"  port:   {port}")
    print(f"  url:    http://127.0.0.1:{port}")
    print()

    server = ThreadedHTTPServer(("127.0.0.1", port), BridgeHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down...")
        server.shutdown()


if __name__ == "__main__":
    main()
