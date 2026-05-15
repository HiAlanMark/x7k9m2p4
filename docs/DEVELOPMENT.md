# Hi!XNS 开发文档

## 项目架构

```
x7k9m2p4/                     # GitHub 仓库 (public)
├── main.go                   # Go 后端: HTTP Server + Wails 入口 + Hermes 集成
├── app.go                    # Wails Bind (窗口控制)
├── wails.json                # Wails 配置
├── go.mod / go.sum
├── frontend/                 # Vue 3 前端
│   ├── src/
│   │   ├── views/           # 页面: ChatView, SettingsView, TasksView, SkillStoreView
│   │   ├── components/      # 组件: TitleBar, SplashScreen, fx/ (动效)
│   │   ├── stores/          # Pinia: chat, gfw, app
│   │   ├── api/             # HTTP + WebSocket 封装
│   │   └── router.ts
│   └── package.json
├── .github/workflows/
│   └── release.yml          # CI/CD: 全平台安装包
└── scripts/
    └── build-local.sh       # 本地一键构建
```

## 技术栈

| 层 | 技术 |
|---|---|
| 桌面框架 | Wails v2.12.0 (Go + embedded Vue) |
| 前端 | Vue 3 + TypeScript + Pinia |
| 后端 | Go 1.22+ (net/http, CGO) |
| AI Agent | Hermes Agent (内嵌 Python 运行时) |
| 打包 | NSIS (Win) / AppImage (Linux) / DMG (macOS) |

## 环境准备

### 必需
```bash
# Go 1.22+
go version

# Node.js 22+
node -v

# Wails CLI
go install github.com/wailsapp/wails/v2/cmd/wails@latest

# Linux 额外依赖
sudo apt-get install -y libgtk-3-dev libwebkit2gtk-4.0-dev libappindicator3-dev

# Windows 额外依赖 (MSYS2)
# 安装 msys2，然后: pacman -S mingw-w64-x86_64-gcc mingw-w64-x86_64-make
```

## 开发模式

```bash
# 启动开发服务器 (热重载)
wails dev

# 仅构建前端 (Vue dev server)
cd frontend && npm run dev

# 构建生产版本
wails build
```

## 构建流程

### 本地构建
```bash
# 一键构建 (自动检测平台)
bash scripts/build-local.sh

# 指定平台
bash scripts/build-local.sh linux
bash scripts/build-local.sh windows
bash scripts/build-local.sh macos
```

### CI 构建 (自动)
```bash
# 打 tag 触发 CI
git tag v0.X.0
git push origin v0.X.0

# CI 自动执行:
# 1. 构建前端 (npm run build)
# 2. Wails 构建二进制
# 3. 克隆 Hermes 源码
# 4. 构建 Hermes 运行环境 (Python + 依赖)
# 5. 打包安装包 (NSIS / AppImage / DMG)
# 6. 发布 GitHub Release
```

## Hermes 集成

### 路径检测 (main.go: detectHermes)

安装后文件结构:
```
<安装目录>/
├── hixns-agent (或 .exe / .app)
├── hermes-agent/
│   ├── run_agent.py
│   ├── run-hermes.sh (或 .bat)
│   ├── agent/
│   ├── tools/
│   └── ...
└── hermes-python/
    ├── python.exe (Windows)
    └── bin/python3 (Linux/macOS)
```

检测优先级:
1. `exeDir/hermes-agent/` — 安装包同目录
2. `exeDir/bundled/hermes-agent/` — 备用
3. `exeDir/../Resources/hermes-agent/` — macOS bundle
4. 系统安装 (`~/.hermes/bin/hermes`, `/usr/local/bin/hermes`)

### 启动方式
- **bundled-python**: `hermes-python/python.exe -m hermes_cli <args>` (Windows)
- **bundled-python**: `hermes-python/bin/python3 -m hermes_cli <args>` (Linux/macOS)
- **系统安装**: `hermes <args>`

## 发布流程

```bash
# 1. 更新版本号 (wails.json)
# 2. 提交更改
git add -A && git commit -m "release: v0.X.0"

# 3. 打 tag 并推送
git tag v0.X.0
git push origin main --tags

# 4. CI 自动构建并发布 Release
# 5. 检查: https://github.com/HiAlanMark/x7k9m2p4/releases
```

## 关键配置

### wails.json
```json
{
  "name": "hixns-agent",
  "outputfilename": "hixns-agent",
  "nsisType": "multiple"
}
```

### 环境变量
- `CGO_ENABLED=1` — Wails 需要 CGO
- `GONOSUMCHECK=*` — 跳过私有模块校验

## 常见问题

### Hermes 未找到
检查 `build/bin/hermes-agent/` 和 `build/bin/hermes-python/` 是否存在。
CI 构建时确保 Hermes 步骤在 Wails 构建之后执行（避免 `-clean` 清空）。

### Windows 构建失败
确保 MSYS2/MinGW 已安装，`CC=gcc` 和 `CGO_ENABLED=1` 已设置。

### Linux WebKit 版本
优先 `libwebkit2gtk-4.1-dev`，回退 `libwebkit2gtk-4.0-dev`。
Ubuntu 22.04 默认只有 4.0。

### CORS 问题
Wails 使用 `wails://` 协议，外部 API 会触发 CORS。
Go 后端提供 `/proxy/custom/` 路由代理请求，前端自动检测并路由。
