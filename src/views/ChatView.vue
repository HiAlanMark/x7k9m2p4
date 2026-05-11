<template>
  <div class="chat-view">
    <div class="messages" ref="messagesRef">
      <!-- Welcome screen -->
      <div v-if="messages.length === 0" class="welcome">
        <div class="welcome-inner">
          <div class="welcome-logo">
            <IconStore :size="48" />
          </div>
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
              <div class="quick-card-icon icon-purple"><IconChat :size="20" /></div>
              <div class="quick-card-body">
                <div class="quick-card-title">写个快排</div>
                <div class="quick-card-desc">用 Python 实现快速排序算法</div>
              </div>
            </div>
            <div class="quick-card" @click="quickAsk('分析这段代码的复杂度：def foo(n): return [i**2 for i in range(n)]')">
              <div class="quick-card-icon icon-green"><IconSearch :size="20" /></div>
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
        <!-- User message -->
        <template v-if="msg.role === 'user'">
          <div class="msg-content">
            <div class="user-bubble">
              <div class="user-text">{{ msg.content }}</div>
            </div>
            <div class="msg-time">{{ formatTime(msg.timestamp) }}</div>
          </div>
          <div class="avatar user-avatar">
            <IconUser :size="18" />
          </div>
        </template>

        <!-- System message -->
        <template v-else-if="msg.role === 'system'">
          <div class="system-msg">{{ msg.content }}</div>
        </template>

        <!-- Assistant message -->
        <template v-else>
          <div class="avatar ai-avatar">
            <IconStore :size="18" />
          </div>
          <div class="msg-content">
            <div class="assistant-bubble">
              <div class="markdown-body" v-html="renderMarkdown(msg.content)"></div>

              <!-- Tool calls -->
              <div v-if="msg.tool_calls && msg.tool_calls.length" class="tool-calls-section">
                <div class="tool-section-title">
                  <IconSettings :size="14" />
                  <span>工具调用 ({{ msg.tool_calls.length }})</span>
                </div>
                <div v-for="(tc, i) in msg.tool_calls" :key="i" class="tool-call-card">
                  <div class="tool-header" @click="(tc as any)._open = !(tc as any)._open">
                    <span :class="['tool-indicator', tc.status]"></span>
                    <span class="tool-name">{{ tc.tool }}</span>
                    <span :class="['tool-badge', tc.status]">
                      {{ tc.status === 'completed' ? '成功' : tc.status === 'failed' ? '失败' : '运行中' }}
                    </span>
                    <span class="tool-chevron">
                      <IconChevronDown :size="14" />
                    </span>
                  </div>
                  <div v-if="(tc as any)._open" class="tool-detail">
                    <div v-if="tc.input" class="tool-block">
                      <div class="tool-block-label">输入</div>
                      <pre class="tool-code">{{ formatJson(tc.input) }}</pre>
                    </div>
                    <div v-if="tc.output" class="tool-block">
                      <div class="tool-block-label">输出</div>
                      <pre class="tool-code">{{ tc.output }}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Meta info -->
            <div class="msg-meta">
              <span class="msg-time">{{ formatTime(msg.timestamp) }}</span>
              <template v-if="msg.token_usage">
                <span class="meta-dot"></span>
                <span class="meta-item">{{ (msg.token_usage.prompt_tokens || 0) + (msg.token_usage.completion_tokens || 0) }} tokens</span>
              </template>
              <template v-if="msg.duration_ms">
                <span class="meta-dot"></span>
                <span class="meta-item">{{ (msg.duration_ms / 1000).toFixed(1) }}s</span>
              </template>
              <template v-if="msg.model">
                <span class="meta-dot"></span>
                <span class="meta-item model-label">{{ msg.model }}</span>
              </template>
            </div>
          </div>
        </template>
      </div>

      <!-- Streaming response -->
      <div v-if="isStreaming" class="message-row assistant">
        <div class="avatar ai-avatar">
          <IconStore :size="18" />
        </div>
        <div class="msg-content">
          <div class="assistant-bubble streaming">
            <div class="markdown-body" v-html="renderMarkdown(currentResponse || '思考中...')"></div>
            <span class="cursor"></span>
          </div>
          <div v-if="currentToolCalls.length" class="tool-calls-section" style="margin-top: 8px;">
            <div v-for="(tc, i) in currentToolCalls" :key="i" class="tool-call-card compact">
              <span :class="['tool-indicator', tc.status]"></span>
              <span class="tool-name">{{ tc.tool }}</span>
              <span :class="['tool-badge', tc.status]">
                {{ tc.status === 'completed' ? '成功' : '运行中' }}
              </span>
              <span v-if="tc.status === 'running'" class="tool-spinner"></span>
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
          <div class="input-left">
            <span class="model-tag">{{ chatStore.getActiveConfig().model }}</span>
            <span v-if="chatStore.providerMode === 'custom'" class="provider-tag">自定义</span>
          </div>
          <button @click="sendMessage" :disabled="!inputText.trim() || isStreaming" class="send-btn">
            <IconSend :size="16" />
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
.chat-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-bg-page);
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px 40px 16px;
  scroll-behavior: smooth;
}

/* ===== Welcome ===== */
.welcome {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 65vh;
}

.welcome-inner { text-align: center; max-width: 720px; }

.welcome-logo {
  width: 72px; height: 72px; margin: 0 auto 20px;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  border-radius: 20px; color: #FFFFFF;
  box-shadow: 0 8px 32px rgba(0, 112, 255, 0.25);
}

.welcome-title {
  font-size: 40px; font-weight: 800; margin-bottom: 12px; letter-spacing: -1px;
}

.gradient-text {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}

.welcome-subtitle {
  font-size: 16px; color: var(--color-text-tertiary); margin-bottom: 48px; line-height: 1.6;
}

.quick-cards {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
  max-width: 700px; margin: 0 auto;
}

.quick-card {
  display: flex; align-items: flex-start; gap: 14px;
  background: var(--color-bg-card); border: 1px solid var(--color-border);
  border-radius: var(--radius-card); padding: 20px 18px;
  cursor: pointer; text-align: left;
  transition: all 0.25s ease; box-shadow: var(--shadow-card);
}

.quick-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-3px);
}

.quick-card-icon {
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  background: var(--color-primary-light); border-radius: 10px;
  color: var(--color-primary); flex-shrink: 0;
}

.quick-card-icon.icon-purple { background: #F0EAFF; color: var(--color-accent); }
.quick-card-icon.icon-green { background: #E8FFEA; color: var(--color-success); }

.quick-card-title { font-size: 14px; font-weight: 600; color: var(--color-text-primary); margin-bottom: 4px; }
.quick-card-desc { font-size: 12px; color: var(--color-text-tertiary); line-height: 1.5; }

/* ===== Messages ===== */
.message-row {
  display: flex; align-items: flex-start; gap: 12px;
  margin-bottom: 24px; max-width: 900px;
}

.message-row.user { flex-direction: row; justify-content: flex-end; margin-left: auto; }
.message-row.assistant { flex-direction: row; }

.avatar {
  width: 36px; height: 36px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border-radius: 10px; margin-top: 2px;
}

.user-avatar { background: linear-gradient(135deg, var(--color-primary), #0060DD); color: #fff; }
.ai-avatar { background: linear-gradient(135deg, var(--color-accent), #5028CC); color: #fff; }

.msg-content { max-width: calc(100% - 50px); min-width: 0; }

/* User bubble */
.user-bubble {
  background: linear-gradient(135deg, var(--color-primary), #0060DD);
  color: #FFFFFF; padding: 14px 18px;
  border-radius: 18px 18px 4px 18px;
  font-size: 14px; line-height: 1.7;
  word-break: break-word; white-space: pre-wrap;
  box-shadow: 0 2px 8px rgba(0, 112, 255, 0.2);
}

/* Assistant bubble */
.assistant-bubble {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 4px 18px 18px 18px;
  padding: 18px 22px;
  box-shadow: var(--shadow-card);
  font-size: 14px; line-height: 1.8;
  color: var(--color-text-primary);
  word-break: break-word;
}

/* System message */
.system-msg {
  width: 100%; text-align: center;
  padding: 8px 16px; font-size: 13px;
  color: var(--color-text-tertiary);
  background: var(--color-bg-input);
  border-radius: 20px; margin: 8px auto; max-width: 500px;
}

/* Time & meta */
.msg-time { font-size: 11px; color: var(--color-text-tertiary); margin-top: 6px; }
.message-row.user .msg-time { text-align: right; }

.msg-meta {
  display: flex; align-items: center; gap: 6px;
  margin-top: 8px; flex-wrap: wrap;
}

.meta-dot {
  width: 3px; height: 3px; border-radius: 50%;
  background: var(--color-text-tertiary);
}

.meta-item { font-size: 11px; color: var(--color-text-tertiary); }

.model-label {
  background: var(--color-bg-input); padding: 1px 8px;
  border-radius: 4px; font-family: 'SF Mono', monospace;
}

/* ===== Markdown ===== */
.markdown-body :deep(p) { margin: 8px 0; }
.markdown-body :deep(p:first-child) { margin-top: 0; }
.markdown-body :deep(p:last-child) { margin-bottom: 0; }

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  margin: 16px 0 8px; font-weight: 700; color: var(--color-text-primary);
}
.markdown-body :deep(h1) { font-size: 20px; }
.markdown-body :deep(h2) { font-size: 17px; }
.markdown-body :deep(h3) { font-size: 15px; }

.markdown-body :deep(strong) { font-weight: 600; color: var(--color-text-primary); }

.markdown-body :deep(pre) {
  background: var(--color-code-bg);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-code-border);
  padding: 16px 18px; border-radius: 0 8px 8px 0;
  overflow-x: auto; margin: 14px 0;
  font-size: 13px; line-height: 1.65;
}

.markdown-body :deep(code) {
  background: var(--color-bg-input); padding: 2px 7px;
  border-radius: 5px;
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, monospace;
  font-size: 13px; color: var(--color-primary-dark);
}

.markdown-body :deep(pre code) {
  background: none; padding: 0; color: var(--color-text-primary);
  font-size: 13px;
}

.markdown-body :deep(ul), .markdown-body :deep(ol) { padding-left: 22px; margin: 10px 0; }
.markdown-body :deep(li) { margin: 5px 0; }
.markdown-body :deep(li::marker) { color: var(--color-primary); }

.markdown-body :deep(blockquote) {
  border-left: 3px solid var(--color-accent);
  padding: 10px 18px; margin: 14px 0;
  background: var(--color-primary-light);
  border-radius: 0 8px 8px 0;
  color: var(--color-text-secondary);
  font-style: italic;
}

.markdown-body :deep(a) { color: var(--color-primary); text-decoration: none; font-weight: 500; }
.markdown-body :deep(a:hover) { text-decoration: underline; }

.markdown-body :deep(hr) {
  border: none; border-top: 1px solid var(--color-border); margin: 16px 0;
}

.markdown-body :deep(table) { width: 100%; border-collapse: collapse; margin: 14px 0; }
.markdown-body :deep(th), .markdown-body :deep(td) {
  border: 1px solid var(--color-border); padding: 10px 14px;
  text-align: left; font-size: 13px;
}
.markdown-body :deep(th) { background: var(--color-bg-page); font-weight: 600; }
.markdown-body :deep(tr:hover td) { background: var(--color-primary-light); }

.markdown-body :deep(img) { max-width: 100%; border-radius: 8px; margin: 8px 0; }

/* ===== Tool calls ===== */
.tool-calls-section {
  margin-top: 16px; padding-top: 16px;
  border-top: 1px dashed var(--color-border);
}

.tool-section-title {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 600; color: var(--color-text-tertiary);
  margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;
}

.tool-call-card {
  background: var(--color-tool-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px; margin-bottom: 8px;
  overflow: hidden;
}

.tool-call-card.compact {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px;
}

.tool-header {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; cursor: pointer;
  transition: background 0.15s;
}

.tool-header:hover { background: var(--color-bg-input); }

.tool-indicator {
  width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
}
.tool-indicator.completed { background: var(--color-success); }
.tool-indicator.failed { background: var(--color-error); }
.tool-indicator.running { background: var(--color-warning); animation: pulse 1.5s ease infinite; }

@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

.tool-name { font-size: 13px; font-weight: 600; color: var(--color-text-primary); }

.tool-badge {
  margin-left: auto; padding: 2px 10px;
  border-radius: 10px; font-size: 11px; font-weight: 500;
}
.tool-badge.completed { background: #E8FFEA; color: var(--color-success); }
.tool-badge.failed { background: #FFECE8; color: var(--color-error); }
.tool-badge.running { background: #FFF7E8; color: var(--color-warning); }

[data-theme="dark"] .tool-badge.completed { background: #0D2818; }
[data-theme="dark"] .tool-badge.failed { background: #2D0F0F; }
[data-theme="dark"] .tool-badge.running { background: #2D2010; }

.tool-chevron { color: var(--color-text-tertiary); transition: transform 0.2s; }

.tool-detail { padding: 0 14px 14px; }

.tool-block { margin-top: 8px; }
.tool-block-label { font-size: 11px; font-weight: 600; color: var(--color-text-tertiary); margin-bottom: 4px; text-transform: uppercase; }

.tool-code {
  background: var(--color-bg-card); border: 1px solid var(--color-border);
  padding: 10px 14px; border-radius: 6px;
  max-height: 200px; overflow: auto;
  font-size: 12px; font-family: 'SF Mono', 'Fira Code', Consolas, monospace;
  color: var(--color-text-primary); line-height: 1.5;
  white-space: pre-wrap; word-break: break-all;
}

.tool-spinner {
  width: 14px; height: 14px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-warning);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Streaming cursor */
.cursor {
  display: inline-block; width: 2px; height: 18px;
  background: var(--color-primary); margin-left: 2px;
  vertical-align: text-bottom;
  animation: blink 1s step-end infinite;
}

@keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }

/* ===== Input area ===== */
.input-area { padding: 0 40px 28px; background: var(--color-bg-page); }

.input-container {
  background: var(--color-bg-card); border: 1.5px solid var(--color-border);
  border-radius: 16px; padding: 14px 18px;
  box-shadow: 0 -4px 24px rgba(0,0,0,0.06);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-container:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 -4px 24px rgba(0,0,0,0.06), 0 0 0 3px rgba(0, 112, 255, 0.08);
}

textarea {
  width: 100%; background: transparent; border: none;
  color: var(--color-text-primary); resize: none;
  font-size: 14px; font-family: var(--font-family);
  padding: 4px 0; outline: none; line-height: 1.6;
}
textarea::placeholder { color: var(--color-text-tertiary); }

.input-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
.input-left { display: flex; align-items: center; gap: 8px; }

.model-tag {
  font-size: 12px; color: var(--color-text-tertiary);
  background: var(--color-bg-input); padding: 3px 10px;
  border-radius: 10px;
  font-family: 'SF Mono', monospace;
}

.provider-tag {
  font-size: 11px; color: var(--color-accent);
  background: #F0EAFF; padding: 2px 8px; border-radius: 8px; font-weight: 500;
}

[data-theme="dark"] .provider-tag { background: #1E1640; }

.send-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 22px;
  background: linear-gradient(135deg, var(--color-primary), #0060DD);
  border: none; border-radius: 10px; color: #FFFFFF;
  cursor: pointer; font-size: 13px; font-weight: 600;
  font-family: var(--font-family);
  transition: all 0.2s;
}

.send-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-primary-dark), #004ABB);
  box-shadow: 0 4px 12px rgba(0, 112, 255, 0.35);
  transform: translateY(-1px);
}

.send-btn:disabled {
  background: var(--color-bg-input); color: var(--color-text-tertiary);
  cursor: not-allowed; box-shadow: none; transform: none;
}

/* Loading indicator */
.loading-indicator {
  display: flex; align-items: center; justify-content: center;
  gap: 10px; padding: 20px;
  color: var(--color-text-tertiary); font-size: 14px;
}

.spinner {
  width: 18px; height: 18px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
