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
            <span class="terminal-title">hermes</span>
          </div>
          <div class="terminal-body">
            <div class="terminal-line">
              <span class="t-prompt">$</span>
              <span class="t-cmd">hermes</span>
              <span class="t-flag">--interactive</span>
            </div>
            <div class="terminal-line output">
              <span class="t-text">Hermes Agent v0.1.0</span>
            </div>
            <div class="terminal-line output">
              <span class="t-text dim">56+ models available via gfw.net</span>
            </div>
            <div class="terminal-line output">
              <span class="t-status">ready</span>
              <span class="t-cursor">_</span>
            </div>
          </div>
          <div class="quick-actions">
            <div class="quick-item" @click="quickAsk('Write a quicksort implementation in Python with type hints')">
              <span class="qa-icon">></span>
              <span class="qa-text">quicksort with type hints</span>
            </div>
            <div class="quick-item" @click="quickAsk('Explain how TCP three-way handshake works')">
              <span class="qa-icon">></span>
              <span class="qa-text">tcp three-way handshake</span>
            </div>
            <div class="quick-item" @click="quickAsk('Review this code for performance issues: def fib(n): return fib(n-1) + fib(n-2) if n > 1 else n')">
              <span class="qa-icon">></span>
              <span class="qa-text">code review: fibonacci</span>
            </div>
            <div class="quick-item" @click="quickAsk('Generate a Dockerfile for a Node.js app with multi-stage build')">
              <span class="qa-icon">></span>
              <span class="qa-text">dockerfile multi-stage build</span>
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

        <div v-else-if="msg.role === 'user' || (msg.content && msg.content.trim())" class="msg" :class="msg.role">
          <div class="msg-header">
            <span class="msg-author" :class="msg.role">{{ msg.role === 'user' ? 'you' : 'hermes' }}</span>
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
                <span class="tool-st">{{ tc.status === 'completed' ? 'ok' : tc.status === 'failed' ? 'err' : '...' }}</span>
                <span class="tool-time">{{ formatTime(msg.timestamp) }}</span>
              </div>
              <div v-if="(tc as any)._open" class="tool-body">
                <div v-if="tc.input" class="tool-block">
                  <div class="tool-block-title">args</div>
                  <pre class="tool-pre">{{ formatJson(tc.input) }}</pre>
                </div>
                <div v-if="tc.output" class="tool-block">
                  <div class="tool-block-title">result</div>
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
          <span class="msg-author assistant">hermes</span>
          <span class="msg-time">now</span>
        </div>
        <div class="msg-content ai-content markdown-body" v-html="renderMarkdown(currentResponse || '')"></div>
        <span class="block-cursor">█</span>
        <div v-if="currentToolCalls.length" class="tool-section">
          <div v-for="(tc, i) in currentToolCalls" :key="i" class="tool-row compact">
            <span :class="['tool-indicator', tc.status]"></span>
            <span class="tool-fn">{{ tc.tool }}</span>
            <span class="tool-st">{{ tc.status === 'completed' ? 'ok' : '...' }}</span>
          </div>
        </div>
      </div>

      <!-- Connecting -->
      <div v-if="isConnecting" class="connecting">
        <span class="connecting-spinner"></span>
        <span>connecting</span>
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
          placeholder="Ask anything..."
          rows="1"
          ref="textareaRef"
        ></textarea>
        <button @click="sendMessage" :disabled="!inputText.trim() || isStreaming" class="send-btn">
          <span class="send-key">Return</span>
          <span class="send-arrow">↵</span>
        </button>
      </div>
      <div class="input-status">
        <span class="status-item">{{ chatStore.getActiveConfig().model || 'no model' }}</span>
        <span class="status-sep">/</span>
        <span class="status-item">{{ chatStore.providerMode === 'custom' ? 'custom' : 'gfw' }}</span>
        <span class="status-sep">/</span>
        <span class="status-item" :class="{ active: isStreaming }">{{ isStreaming ? 'streaming' : 'idle' }}</span>
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
import { marked } from 'marked'
import * as api from '../api'
import { isBrowserMode, browserChat } from '../api'
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
const isConnecting = ref(false)
const inputFocused = ref(false)

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
  if (!text || isStreaming.value) return
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
    await browserChat(
      text, selectedModel.value,
      (chunk) => chatStore.appendToResponse(chunk),
      (fullText, usage) => chatStore.finishResponse(usage, config.model),
      (err) => { chatStore.finishResponse(); chatStore.addSystemMessage(`Error: ${err}`) },
      config,
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
  background: var(--color-bg-page);
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 0;
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
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-bottom: none;
  border-radius: 8px 8px 0 0;
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
  transition: background 0.12s;
}

.quick-item:hover {
  background: var(--color-bg-input);
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
  background: var(--color-bg-card);
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

/* Code - always dark */
.markdown-body :deep(pre) {
  background: #0D1117;
  border: 1px solid #21262D;
  border-radius: 6px;
  padding: 14px 16px;
  overflow-x: auto;
  margin: 12px 0;
  position: relative;
}

.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
  color: #E6EDF3;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.6;
}

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
  padding: 0 48px 16px;
  background: var(--color-bg-page);
}

.input-box {
  display: flex;
  align-items: flex-start;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 10px 12px;
  gap: 8px;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.input-box.focused {
  border-color: var(--color-text-tertiary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.08);
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

/* ===== Loading ===== */
.connecting {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  color: var(--color-text-tertiary);
  font-family: var(--font-mono);
  font-size: 12px;
}

.connecting-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== Scrollbar ===== */
.messages::-webkit-scrollbar { width: 6px; }
.messages::-webkit-scrollbar-track { background: transparent; }
.messages::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 3px; }
.messages::-webkit-scrollbar-thumb:hover { background: var(--color-text-tertiary); }
</style>
