#!/usr/bin/env bash
# Hi!XNS — 构建完整安装包（含 Hermes Agent）
# 用法: ./scripts/build-full-installer.sh
#
# 前提:
#   1. 系统已安装 Hermes Agent (/usr/local/lib/hermes-agent/)
#   2. 已安装 Go 1.25+, Node.js 20+
#   3. Windows 目标需要 Inno Setup (iscc)

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BUILD_DIR="$PROJECT_DIR/build/windows-amd64"

echo "=== Hi!XNS 完整安装包构建 ==="
echo ""

# 1. 构建前端
echo "[1/5] 构建前端..."
cd "$PROJECT_DIR"
npm ci 2>/dev/null || npm install
npm run build
rm -rf agent-go/dist
cp -r dist agent-go/dist
echo "  ✓ 前端构建完成"

# 2. 编译 Go (Windows)
echo "[2/5] 编译 Go 后端 (Windows amd64)..."
cd "$PROJECT_DIR/agent-go"
CGO_ENABLED=0 GOOS=windows GOARCH=amd64 \
  go build -ldflags="-s -w -H windowsgui -X main.version=v0.3.1" \
  -o "$BUILD_DIR/hixns-agent.exe" .
echo "  ✓ hixns-agent.exe"

# 3. 打包 Hermes Agent
echo "[3/5] 打包 Hermes Agent..."
bash "$SCRIPT_DIR/bundle-hermes.sh" "/usr/local/lib/hermes-agent" "$BUILD_DIR/bundled/hermes-agent"
echo "  ✓ Hermes Agent 已打包"

# 4. 构建 Inno Setup 安装包
echo "[4/5] 构建安装包..."
if command -v iscc &>/dev/null; then
  iscc "$SCRIPT_DIR/installer.iss"
  echo "  ✓ 安装包已生成"
else
  echo "  ⚠ iscc 未安装，跳过安装包构建"
  echo "  请在 Windows 上安装 Inno Setup 后运行: iscc scripts/installer.iss"
fi

# 5. 结果
echo ""
echo "[5/5] 构建结果:"
ls -lh "$BUILD_DIR/hixns-agent.exe" 2>/dev/null
ls -lh "$PROJECT_DIR/build/installer/"*.exe 2>/dev/null || true
du -sh "$BUILD_DIR/bundled/hermes-agent/" 2>/dev/null || true
echo ""
echo "=== 完成 ==="
