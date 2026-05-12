#!/usr/bin/env bash
# Hi!XNS — 打包 Hermes Agent 到应用资源目录
# 用法: ./scripts/bundle-hermes.sh [hermes-source-dir] [output-dir]
#
# 从完整的 Hermes Agent 安装中提取运行时必需文件，
# 去除 .git/tests/website/node_modules/ui-tui 等，
# 压缩后约 100-200MB（含 Python venv）

set -e

HERMES_SRC="${1:-/usr/local/lib/hermes-agent}"
OUTPUT_DIR="${2:-$(dirname "$0")/../bundled/hermes-agent}"

if [ ! -f "$HERMES_SRC/run_agent.py" ]; then
    echo "ERROR: Hermes Agent not found at $HERMES_SRC"
    echo "Usage: $0 /path/to/hermes-agent [output-dir]"
    exit 1
fi

echo "[bundle] Source: $HERMES_SRC"
echo "[bundle] Output: $OUTPUT_DIR"

# 清理旧的
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# === 核心 Python 文件 ===
echo "[bundle] 复制核心源码..."
CORE_FILES=(
    run_agent.py
    model_tools.py
    toolsets.py
    cli.py
    hermes_state.py
    hermes_constants.py
    hermes_logging.py
    batch_runner.py
    setup.py
    pyproject.toml
)
for f in "${CORE_FILES[@]}"; do
    [ -f "$HERMES_SRC/$f" ] && cp "$HERMES_SRC/$f" "$OUTPUT_DIR/"
done

# === 核心目录 ===
echo "[bundle] 复制核心目录..."
CORE_DIRS=(
    agent
    tools
    hermes_cli
    gateway
    plugins
    cron
    skills
    acp_adapter
    tui_gateway
)
for d in "${CORE_DIRS[@]}"; do
    if [ -d "$HERMES_SRC/$d" ]; then
        cp -r "$HERMES_SRC/$d" "$OUTPUT_DIR/$d"
        # 删除 __pycache__
        find "$OUTPUT_DIR/$d" -type d -name '__pycache__' -exec rm -rf {} + 2>/dev/null || true
    fi
done

# === Python venv ===
echo "[bundle] 复制 Python venv..."
cp -r "$HERMES_SRC/venv" "$OUTPUT_DIR/venv"

# 清理 venv 中不需要的文件
echo "[bundle] 清理 venv..."
rm -rf "$OUTPUT_DIR/venv/share" 2>/dev/null || true
find "$OUTPUT_DIR/venv" -type d -name '__pycache__' -exec rm -rf {} + 2>/dev/null || true
find "$OUTPUT_DIR/venv" -name '*.pyc' -delete 2>/dev/null || true
# 删除 pip/setuptools 缓存
rm -rf "$OUTPUT_DIR/venv/lib/python*/site-packages/pip" 2>/dev/null || true
rm -rf "$OUTPUT_DIR/venv/lib/python*/site-packages/setuptools" 2>/dev/null || true

# === 启动脚本 ===
echo "[bundle] 创建启动脚本..."
cat > "$OUTPUT_DIR/run-hermes.sh" << 'SCRIPT'
#!/usr/bin/env bash
# Hi!XNS 内嵌 Hermes Agent 启动脚本
DIR="$(cd "$(dirname "$0")" && pwd)"
unset PYTHONPATH
unset PYTHONHOME
exec "$DIR/venv/bin/python3" -m hermes_cli "$@"
SCRIPT
chmod +x "$OUTPUT_DIR/run-hermes.sh"

# === 统计 ===
TOTAL_SIZE=$(du -sh "$OUTPUT_DIR" | awk '{print $1}')
FILE_COUNT=$(find "$OUTPUT_DIR" -type f | wc -l)
echo ""
echo "[bundle] 完成!"
echo "[bundle] 大小: $TOTAL_SIZE ($FILE_COUNT 个文件)"
echo "[bundle] 路径: $OUTPUT_DIR"
echo ""
echo "Go Agent 会从以下路径检测 Hermes:"
echo "  1. bundled/hermes-agent/ (应用内嵌)"
echo "  2. /usr/local/lib/hermes-agent/ (系统安装)"
echo "  3. ~/.hermes/hermes-agent/ (用户安装)"
