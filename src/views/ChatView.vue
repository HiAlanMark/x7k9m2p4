<template>
  <div class="chat-view">
    <div class="messages" ref="messagesRef">
      <!-- Empty state -->
      <div v-if="messages.length === 0" class="empty-state">
        <div class="empty-inner">
          <div class="terminal-header">
            <span class="terminal-dot red"></span>
            <span class="terminal-dot yellow"></span>
            <span class="terminal-dot green"></span>
            <span class="terminal-title">hixns</span>
          </div>
          <div class="terminal-body">
            <div class="terminal-line">
              <span class="t-prompt">$</span>
              <span class="t-cmd">hixns</span>
              <span class="t-flag">--interactive</span>
            </div>
            <div class="terminal-line output">
              <span class="t-text">Hi!XNS Agent v0.1.0</span>
            </div>
            <div class="terminal-line output">
              <span class="t-text dim">56+ 模型可用 · gfw.net</span>
            </div>
            <div class="terminal-line output">
              <span class="t-status">ready</span>
              <span class="t-cursor">_</span>
            </div>
          </div>
          <div class="quick-actions">
            <div class="quick-item" @click="quickAsk('用 Python 写一个带类型提示的快速排序算法')">
              <span class="qa-icon">></span>
              <span class="qa-text">快速排序 · Python</span>
            </div>
            <div class="quick-item" @click="quickAsk('解释 TCP 三次握手的工作原理')">
              <span class="qa-icon">></span>
              <span class="qa-text">TCP 三次握手</span>
            </div>
            <div class="quick-item" @click="quickAsk('审查这段代码的性能问题: def fib(n): return fib(n-1) + fib(n-2) if n > 1 else n')">
              <span class="qa-icon">></span>
              <span class="qa-text">代码审查 · 斐波那契</span>
            </div>
            <div class="quick-item" @click="quickAsk('生成一个 Node.js 应用的多阶段构建 Dockerfile')">
              <span class="qa-icon">></span>
              <span class="qa-text">Dockerfile · 多阶段构建</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <template v-for="(msg, idx) in messages" :key="msg.id">
        <div v-if="msg.role === 'system'" class="sys-line">
          <span class="sys-prefix">[sys]</span>
          <span class="sys-text">{{ msg.content }}</span>
        </div>

        <div v-else-if="msg.role === 'user' || msg.role === 'assistant' || (msg.content && msg.content.trim())" class="msg" :class="msg.role">
          <div class="msg-header">
            <span class="msg-author" :class="msg.role">{{ msg.role === 'user' ? '我' : 'Hi!XNS' }}</span>
            <span class="msg-time">{{ formatTime(msg.timestamp) }}</span>
          </div>

          <div v-if="msg.role === 'user'" class="msg-content user-content">{{ msg.content }}</div>
          <div v-else class="msg-content ai-content markdown-body" v-html="renderMarkdown(msg.content)"></div>

          <!-- Tool calls -->
          <div v-if="msg.role === 'assistant' && msg.tool_calls && msg.tool_calls.length" class="tool-section">
            <div v-for="(tc, i) in msg.tool_calls" :key="i" class="tool-row">
              <div class="tool-head" @click="(tc as any)._open = !(tc as any)._open">
                <span class="tool-tri">{{ (tc as any)._open ? '\u25BC' : '\u25B6' }}</span>
                <span :class="['tool-indicator', tc.status]"></span>
                <span class="tool-fn">{{ tc.tool }}</span>
                <span class="tool-st">{{ tc.status === 'completed' ? '完成' : tc.status === 'failed' ? '失败' : '运行中' }}</span>
                <span class="tool-time">{{ formatTime(msg.timestamp) }}</span>
              </div>
              <div v-if="(tc as any)._open" class="tool-body">
                <div v-if="tc.input" class="tool-block">
                  <div class="tool-block-title">参数</div>
                  <pre class="tool-pre">{{ formatJson(tc.input) }}</pre>
                </div>
                <div v-if="tc.output" class="tool-block">
                  <div class="tool-block-title">结果</div>
                  <pre class="tool-pre">{{ tc.output }}</pre>
                </div>
              </div>
            </div>
          </div>

          <!-- Meta -->
          <div v-if="msg.role === 'assistant' && (msg.model || msg.token_usage)" class="msg-meta">
            <span v-if="msg.model">{{ msg.model }}</span>
            <template v-if="msg.token_usage">
              <span class="meta-dot"></span>
              <span>{{ ((msg.token_usage.prompt_tokens || 0) + (msg.token_usage.completion_tokens || 0)).toLocaleString() }} tok</span>
            </template>
            <template v-if="msg.duration_ms">
              <span class="meta-dot"></span>
              <span>{{ (msg.duration_ms / 1000).toFixed(1) }}s</span>
            </template>
          </div>
        </div>
      </template>

      <!-- Streaming -->
      <div v-if="isStreaming" class="msg assistant streaming">
        <div class="msg-header">
          <span class="msg-author assistant">Hi!XNS</span>
          <span class="msg-time">现在</span>
          <span v-if="agentIteration > 0" class="iteration-badge">轮次 {{ agentIteration }}/{{ agentMaxIter }}</span>
        </div>

        <!-- Agent 状态 -->
        <div v-if="agentStatus && !currentResponse && !currentToolCalls.length" class="agent-status-bar">
          <div class="thinking-dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
          <span class="status-text">{{ agentStatus }}</span>
        </div>

        <!-- 等待响应：无文字且无工具调用且无状态 -->
        <div v-if="!currentResponse && !currentToolCalls.length && !agentStatus" class="thinking-state">
          <div class="thinking-dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
          <span class="thinking-text">思考中</span>
        </div>

        <!-- 权限审批弹窗 -->
        <div v-if="pendingApproval" class="approval-card">
          <div class="approval-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
            <span>需要您的授权</span>
          </div>
          <div class="approval-body">
            <div class="approval-cmd">
              <span class="approval-label">命令</span>
              <code>{{ pendingApproval.command }}</code>
            </div>
            <div class="approval-reason">{{ pendingApproval.reason }}</div>
          </div>
          <div class="approval-actions">
            <button class="approve-btn" @click="approveCommand">允许执行</button>
            <button class="deny-btn" @click="denyCommand">拒绝</button>
          </div>
        </div>

        <!-- 有文字内容时显示 -->
        <template v-if="currentResponse">
          <div class="msg-content ai-content markdown-body" v-html="renderMarkdown(currentResponse)"></div>
          <span class="block-cursor">█</span>
        </template>

        <!-- 工具调用 -->
        <div v-if="currentToolCalls.length" class="tool-section streaming-tools">
          <div v-for="(tc, i) in currentToolCalls" :key="i" class="tool-row compact">
            <span v-if="tc.status === 'running'" class="tool-spinner"></span>
            <span v-else :class="['tool-indicator', tc.status]"></span>
            <span class="tool-fn">{{ tc.tool }}</span>
            <span :class="['tool-st', tc.status]">{{ tc.status === 'completed' ? '完成' : tc.status === 'failed' ? '失败' : '执行中...' }}</span>
          </div>
        </div>
      </div>

      <!-- Connecting -->
      <div v-if="isConnecting" class="connecting">
        <div class="connecting-dots">
          <span class="dot"></span><span class="dot"></span><span class="dot"></span>
        </div>
        <span>连接中</span>
      </div>
    </div>

    <!-- Input -->
    <div class="input-area">
      <div class="input-box" :class="{ focused: inputFocused }">
        <span class="input-chevron">></span>
        <textarea
          v-model="inputText"
          @keydown.enter.exact.prevent="sendMessage"
          @focus="inputFocused = true"
          @blur="inputFocused = false"
          placeholder="输入消息..."
          rows="1"
          ref="textareaRef"
        ></textarea>
        <button @click="sendMessage" :disabled="!inputText.trim()" class="send-btn">
          <span class="send-key">发送</span>
          <span class="send-arrow">↩</span>
        </button>
        <button @click="cancelExecution" class="cancel-btn" v-if="isStreaming">
          <span>停止</span>
          <span class="cancel-icon">■</span>
        </button>
      </div>
      <div class="input-status">
        <span class="status-item">{{ chatStore.getActiveConfig().model || '未选择模型' }}</span>
        <span class="status-sep">/</span>
        <span class="status-item">{{ chatStore.providerMode === 'custom' ? '自定义' : 'gfw' }}</span>
        <span class="status-sep">/</span>
        <span class="status-item" :class="{ active: isStreaming }">{{ isStreaming ? '生成中' : '就绪' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted } from 'vue'
import { useChatStore } from '../stores/chat'
import { useAppStore } from '../stores/app'
import { useGfwStore } from '../stores/gfw'
import { storeToRefs } from 'pinia'
import { marked, type Tokens } from 'marked'
import hljs from 'highlight.js'
import * as api from '../api'
import { isBrowserMode, browserChat, hermesCancel } from '../api'
import IconSend from '../components/icons/IconSend.vue'
import IconStar from '../components/icons/IconStar.vue'
import IconChat from '../components/icons/IconChat.vue'
import IconSearch from '../components/icons/IconSearch.vue'
import IconStore from '../components/icons/IconStore.vue'
import IconUser from '../components/icons/IconUser.vue'
import IconSettings from '../components/icons/IconSettings.vue'
import IconChevronDown from '../components/icons/IconChevronDown.vue'

const chatStore = useChatStore()
const appStore = useAppStore()
const gfwStore = useGfwStore()
const { messages, isStreaming, currentResponse, currentToolCalls, selectedModel } = storeToRefs(chatStore)

const inputText = ref('')
const messagesRef = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const agentStatus = ref('')
const agentIteration = ref(0)
const agentMaxIter = ref(0)
const pendingApproval = ref<{ id: string; tool: string; command: string; reason: string } | null>(null)
const isConnecting = ref(false)
const inputFocused = ref(false)

// Configure marked with highlight.js
const renderer = new marked.Renderer()
renderer.code = function({ text, lang }: Tokens.Code) {
  const language = lang && hljs.getLanguage(lang) ? lang : ''
  const highlighted = language
    ? hljs.highlight(text, { language }).value
    : hljs.highlightAuto(text).value
  const displayLang = lang || 'text'
  return `<div class="code-block"><div class="code-header"><span class="code-lang">${displayLang}</span><button class="code-copy" onclick="navigator.clipboard.writeText(this.closest('.code-block').querySelector('code').textContent).then(()=>{this.textContent='已复制';setTimeout(()=>{this.textContent='复制'},1500)})">复制</button></div><pre><code class="hljs language-${displayLang}">${highlighted}</code></pre></div>`
}
marked.setOptions({ renderer })

watch(inputText, async () => {
  await nextTick()
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = Math.min(textareaRef.value.scrollHeight, 200) + 'px'
  }
})

function renderMarkdown(content: string) {
  return marked(content) as string
}

function formatJson(obj: Record<string, unknown>) {
  try { return JSON.stringify(obj, null, 2) } catch { return String(obj) }
}

function formatTime(ts: string) {
  try {
    const d = new Date(ts)
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } catch { return '' }
}

function quickAsk(text: string) {
  inputText.value = text
  sendMessage()
}

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text) return

  // 如果正在生成，先取消当前任务再发送新消息（支持中途打断/补充）
  if (isStreaming.value) {
    try { await hermesCancel() } catch { /* ignore */ }
    chatStore.finishResponse()
  }

  inputText.value = ''
  chatStore.addUserMessage(text)

  if (!isBrowserMode() && !appStore.agentRunning) {
    isConnecting.value = true
    try {
      await api.agentStart('')
      appStore.agentRunning = true
    } catch (e: unknown) {
      chatStore.addSystemMessage(`Agent 启动失败: ${e}`)
      isConnecting.value = false
      return
    }
    isConnecting.value = false
  }

  chatStore.startAssistantResponse()

  if (isBrowserMode()) {
    const config = chatStore.getActiveConfig()
    // 构造对话历史（不含当前消息，当前消息通过 content 参数传递）
    const history = messages.value
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(0, -1)  // 排除刚添加的当前用户消息
      .map(m => ({ role: m.role, content: m.content }))
    await browserChat(
      text, selectedModel.value,
      (chunk) => chatStore.appendToResponse(chunk),
      (fullText, usage) => {
        agentStatus.value = ''
        agentIteration.value = 0
        pendingApproval.value = null
        chatStore.finishResponse(usage, config.model, undefined, fullText)
      },
      (err) => {
        agentStatus.value = ''
        pendingApproval.value = null
        chatStore.finishResponse()
        chatStore.addSystemMessage(`Error: ${err}`)
      },
      config,
      // onToolCall
      (tool, args) => { chatStore.addToolCall(tool, args) },
      // onToolResult
      (tool, result, duration) => {
        const idx = chatStore.currentToolCalls.findIndex(tc => tc.tool === tool && tc.status === 'running')
        if (idx >= 0) chatStore.completeToolCall(idx, result.substring(0, 500), 'completed')
      },
      history,
      // onStatus
      (message, iteration, maxIterations) => {
        agentStatus.value = message
        agentIteration.value = iteration
        agentMaxIter.value = maxIterations
      },
      // onApproval
      (id, tool, command, reason) => {
        pendingApproval.value = { id, tool, command, reason }
      },
      // sessionId — 续接 hermes 会话
      chatStore.getHermesSessionId(),
      // onSessionId — 保存 hermes 返回的 session_id
      (sid) => { chatStore.setHermesSessionId(sid) },
    )
  } else {
    try { await api.agentSendMessage(text, selectedModel.value) }
    catch { chatStore.finishResponse() }
  }
}

watch(() => messages.value.length, async () => { await nextTick(); scrollToBottom() })
watch(() => currentResponse.value, async () => { await nextTick(); scrollToBottom() })

function scrollToBottom() {
  if (messagesRef.value) messagesRef.value.scrollTop = messagesRef.value.scrollHeight
}

function approveCommand() {
  pendingApproval.value = null
  // Currently auto-approved on server side; future: send approval via WebSocket
}

function denyCommand() {
  pendingApproval.value = null
  chatStore.addSystemMessage('用户拒绝了命令执行')
}

async function cancelExecution() {
  try {
    await hermesCancel()
    agentStatus.value = ''
    pendingApproval.value = null
    chatStore.finishResponse()
    chatStore.addSystemMessage('已停止执行')
  } catch { /* ignore */ }
}

onMounted(async () => {
  if (gfwStore.models.length === 0) await gfwStore.fetchModels()
})
</script>

<style scoped>
/* ===== Layout ===== */
.chat-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: transparent;
  position: relative;
  overflow: hidden;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  padding-bottom: 140px; /* 给浮动 input-area 留出足够空间（input-area padding-top 48px + 输入框 ~60px + 底部 16px + 余量） */
}

/* ===== Empty state - Terminal ===== */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 40px;
}

.empty-inner {
  max-width: 520px;
  width: 100%;
}

.terminal-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: var(--glass-bg);
  backdrop-filter: blur(12px) saturate(1.4);
  -webkit-backdrop-filter: blur(12px) saturate(1.4);
  border: 1px solid var(--glass-border);
  border-bottom: none;
  border-radius: 12px 12px 0 0;
}

.terminal-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.terminal-dot.red { background: #FF5F57; }
.terminal-dot.yellow { background: #FEBC2E; }
.terminal-dot.green { background: #28C840; }

.terminal-title {
  margin-left: 8px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.terminal-body {
  background: #0D1117;
  border: 1px solid var(--color-border);
  border-top: none;
  border-radius: 0 0 8px 8px;
  padding: 16px 18px;
}

.terminal-line {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 2;
}

.t-prompt { color: #22C55E; user-select: none; }
.t-cmd { color: #E6EDF3; font-weight: 600; }
.t-flag { color: #7EE787; }
.t-text { color: #8B949E; }
.t-text.dim { color: #484F58; }
.t-status { color: #3B82F6; }

.t-cursor {
  color: #E6EDF3;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Quick actions */
.quick-actions {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.quick-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  cursor: pointer;
  border-radius: var(--radius-btn);
  border: 1px solid transparent;
  transition: all 0.15s;
}

.quick-item:hover {
  background: var(--glass-bg);
  border-color: var(--glass-border);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.qa-icon {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-tertiary);
  user-select: none;
  flex-shrink: 0;
}

.qa-text {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-text-secondary);
}

.quick-item:hover .qa-text {
  color: var(--color-text-primary);
}

.quick-item:hover .qa-icon {
  color: var(--color-primary);
}

/* ===== Messages ===== */
.msg {
  padding: 20px 48px;
  border-bottom: 1px solid var(--color-border-subtle);
}

.msg:last-child {
  border-bottom: none;
}

.msg.user {
  background: var(--color-bg-page);
}

.msg.assistant {
  background: var(--glass-bg);
  backdrop-filter: blur(8px) saturate(1.3);
  -webkit-backdrop-filter: blur(8px) saturate(1.3);
}

.msg-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.msg-author {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.msg-author.user { color: var(--color-text-tertiary); }
.msg-author.assistant { color: var(--color-primary); }

.msg-time {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-tertiary);
  opacity: 0.6;
}

/* Content */
.msg-content {
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-primary);
}

.user-content {
  white-space: pre-wrap;
  word-break: break-word;
}

/* ===== Markdown ===== */
.markdown-body { word-break: break-word; }
.markdown-body :deep(p) { margin: 6px 0; }
.markdown-body :deep(p:first-child) { margin-top: 0; }
.markdown-body :deep(p:last-child) { margin-bottom: 0; }

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  margin: 16px 0 6px;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.3px;
}
.markdown-body :deep(h1) { font-size: 18px; }
.markdown-body :deep(h2) { font-size: 16px; }
.markdown-body :deep(h3) { font-size: 14px; font-weight: 600; }

.markdown-body :deep(strong) {
  font-weight: 600;
  color: var(--color-text-primary);
}

/* Code blocks with syntax highlighting */
.markdown-body :deep(.code-block) {
  margin: 12px 0;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #21262D;
}

.markdown-body :deep(.code-header) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 14px;
  background: #161B22;
  border-bottom: 1px solid #21262D;
}

.markdown-body :deep(.code-lang) {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  color: #7D8590;
  text-transform: lowercase;
}

.markdown-body :deep(.code-copy) {
  font-family: var(--font-mono);
  font-size: 10px;
  color: #7D8590;
  background: transparent;
  border: 1px solid #30363D;
  border-radius: 4px;
  padding: 2px 8px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}

.markdown-body :deep(.code-copy:hover) {
  color: #E6EDF3;
  border-color: #484F58;
}

.markdown-body :deep(.code-block pre) {
  background: #0D1117;
  margin: 0;
  padding: 14px 16px;
  overflow-x: auto;
  border: none;
  border-radius: 0;
}

.markdown-body :deep(.code-block pre code) {
  background: none;
  border: none;
  padding: 0;
  color: #E6EDF3;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.6;
}

/* Fallback for pre without code-block wrapper */
.markdown-body :deep(pre) {
  background: #0D1117;
  border: 1px solid #21262D;
  border-radius: 6px;
  padding: 14px 16px;
  overflow-x: auto;
  margin: 12px 0;
}

.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
  border: none;
  color: #E6EDF3;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.6;
}

/* highlight.js token colors (GitHub Dark) */
.markdown-body :deep(.hljs-keyword),
.markdown-body :deep(.hljs-selector-tag),
.markdown-body :deep(.hljs-built_in),
.markdown-body :deep(.hljs-type) { color: #FF7B72; }

.markdown-body :deep(.hljs-string),
.markdown-body :deep(.hljs-addition) { color: #A5D6FF; }

.markdown-body :deep(.hljs-number),
.markdown-body :deep(.hljs-literal),
.markdown-body :deep(.hljs-meta .hljs-meta-string) { color: #79C0FF; }

.markdown-body :deep(.hljs-comment),
.markdown-body :deep(.hljs-deletion) { color: #8B949E; }

.markdown-body :deep(.hljs-function),
.markdown-body :deep(.hljs-title),
.markdown-body :deep(.hljs-title.function_) { color: #D2A8FF; }

.markdown-body :deep(.hljs-variable),
.markdown-body :deep(.hljs-attr),
.markdown-body :deep(.hljs-params) { color: #FFA657; }

.markdown-body :deep(.hljs-class .hljs-title),
.markdown-body :deep(.hljs-title.class_) { color: #FFA657; }

.markdown-body :deep(.hljs-symbol),
.markdown-body :deep(.hljs-bullet) { color: #7EE787; }

.markdown-body :deep(.hljs-regexp) { color: #7EE787; }

.markdown-body :deep(.hljs-selector-class),
.markdown-body :deep(.hljs-selector-attr),
.markdown-body :deep(.hljs-selector-pseudo) { color: #D2A8FF; }

.markdown-body :deep(.hljs-template-tag),
.markdown-body :deep(.hljs-template-variable) { color: #FFA657; }

.markdown-body :deep(.hljs-doctag) { color: #FF7B72; }

.markdown-body :deep(.hljs-tag) { color: #7EE787; }
.markdown-body :deep(.hljs-name) { color: #7EE787; }
.markdown-body :deep(.hljs-attribute) { color: #79C0FF; }

.markdown-body :deep(code) {
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  padding: 1px 5px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-primary);
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 20px;
  margin: 8px 0;
}
.markdown-body :deep(li) { margin: 3px 0; }

.markdown-body :deep(blockquote) {
  border-left: 2px solid var(--color-border);
  padding: 6px 14px;
  margin: 12px 0;
  color: var(--color-text-secondary);
}

.markdown-body :deep(a) {
  color: var(--color-primary);
  text-decoration: none;
}
.markdown-body :deep(a:hover) { text-decoration: underline; }

.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 14px 0;
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
  font-size: 13px;
}
.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid var(--color-border);
  padding: 6px 10px;
  text-align: left;
}
.markdown-body :deep(th) {
  background: var(--color-bg-input);
  font-weight: 600;
}

.markdown-body :deep(img) {
  max-width: 100%;
  border-radius: 6px;
  margin: 6px 0;
}

/* ===== Tool calls ===== */
.tool-section {
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid var(--color-border);
}

.tool-row { margin-bottom: 2px; }

.tool-head {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-secondary);
  transition: color 0.12s;
}

.tool-head:hover { color: var(--color-text-primary); }

.tool-tri {
  font-size: 8px;
  color: var(--color-text-tertiary);
  width: 10px;
  user-select: none;
}

.tool-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.tool-indicator.completed { background: var(--color-success); }
.tool-indicator.failed { background: var(--color-error); }
.tool-indicator.running {
  background: var(--color-warning);
  animation: pulse 1.5s ease infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.tool-fn {
  font-weight: 600;
  color: var(--color-text-primary);
}

.tool-st {
  color: var(--color-text-tertiary);
  font-size: 11px;
}

.tool-time {
  margin-left: auto;
  font-size: 10px;
  color: var(--color-text-tertiary);
  opacity: 0.5;
}

.tool-body {
  padding: 4px 0 6px 16px;
}

.tool-block { margin-top: 4px; }

.tool-block-title {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 3px;
}

.tool-pre {
  background: #0D1117;
  color: #8B949E;
  border: 1px solid #21262D;
  padding: 10px 12px;
  border-radius: 4px;
  max-height: 180px;
  overflow: auto;
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
}

/* ===== Streaming ===== */

/* Thinking state — waiting for first response */
.thinking-state {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
}

.thinking-dots {
  display: flex;
  align-items: center;
  gap: 4px;
}

.thinking-dots .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-primary);
  animation: dotBounce 1.4s ease-in-out infinite;
}

.thinking-dots .dot:nth-child(2) { animation-delay: 0.16s; }
.thinking-dots .dot:nth-child(3) { animation-delay: 0.32s; }

@keyframes dotBounce {
  0%, 80%, 100% { opacity: 0.25; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1.1); }
}

.thinking-text {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-tertiary);
  animation: fadeInOut 2s ease infinite;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* Tool spinner — rotating ring for running tools */
.tool-spinner {
  width: 10px;
  height: 10px;
  border: 1.5px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.streaming-tools .tool-row.compact {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 0;
  font-family: var(--font-mono);
  font-size: 12px;
}

.tool-st.running {
  color: var(--color-primary);
}

.tool-st.completed {
  color: var(--color-success);
}

.tool-st.failed {
  color: var(--color-error);
}

.block-cursor {
  font-family: var(--font-mono);
  color: var(--color-primary);
  animation: blink 1s step-end infinite;
  font-size: 14px;
  margin-left: 1px;
}

.streaming .msg-author {
  position: relative;
}

/* Connecting dots */
.connecting {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 48px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-tertiary);
}

/* Agent status bar */
.agent-status-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
}

.agent-status-bar .status-text {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-primary);
  animation: fadeInOut 2s ease infinite;
}

/* Iteration badge */
.iteration-badge {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-primary);
  background: var(--color-primary-light);
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 600;
}

/* Approval card */
.approval-card {
  margin: 10px 0;
  background: var(--glass-bg);
  backdrop-filter: blur(16px) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(16px) saturate(var(--glass-saturate));
  border: 1px solid var(--color-warning);
  border-radius: 10px;
  overflow: hidden;
  animation: slideIn 0.2s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.approval-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(245, 158, 11, 0.08);
  border-bottom: 1px solid var(--color-border);
  color: var(--color-warning);
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 600;
}

.approval-body {
  padding: 12px 14px;
}

.approval-cmd {
  margin-bottom: 8px;
}

.approval-label {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 4px;
}

.approval-cmd code {
  display: block;
  background: #0D1117;
  color: #FF7B72;
  padding: 8px 10px;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 12px;
  word-break: break-all;
  white-space: pre-wrap;
}

.approval-reason {
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.approval-actions {
  display: flex;
  gap: 8px;
  padding: 10px 14px;
  border-top: 1px solid var(--color-border);
}

.approve-btn {
  padding: 5px 14px;
  background: var(--color-success);
  border: none;
  border-radius: 6px;
  color: #fff;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.12s;
}

.approve-btn:hover { opacity: 0.85; }

.deny-btn {
  padding: 5px 14px;
  background: transparent;
  border: 1px solid var(--color-error);
  border-radius: 6px;
  color: var(--color-error);
  font-family: var(--font-mono);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.12s;
}

.deny-btn:hover { background: rgba(239, 68, 68, 0.08); }

.connecting-dots {
  display: flex;
  align-items: center;
  gap: 3px;
}

.connecting-dots .dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-text-tertiary);
  animation: dotBounce 1.4s ease-in-out infinite;
}

.connecting-dots .dot:nth-child(2) { animation-delay: 0.16s; }
.connecting-dots .dot:nth-child(3) { animation-delay: 0.32s; }

/* ===== Meta ===== */
.msg-meta {
  display: flex;
  align-items: center;
  gap: 0;
  margin-top: 10px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.meta-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--color-text-tertiary);
  margin: 0 8px;
  opacity: 0.5;
}

/* ===== System messages ===== */
.sys-line {
  padding: 8px 48px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-tertiary);
  background: var(--color-tool-bg);
  border-bottom: 1px solid var(--color-border-subtle);
}

.sys-prefix {
  color: var(--color-warning);
  margin-right: 8px;
  font-weight: 600;
}

.sys-text {
  word-break: break-word;
}

/* ===== Input ===== */
.input-area {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 48px 16px;
  padding-top: 48px;
  z-index: 10;
  background: linear-gradient(to top,
    var(--color-bg-page) 0%,
    var(--color-bg-page) 30%,
    transparent 100%
  );
}

.input-box {
  display: flex;
  align-items: flex-start;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 10px 14px;
  gap: 8px;
  box-shadow: 0 1px 8px rgba(0,0,0,0.08), 0 0 0 1px var(--glass-border);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-box.focused {
  border-color: var(--color-primary);
  box-shadow: 0 2px 20px rgba(10,132,255,0.12);
}

.input-chevron {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-tertiary);
  line-height: 1.6;
  padding-top: 2px;
  user-select: none;
  flex-shrink: 0;
}

.input-box.focused .input-chevron {
  color: var(--color-primary);
}

textarea {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--color-text-primary);
  resize: none;
  font-size: 14px;
  font-family: var(--font-family);
  padding: 2px 0;
  outline: none;
  line-height: 1.6;
  min-height: 22px;
}

textarea::placeholder {
  color: var(--color-text-tertiary);
}

.send-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-tertiary);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 11px;
  transition: all 0.12s;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 1px;
}

.send-btn:hover:not(:disabled) {
  border-color: var(--color-text-secondary);
  color: var(--color-text-primary);
  background: var(--color-bg-input);
}

.send-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.send-key { font-weight: 500; }

.cancel-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--color-error);
  border: none;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  transition: opacity 0.12s;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 1px;
}

.cancel-btn:hover { opacity: 0.85; }
.cancel-icon { font-size: 9px; }
.send-arrow { font-size: 12px; }

.input-status {
  display: flex;
  align-items: center;
  padding: 6px 2px 0;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-tertiary);
  opacity: 0.6;
  gap: 0;
}

.status-item { padding: 0 4px; }
.status-item.active { color: var(--color-primary); opacity: 1; }
.status-sep { padding: 0 2px; opacity: 0.3; }


/* ===== Scrollbar ===== */
.messages::-webkit-scrollbar { width: 6px; }
.messages::-webkit-scrollbar-track { background: transparent; }
.messages::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 3px; }
.messages::-webkit-scrollbar-thumb:hover { background: var(--color-text-tertiary); }
</style>
