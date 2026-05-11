<template>
  <div class="chat-view">
    <div class="messages" ref="messagesRef">
      <div v-if="messages.length === 0" class="welcome">
        <h1>你好！我是 Hermes Agent</h1>
        <p>基于 gfw.net 模型，支持 56+ AI 模型</p>
        <div class="quick-actions">
          <button @click="quickAsk('解释一下量子计算的基本原理')">量子计算是什么？</button>
          <button @click="quickAsk('用 Python 写一个快速排序算法')">写个快排</button>
          <button @click="quickAsk('分析这段代码的复杂度：def foo(n): return [i**2 for i in range(n)]')">代码分析</button>
        </div>
      </div>

      <div v-for="msg in messages" :key="msg.id" :class="['message', msg.role]">
        <div class="message-content">
          <div v-if="msg.role === 'user'" class="user-text">{{ msg.content }}</div>
          <div v-else class="assistant-text">
            <div v-html="renderMarkdown(msg.content)"></div>
            <div v-if="msg.tool_calls && msg.tool_calls.length" class="tool-calls-section">
              <div v-for="(tc, i) in msg.tool_calls" :key="i" class="tool-call-card">
                <div class="tool-header">
                  <span class="tool-icon">🔧</span>
                  <span class="tool-name">{{ tc.tool }}</span>
                  <span :class="['tool-status', tc.status]">
                    {{ tc.status === 'completed' ? '✓ 完成' : tc.status === 'failed' ? '✗ 失败' : '⟳ 运行中' }}
                  </span>
                </div>
                <details v-if="tc.input">
                  <summary>输入参数</summary>
                  <pre class="tool-code">{{ formatJson(tc.input) }}</pre>
                </details>
                <details v-if="tc.output">
                  <summary>输出结果</summary>
                  <pre class="tool-code">{{ tc.output }}</pre>
                </details>
              </div>
            </div>
            <div v-if="msg.token_usage" class="token-usage">
              <span>Token: {{ msg.token_usage.prompt_tokens || 0 }} → {{ msg.token_usage.completion_tokens || 0 }}</span>
              <span v-if="msg.duration_ms">耗时: {{ msg.duration_ms }}ms</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 流式响应中 -->
      <div v-if="isStreaming" class="message assistant">
        <div class="message-content">
          <div class="assistant-text streaming">
            <div v-html="renderMarkdown(currentResponse)"></div>
            <span class="cursor">▌</span>
          </div>
          <div v-if="currentToolCalls.length" class="tool-calls-section">
            <div v-for="(tc, i) in currentToolCalls" :key="i" class="tool-call-card">
              <span class="tool-icon">🔧</span>
              <span class="tool-name">{{ tc.tool }}</span>
              <span :class="['tool-status', tc.status]">
                {{ tc.status === 'completed' ? '✓ 完成' : '⟳ 运行中' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载指示器 -->
      <div v-if="isConnecting" class="loading-indicator">
        <span class="spinner"></span>
        <span>连接 Agent 中...</span>
      </div>
    </div>

    <div class="input-area">
      <div class="input-container">
        <textarea
          v-model="inputText"
          @keydown.enter.exact.prevent="sendMessage"
          placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
          rows="1"
          ref="textareaRef"
        ></textarea>
        <div class="input-actions">
          <span class="model-indicator">{{ selectedModel }}</span>
          <button @click="sendMessage" :disabled="!inputText.trim() || isStreaming" class="send-btn">
            发送
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
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  scroll-behavior: smooth;
}

.welcome {
  text-align: center;
  padding: 80px 20px;
  color: #888;
}

.welcome h1 {
  color: #00d4ff;
  margin-bottom: 10px;
  font-size: 2rem;
}

.welcome p {
  margin-bottom: 30px;
}

.quick-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.quick-actions button {
  padding: 10px 20px;
  background: #2a2a4a;
  border: 1px solid #3a3a5a;
  border-radius: 8px;
  color: #e0e0e0;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-actions button:hover {
  background: #3a3a5a;
  border-color: #0a84ff;
}

.message {
  margin-bottom: 20px;
  display: flex;
}

.message.user {
  justify-content: flex-end;
}

.message-content {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 12px;
  line-height: 1.6;
}

.message.user .message-content {
  background: #0a84ff;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.assistant .message-content {
  background: #2a2a4a;
  border-bottom-left-radius: 4px;
}

.assistant-text :deep(p) { margin: 8px 0; }
.assistant-text :deep(pre) {
  background: #1a1a3e;
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
}
.assistant-text :deep(code) {
  background: #1a1a3e;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
}

.tool-calls-section {
  margin-top: 12px;
  border-top: 1px solid #3a3a5a;
  padding-top: 12px;
}

.tool-call-card {
  background: #1a1a3e;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 8px;
}

.tool-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.tool-status {
  margin-left: auto;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
}

.tool-status.completed { background: #00c853; color: #000; }
.tool-status.failed { background: #ff1744; color: #fff; }
.tool-status { background: #ffa500; color: #000; }

.tool-code {
  background: #0d0d2b;
  padding: 8px;
  border-radius: 4px;
  max-height: 200px;
  overflow: auto;
  font-size: 0.85rem;
  margin: 4px 0 0;
}

.token-usage {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  font-size: 0.8rem;
  color: #888;
}

.cursor {
  animation: blink 1s infinite;
  color: #00d4ff;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.input-area {
  padding: 16px 20px;
  background: #16213e;
  border-top: 1px solid #2a2a4a;
}

.input-container {
  background: #2a2a4a;
  border: 1px solid #3a3a5a;
  border-radius: 12px;
  padding: 8px;
}

.input-container:focus-within {
  border-color: #0a84ff;
}

textarea {
  width: 100%;
  background: transparent;
  border: none;
  color: #e0e0e0;
  resize: none;
  font-size: 0.95rem;
  padding: 8px;
  outline: none;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
}

.model-indicator {
  font-size: 0.8rem;
  color: #888;
}

.send-btn {
  padding: 8px 20px;
  background: #0a84ff;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
}

.send-btn:disabled {
  background: #3a3a5a;
  cursor: not-allowed;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  color: #888;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #3a3a5a;
  border-top-color: #0a84ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
