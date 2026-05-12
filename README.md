# Hi!XNS Desktop

基于 Tauri v2 + Vue 3 + Hi!XNS Agent 的跨平台桌面 AI Agent 应用。

## 技术栈

- **桌面框架**: Tauri v2 (Rust + WebView)
- **前端**: Vue 3 + TypeScript + Pinia + Vue Router
- **AI Agent**: Hi!XNS Agent (Python)
- **通信**: WebSocket (本地进程间通信)
- **API 服务**: gfw.net (模型调用、计费)
- **Skill/工作流商店**: 2x.com.cn (技能市场、工作流市场、AI 社区)

## 功能特性

### gfw.net 集成 (已验证)
- ✅ 用户认证 (登录/刷新)
- ✅ 用户信息/余额查询
- ✅ 模型列表 (56 个模型)
- ✅ API Key 管理 (创建/获取/撤销)
- ✅ 用量统计 (日/月)
- ✅ 充值套餐
- ✅ 超级路由 (28 个厂商)

### 2x.com.cn 集成 (基于真实 API)
- ✅ 邮箱/手机号登录
- ✅ 技能市场 (浏览/搜索/收藏/下载)
- ✅ 工作流市场 (浏览/分类/下载)
- ✅ 排行榜 (最多使用/最高评分/最新发布)
- ✅ 我的技能/收藏/下载
- ✅ 技能评价
- ⏳ AI 社区 (Bot 管理/帖子/评论)
- ⏳ 工作流管理 (创建/版本/调度/执行)

## 开发环境

### 前置要求

- Node.js >= 18
- Rust >= 1.70
- Python >= 3.11

### 安装依赖

```bash
# 前端依赖
npm install

# Rust 依赖 (在 src-tauri/ 目录)
cd src-tauri
cargo fetch
cd ..
```

### 开发模式

```bash
chmod +x scripts/run.sh
./scripts/run.sh
```

或者直接运行:
```bash
npm install
cd src-tauri && cargo fetch && cd ..
npm run tauri dev
```

### 构建

```bash
npm run tauri build
```

构建输出位于: `src-tauri/target/release/bundle/`

## 项目结构

```
hixns-desktop/
├── src-tauri/                    # Tauri Rust 后端
│   ├── src/
│   │   ├── main.rs               # 应用入口 + 命令注册
│   │   ├── gfw_client.rs         # gfw.net API 客户端
│   │   ├── gfw_types.rs          # gfw 数据类型定义
│   │   ├── skill_store.rs        # 2x.com.cn 客户端 (真实 API)
│   │   ├── agent_bridge.rs       # Hi!XNS Agent 进程管理
│   │   ├── config.rs             # 配置管理
│   │   └── commands.rs           # Tauri 命令 (35+ 个)
│   ├── tauri.conf.json
│   ├── Cargo.toml
│   └── resources/
│       └── hermes-agent/
│           └── hermes_cli/
│               └── desktop_server.py  # WebSocket 服务
├── src/                          # Vue 3 前端
│   ├── main.ts
│   ├── App.vue
│   ├── router.ts
│   ├── views/
│   │   ├── ChatView.vue          # 对话面板
│   │   ├── SkillStoreView.vue    # 2x 技能/工作流商店
│   │   └── SettingsView.vue      # 设置面板 (gfw 配置)
│   ├── stores/
│   │   ├── gfw.ts                # gfw.net 状态
│   │   ├── chat.ts               # 聊天状态
│   │   └── app.ts                # 应用状态
│   ├── api/
│   │   └── index.ts              # API 封装 (gfw + 2x)
│   └── types/
│       └── index.ts              # TypeScript 类型
└── scripts/
    └── build.sh                  # 构建脚本
```

## API 集成状态

### gfw.net
- Base URL: `https://api.gfw.net/api/v1`
- AI Base URL: `https://api.gfw.net/v1`
- SR Base URL: `https://api.gfw.net/sr/v1`
- 所有核心端点已测试通过

### 2x.com.cn
- Base URL: `https://api.2x.com.cn/api/v1`
- 认证: JWT Token (Authorization: Bearer ***)
- 技能/工作流市场端点已实现
- AI 社区/工作流管理等高级功能待后续实现

## 配置

配置存储在:
- macOS: `~/Library/Application Support/hixns-desktop/config.json`
- Windows: `%APPDATA%/hixns-desktop/config.json`
- Linux: `~/.config/hixns-desktop/config.json`

敏感信息 (API Key, JWT) 存储在系统密钥链中。
