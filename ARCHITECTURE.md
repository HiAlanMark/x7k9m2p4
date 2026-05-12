# Hi!XNS Desktop 架构说明

## 架构层次

```
┌─────────────────────────────────────────────────────────────────┐
│                    Hi!XNS Application                    │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │                    用户界面层 (GUI)                        │   │
│  │  Tauri WebView (Vue 3 + TypeScript)                       │   │
│  │  - 对话面板 (ChatView.vue)                                 │   │
│  │  - Skill 商店 (SkillStoreView.vue)                         │   │
│  │  - 设置面板 (SettingsView.vue)                             │   │
│  └───────────────────────────────────────────────────────────┘   │
│                              ↕ Tauri IPC                          │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │                    应用逻辑层 (Rust)                       │   │
│  │  src-tauri/src/                                            │   │
│  │  - commands.rs (35+ Tauri 命令)                           │   │
│  │  - gfw_client.rs (gfw.net API 客户端)                     │   │
│  │  - skill_store.rs (2x.com.cn API 客户端)                  │   │
│  │  - agent_bridge.rs (Agent 进程管理)                       │   │
│  │  - config.rs (配置管理)                                    │   │
│  └───────────────────────────────────────────────────────────┘   │
│                              ↕ 子进程                              │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │                    AI Agent 层 (Python) ← 最底层           │   │
│  │  resources/hermes-agent/hermes_cli/desktop_server.py      │   │
│  │  - 导入完整的 Hi!XNS Agent 核心                             │   │
│  │    • run_agent.AIAgent                                    │   │
│  │    • hermes_cli.config                                    │   │
│  │    • tools/* (所有工具)                                    │   │
│  │    • agent/* (Prompt 构建、记忆、压缩等)                   │   │
│  │  - WebSocket 服务 (127.0.0.1:随机端口)                    │   │
│  │  - 调用 AIAgent.chat() 处理用户消息                       │   │
│  │  - 流式返回结果给 GUI                                     │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │                    持久化存储层                            │   │
│  │  - sessions.db (会话历史)                                  │   │
│  │  - skills/ (已安装 Skill)                                  │   │
│  │  - config.yaml (Hermes 配置)                               │   │
│  │  - .env (API Keys)                                        │   │
│  │  - 系统密钥链 (敏感信息)                                   │   │
│  └───────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
         │                                          │
         │ HTTPS                                    │ HTTPS
         ▼                                          ▼
┌──────────────────────┐              ┌──────────────────────────────┐
│    gfw.net 平台       │              │   2x.com.cn 平台             │
│  - 模型调用 (OpenAI)  │              │  - 技能市场                  │
│  - 计费/用量          │              │  - 工作流市场                │
│  - 超级路由           │              │  - AI 社区                   │
│  - API Key 管理       │              │  - LLM Provider 管理         │
└──────────────────────┘              └──────────────────────────────┘
```

## Hi!XNS Agent 在底层的运行方式

### 启动流程
1. 用户双击 Hi!XNS 应用
2. Tauri 主进程 (Rust) 启动
3. Rust 通过 `agent_bridge.rs` 启动 Python 子进程:
   ```
   python resources/hermes-agent/hermes_cli/desktop_server.py --port 0
   ```
4. Python 进程:
   - 添加 Hi!XNS Agent 源码到 sys.path
   - 导入 `run_agent.AIAgent`
   - 初始化完整的 Hi!XNS Agent 实例
   - 在本机随机端口启动 WebSocket 服务
   - 输出端口号: `HERMES_DESKTOP_PORT:12345`
5. Rust 读取端口号，建立 WebSocket 连接
6. GUI 加载完成

### Agent 调用流程
```
用户输入消息
    │
    ▼
Vue ChatView.vue
    │ invoke('agent_send_message', {content, model})
    ▼
Rust commands.rs::agent_send_message()
    │ AgentBridge.send_message()
    ▼
WebSocket 发送到 Python
    │
    ▼
desktop_server.py::handle_chat()
    │ get_hermes_agent() → AIAgent 实例
    │ asyncio.to_thread(agent.chat(content))
    ▼
Hi!XNS Agent 核心
    │ - 构建 System Prompt
    │ - 调用 LLM (gfw.net)
    │ - 工具调用循环
    │ - 记忆/技能加载
    ▼
结果返回
    │
    ▼
WebSocket 流式返回给 Rust → Vue
    │
    ▼
用户看到响应
```

### 关键设计决策

**为什么 Hi!XNS Agent 在底层运行？**
- ✅ 完整的 AI 能力：所有 Hermes 工具、技能、记忆都可用
- ✅ 隔离性好：Agent 崩溃不影响 GUI
- ✅ 易于更新：Agent 核心可独立更新
- ✅ 跨平台一致：Python 在 Windows/macOS/Linux 行为一致

**降级机制**
- 如果 Hi!XNS Agent 核心导入失败，自动降级到模拟模式
- 模拟模式仍提供基本对话功能，但无工具调用能力
- 生产环境应始终使用完整 Hi!XNS Agent

## API 集成

### gfw.net (AI 调用)
- Base URL: `https://api.gfw.net/v1`
- 认证: API Key (`gfw-xxx`)
- 所有核心端点已验证通过

### 2x.com.cn (Skill/工作流)
- Base URL: `https://api.2x.com.cn/api/v1`
- 认证: JWT Token
- 技能/工作流市场已实现
