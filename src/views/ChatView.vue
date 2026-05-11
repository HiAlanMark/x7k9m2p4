<template>
  <div class="chat-view">
    <div class="messages" ref="messagesRef">
      <!-- Welcome screen -->
      <div v-if="messages.length === 0" class="welcome">
        <div class="welcome-inner">
          <h1 class="welcome-title">
            <span class="gradient-text">Hermes Agent</span>
          </h1>
          <p class="welcome-subtitle">基于 gfw.net 模型平台，支持 56+ AI 模型的智能对话助手</p>
          <div class="quick-cards">
            <div class="quick-card" @click="quickAsk('解释一下量子计算的基本原理')">
              <div class="quick-card-icon"><IconStar :size="20" /></div>
              <div class="quick-card-body">
                <div class="quick-card-title">量子计算是什么？</div>
                <div class="quick-card-desc">解释量子计算的基本原理</div>
              </div>
            </div>
            <div class="quick-card" @click="quickAsk('用 Python 写一个快速排序算法')">
              <div class="quick-card-icon"><IconChat :size="20" /></div>
              <div class="quick-card-body">
                <div class="quick-card-title">写个快排</div>
                <div class="quick-card-desc">用 Python 实现快速排序算法</div>
              </div>
            </div>
            <div class="quick-card" @click="quickAsk('分析这段代码的复杂度：def foo(n): return [i**2 for i in range(n)]')">
              <div class="quick-card-icon"><IconSearch :size="20" /></div>
              <div class="quick-card-body">
                <div class="quick-card-title">代码分析</div>
                <div class="quick-card-desc">分析代码的时间和空间复杂度</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message list -->
      <div v-for="msg in messages" :key="msg.id" :class="['message-row', msg.role]">
        <div class="message-bubble">
          <div v-if="msg.role === 'user'" class="user-bubble">{{ msg.content }}</div>
          <div v-else class="assistant-bubble">
            <div class="markdown-body" v-html="renderMarkdown(msg.content)"></div>
            <div v-if="msg.tool_calls && msg.tool_calls.length" class="tool-calls-section">
              <div v-for="(tc, i) in msg.tool_calls" :key="i" class="tool-call-card">
                <div class="tool-header">
                  <span class="tool-dot"></span>
                  <span class="tool-name">{{ tc.tool }}</span>
                  <span :class="['tool-status', tc.status]">
                    <template v-if="tc.status === 'completed'">completed</template>
                    <template v-else-if="tc.status === 'failed'">failed</template>
                    <template v-else>running</template>
                  </span>
                </div>
                <details v-if="tc.input">
                  <summary class="tool-summary">输入参数</summary>
                  <pre class="tool-code">{{ formatJson(tc.input) }}</pre>
                </details>
                <details v-if="tc.output">
                  <summary class="tool-summary">输出结果</summary>
                  <pre class="tool-code">{{ tc.output }}</pre>
                </details>
              </div>
            </div>
            <div v-if="msg.token_usage" class="token-usage">
              <span>Token: {{ msg.token_usage.prompt_tokens || 0 }} / {{ msg.token_usage.completion_tokens || 0 }}</span>
              <span v-if="msg.duration_ms" class="token-sep">|</span>
              <span v-if="msg.duration_ms">耗时: {{ msg.duration_ms }}ms</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Streaming response -->
      <div v-if="isStreaming" class="message-row assistant">
        <div class="message-bubble">
          <div class="assistant-bubble streaming">
            <div class="markdown-body" v-html="renderMarkdown(currentResponse)"></div>
            <span class="cursor"></span>
          </div>
          <div v-if="currentToolCalls.length" class="tool-calls-section">
            <div v-for="(tc, i) in currentToolCalls" :key="i" class="tool-call-card">
              <span class="tool-dot"></span>
              <span class="tool-name">{{ tc.tool }}</span>
              <span :class="['tool-status', tc.status]">
                <template v-if="tc.status === 'completed'">completed</template>
                <template v-else>running</template>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading indicator -->
      <div v-if="isConnecting" class="loading-indicator">
        <span class="spinner"></span>
        <span>连接 Agent 中...</span>
      </div>
    </div>

    <!-- Input area -->
    <div class="input-area">
      <div class="input-container">
        <textarea
          v-model="inputText"
          @keydown.enter.exact.prevent="sendMessage"
          placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
          rows="1"
          ref="textareaRef"
        ></textarea>
        <div class="input-bottom">
          <span class="model-tag">{{ selectedModel }}</span>
          <button @click="sendMessage" :disabled="!inputText.trim() || isStreaming" class="send-btn">
            <IconSend :size="18" />
            <span>发送</span>
          </button>
        </div>
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

const chatStore = useChatStore()
const appStore = useAppStore()
const gfwStore = useGfwStore()
const { messages, isStreaming, currentResponse, currentToolCalls, selectedModel } = storeToRefs(chatStore)

const inputText = ref('')
const messagesRef = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const isConnecting = ref(false)

// 自动调整 textarea 高度
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
  try {
    return JSON.stringify(obj, null, 2)
  } catch {
    return String(obj)
  }
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

  // 确保 Agent 运行 (仅 Tauri 模式)
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
    // 浏览器模式：直接调用 gfw.net API 流式对话
    await browserChat(
      text,
      selectedModel.value,
      (chunk) => chatStore.appendToResponse(chunk),
      (fullText, usage) => chatStore.finishResponse(usage, selectedModel.value),
      (err) => {
        chatStore.finishResponse()
        chatStore.addSystemMessage(`Error: ${err}`)
      }
    )
  } else {
    // Tauri 模式：通过 Agent 子进程
    try {
      await api.agentSendMessage(text, selectedModel.value)
    } catch (e: unknown) {
      chatStore.finishResponse()
    }
  }
}

// 自动滚动到底部
watch(() => messages.value.length, async () => {
  await nextTick()
  scrollToBottom()
})

watch(() => currentResponse.value, async () => {
  await nextTick()
  scrollToBottom()
})

function scrollToBottom() {
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

onMounted(async () => {
  // 加载模型列表
  if (gfwStore.models.length === 0) {
    await gfwStore.fetchModels()
  }
})
</script>

<style scoped>
.chat-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-bg-page);
}

/* ===== Messages area ===== */
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 32px 32px 16px;
  scroll-behavior: smooth;
}

/* ===== Welcome ===== */
.welcome {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.welcome-inner {
  text-align: center;
  max-width: 720px;
}

.welcome-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.gradient-text {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-subtitle {
  font-size: 16px;
  color: var(--color-text-tertiary);
  margin-bottom: 40px;
  line-height: 1.6;
}

/* Quick cards */
.quick-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 680px;
  margin: 0 auto;
}

.quick-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  padding: 20px 16px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-card);
}

.quick-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}

.quick-card-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-light);
  border-radius: 8px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.quick-card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.quick-card-desc {
  font-size: 12px;
  color: var(--color-text-tertiary);
  line-height: 1.4;
}

/* ===== Messages ===== */
.message-row {
  margin-bottom: 20px;
  display: flex;
}

.message-row.user {
  justify-content: flex-end;
}

.message-row.assistant {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 75%;
}

/* User bubble */
.user-bubble {
  background: linear-gradient(135deg, var(--color-primary), #0060DD);
  color: #FFFFFF;
  padding: 12px 18px;
  border-radius: 16px 16px 4px 16px;
  font-size: 14px;
  line-height: 1.7;
  word-break: break-word;
  white-space: pre-wrap;
}

/* Assistant bubble */
.assistant-bubble {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px 16px 16px 4px;
  padding: 16px 20px;
  box-shadow: var(--shadow-card);
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-primary);
  word-break: break-word;
}

/* Markdown content styles */
.markdown-body :deep(p) {
  margin: 8px 0;
}

.markdown-body :deep(p:first-child) {
  margin-top: 0;
}

.markdown-body :deep(p:last-child) {
  margin-bottom: 0;
}

.markdown-body :deep(pre) {
  background: var(--color-bg-page);
  border-left: 3px solid var(--color-primary);
  padding: 14px 16px;
  border-radius: 0 var(--radius-btn) var(--radius-btn) 0;
  overflow-x: auto;
  margin: 12px 0;
  font-size: 13px;
  line-height: 1.6;
}

.markdown-body :deep(code) {
  background: var(--color-bg-input);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace;
  font-size: 13px;
  color: var(--color-primary-dark);
}

.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
  color: var(--color-text-primary);
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 20px;
  margin: 8px 0;
}

.markdown-body :deep(li) {
  margin: 4px 0;
}

.markdown-body :deep(blockquote) {
  border-left: 3px solid var(--color-accent);
  padding: 8px 16px;
  margin: 12px 0;
  background: #F8F6FF;
  border-radius: 0 var(--radius-btn) var(--radius-btn) 0;
  color: var(--color-text-secondary);
}

.markdown-body :deep(a) {
  color: var(--color-primary);
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid var(--color-border);
  padding: 8px 12px;
  text-align: left;
  font-size: 13px;
}

.markdown-body :deep(th) {
  background: var(--color-bg-page);
  font-weight: 600;
}

/* Tool calls */
.tool-calls-section {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--color-border);
}

.tool-call-card {
  background: var(--color-bg-page);
  border: 1px solid var(--color-border);
  padding: 12px 14px;
  border-radius: var(--radius-btn);
  margin-bottom: 8px;
}

.tool-header {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.tool-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary);
  flex-shrink: 0;
}

.tool-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.tool-status {
  margin-left: auto;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.tool-status.completed {
  background: #E8FFEA;
  color: var(--color-success);
}

.tool-status.failed {
  background: #FFECE8;
  color: var(--color-error);
}

.tool-status.running {
  background: #FFF7E8;
  color: var(--color-warning);
}

.tool-summary {
  font-size: 12px;
  color: var(--color-text-tertiary);
  cursor: pointer;
  margin-top: 8px;
  user-select: none;
}

.tool-code {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  padding: 10px 12px;
  border-radius: 6px;
  max-height: 200px;
  overflow: auto;
  font-size: 12px;
  font-family: 'SF Mono', 'Fira Code', Consolas, monospace;
  margin: 6px 0 0;
  color: var(--color-text-primary);
  line-height: 1.5;
}

/* Token usage */
.token-usage {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.token-sep {
  color: var(--color-border);
}

/* Streaming cursor */
.cursor {
  display: inline-block;
  width: 2px;
  height: 16px;
  background: var(--color-primary);
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* ===== Input area ===== */
.input-area {
  padding: 0 32px 24px;
  background: var(--color-bg-page);
}

.input-container {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 12px 16px;
  box-shadow: 0 -2px 16px rgba(0,0,0,0.06);
  transition: border-color 0.2s;
}

.input-container:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 -2px 16px rgba(0,0,0,0.06), 0 0 0 2px rgba(0, 112, 255, 0.1);
}

textarea {
  width: 100%;
  background: transparent;
  border: none;
  color: var(--color-text-primary);
  resize: none;
  font-size: 14px;
  font-family: var(--font-family);
  padding: 4px 0;
  outline: none;
  line-height: 1.6;
}

textarea::placeholder {
  color: var(--color-text-tertiary);
}

.input-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.model-tag {
  font-size: 12px;
  color: var(--color-text-tertiary);
  background: var(--color-bg-input);
  padding: 3px 10px;
  border-radius: 10px;
}

.send-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  background: linear-gradient(135deg, var(--color-primary), #0060DD);
  border: none;
  border-radius: var(--radius-btn);
  color: #FFFFFF;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-family);
  transition: all 0.2s;
}

.send-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-primary-dark), #004ABB);
  box-shadow: 0 2px 8px rgba(0, 112, 255, 0.3);
}

.send-btn:disabled {
  background: var(--color-bg-input);
  color: var(--color-text-tertiary);
  cursor: not-allowed;
  box-shadow: none;
}

/* Loading indicator */
.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  color: var(--color-text-tertiary);
  font-size: 14px;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
