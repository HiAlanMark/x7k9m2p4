#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
AGENT_GO_DIR="$PROJECT_DIR/agent-go"

# 目标平台 (默认当前系统)
TARGET_OS="${1:-$(go env GOOS)}"
TARGET_ARCH="${2:-$(go env GOARCH)}"
VERSION="${VERSION:-0.1.0}"

echo "=== Hi!XNS Desktop Build ==="
echo "  Platform: ${TARGET_OS}/${TARGET_ARCH}"
echo "  Version:  ${VERSION}"
echo ""

# ── 1. 检查依赖 ──
echo "[1/4] 检查依赖..."
for cmd in node npm go; do
    if ! command -v $cmd &>/dev/null; then
        echo "  ✗ 缺少 $cmd"
        exit 1
    fi
    echo "  ✓ $cmd ($(command -v $cmd))"
done

# ── 2. 构建前端 ──
echo ""
echo "[2/4] 构建前端..."
cd "$PROJECT_DIR"
if command -v pnpm &>/dev/null; then
    pnpm install --frozen-lockfile 2>/dev/null || pnpm install
    pnpm run build
else
    npm ci 2>/dev/null || npm install
    npm run build
fi

# 前端产物复制到 agent-go/dist/ (go:embed 目标)
rm -rf "$AGENT_GO_DIR/dist"
cp -r "$PROJECT_DIR/dist" "$AGENT_GO_DIR/dist"
echo "  ✓ 前端构建完成 → agent-go/dist/"

# ── 3. Windows 资源文件 (仅 Windows 目标) ──
if [ "$TARGET_OS" = "windows" ]; then
    echo ""
    echo "[3/4] 编译 Windows 资源文件..."
    cd "$AGENT_GO_DIR"
    if [ "$TARGET_ARCH" = "amd64" ]; then
        WINDRES="x86_64-w64-mingw32-windres"
    elif [ "$TARGET_ARCH" = "386" ]; then
        WINDRES="i686-w64-mingw32-windres"
    else
        WINDRES="x86_64-w64-mingw32-windres"
    fi

    if command -v $WINDRES &>/dev/null; then
        $WINDRES --preprocessor=cat resource.rc -o "resource_windows_${TARGET_ARCH}.syso"
        echo "  ✓ 资源文件: resource_windows_${TARGET_ARCH}.syso"
    else
        echo "  ⚠ 未找到 $WINDRES，跳过资源嵌入 (exe 将无图标)"
    fi
else
    echo ""
    echo "[3/4] 非 Windows 目标，跳过资源编译"
fi

# ── 4. 编译 Go 后端 ──
echo ""
echo "[4/4] 编译 Go 二进制..."
cd "$AGENT_GO_DIR"

OUTPUT_NAME="hixns-agent"
if [ "$TARGET_OS" = "windows" ]; then
    OUTPUT_NAME="hixns-agent.exe"
    # Windows GUI 程序需要 -ldflags="-H windowsgui" 隐藏控制台窗口
    LDFLAGS="-s -w -H windowsgui -X main.version=${VERSION}"
else
    LDFLAGS="-s -w -X main.version=${VERSION}"
fi

OUTPUT_DIR="$PROJECT_DIR/build/${TARGET_OS}-${TARGET_ARCH}"
mkdir -p "$OUTPUT_DIR"

CGO_ENABLED=0 GOOS="$TARGET_OS" GOARCH="$TARGET_ARCH" \
    go build -ldflags="$LDFLAGS" -o "$OUTPUT_DIR/$OUTPUT_NAME" .

echo "  ✓ 输出: $OUTPUT_DIR/$OUTPUT_NAME"
echo ""

# ── 构建结果 ──
ls -lh "$OUTPUT_DIR/$OUTPUT_NAME"
echo ""
echo "=== 构建完成 ==="
echo "  产物目录: $OUTPUT_DIR/"
echo ""
echo "下一步:"
if [ "$TARGET_OS" = "windows" ]; then
    echo "  1. 复制 bundled/hermes-agent/ 到 $OUTPUT_DIR/"
    echo "  2. 使用 Inno Setup 打包安装程序"
elif [ "$TARGET_OS" = "darwin" ]; then
    echo "  1. 使用 scripts/bundle-mac.sh 打包 .app bundle"
else
    echo "  1. 复制 bundled/hermes-agent/ 到 $OUTPUT_DIR/"
    echo "  2. chmod +x $OUTPUT_DIR/$OUTPUT_NAME && ./$OUTPUT_DIR/$OUTPUT_NAME"
fi
