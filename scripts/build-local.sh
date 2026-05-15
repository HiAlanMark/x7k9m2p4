#!/bin/bash
# Hi!XNS 本地一键构建脚本
# 用法: bash scripts/build-local.sh [windows|linux|macos]
# 默认检测当前平台

set -euo pipefail

PLATFORM="${1:-}"
if [ -z "$PLATFORM" ]; then
  case "$(uname -s)" in
    Linux*)  PLATFORM="linux" ;;
    Darwin*) PLATFORM="macos" ;;
    *)       echo "未知平台，请指定: windows / linux / macos"; exit 1 ;;
  esac
fi

echo "========================================="
echo " Hi!XNS 本地构建 — $PLATFORM"
echo "========================================="

# ── 1. 前端 ────────────────────────────────────────
echo ">>> 构建前端..."
cd frontend && npm install && npm run build && cd ..

# ── 2. Go 依赖 ─────────────────────────────────────
echo ">>> Go mod tidy..."
go mod tidy

# ── 3. Wails 构建 ──────────────────────────────────
echo ">>> Wails 构建..."
EXTRA_FLAGS=""
if [ "$PLATFORM" = "linux" ]; then
  pkg-config --exists webkit2gtk-4.1 && EXTRA_FLAGS="-tags webkit2_41" || true
fi
wails build -clean -trimpath -s -skipbindings $EXTRA_FLAGS 2>&1 | tail -5

# ── 4. Hermes 环境 ─────────────────────────────────
echo ">>> 构建 Hermes 运行环境..."
BUILD_DIR="build/bin"
HERMES_DIR="$BUILD_DIR/hermes-agent"
PYTHON_DIR="$BUILD_DIR/hermes-python"
mkdir -p "$HERMES_DIR" "$PYTHON_DIR"

# 克隆 Hermes
git clone --depth 1 https://github.com/NousResearch/hermes-agent.git /tmp/hermes-src 2>/dev/null || true

# 复制源码
for f in run_agent.py model_tools.py toolsets.py cli.py hermes_state.py hermes_constants.py hermes_logging.py batch_runner.py; do
  [ -f "/tmp/hermes-src/$f" ] && cp "/tmp/hermes-src/$f" "$HERMES_DIR/"
done
for d in agent tools hermes_cli gateway plugins cron acp_adapter tui_gateway skills; do
  [ -d "/tmp/hermes-src/$d" ] && cp -r "/tmp/hermes-src/$d" "$HERMES_DIR/$d"
done
[ -f "/tmp/hermes-src/pyproject.toml" ] && cp "/tmp/hermes-src/pyproject.toml" "$HERMES_DIR/"

if [ "$PLATFORM" = "windows" ]; then
  # Windows: 嵌入式 Python
  echo "  [Windows] 下载嵌入式 Python..."
  curl -fsSL "https://www.python.org/ftp/python/3.11.9/python-3.11.9-embed-amd64.zip" -o /tmp/py.zip
  unzip -q /tmp/py.zip -d "$PYTHON_DIR/"
  rm /tmp/py.zip
  echo "import site" >> "$PYTHON_DIR/python311._pth"
  curl -fsSL "https://bootstrap.pypa.io/get-pip.py" -o "$PYTHON_DIR/get-pip.py"
  "$PYTHON_DIR/python.exe" "$PYTHON_DIR/get-pip.py" --no-warn-script-location
  "$PYTHON_DIR/python.exe" -m pip install --no-warn-script-location \
    aiohttp pydantic pyyaml rich httpx openai tiktoken \
    beautifulsoup4 lxml playwright python-dotenv 2>&1 | tail -3

  cat > "$HERMES_DIR/run-hermes.bat" << 'EOF'
@echo off
set SCRIPT_DIR=%~dp0
set PYTHON_DIR=%SCRIPT_DIR%..\hermes-python
"%PYTHON_DIR%\python.exe" -m hermes_cli %*
EOF
else
  # Linux/macOS: venv
  echo "  [$PLATFORM] 创建 Python venv..."
  python3 -m venv "$PYTHON_DIR"
  source "$PYTHON_DIR/bin/activate"
  pip install --no-cache-dir \
    aiohttp pydantic pyyaml rich httpx openai tiktoken \
    beautifulsoup4 lxml playwright python-dotenv 2>&1 | tail -3
  deactivate

  cat > "$HERMES_DIR/run-hermes.sh" << 'SCRIPT'
#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PYTHON_DIR="$SCRIPT_DIR/../hermes-python"
exec "$PYTHON_DIR/bin/python3" -m hermes_cli "$@"
SCRIPT
  chmod +x "$HERMES_DIR/run-hermes.sh"
fi

# 清理
find "$HERMES_DIR" -type d -name '__pycache__' -exec rm -rf {} + 2>/dev/null || true
rm -rf /tmp/hermes-src

echo "========================================="
echo " 构建完成！"
echo "========================================="
echo " 二进制: $BUILD_DIR/"
echo " Hermes: $HERMES_DIR/"
echo " Python: $PYTHON_DIR/"
echo ""
echo " 运行: $BUILD_DIR/hixns-agent (或 .exe/.app)"
