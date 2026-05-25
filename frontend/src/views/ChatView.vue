<template>
  <div class="chat-view">
    <div class="messages" ref="messagesRef" @scroll="onMessagesScroll" @click="onMessagesClick" @contextmenu.prevent="showBodyContextMenu">
      <!-- Empty state -->
      <div v-if="messages.length === 0" class="empty-state">
        <div class="empty-inner animate-spring-in">
          <!-- Status Panel (replaces old terminal) -->
          <div class="status-panel">
            <div class="status-panel-header">
              <span class="status-panel-dot" :class="appStore.connectionState"></span>
              <span class="status-panel-title">Hi!XNS Agent</span>
              <span class="status-panel-version">v{{ appVersion }}</span>
            </div>
            <div class="status-panel-body">
              <div v-if="appStore.connectionState === 'connected'" class="status-panel-ready">
                <span class="status-panel-ready-text">就绪 · {{ appStore.hermesStatus?.version?.split(' ')[0] || 'Hermes 已集成' }}</span>
              </div>
              <div v-else-if="appStore.connectionState === 'connecting'" class="status-panel-ready">
                <div class="status-panel-spinner"></div>
                <span class="status-panel-ready-text">连接中...</span>
              </div>
              <div v-else class="status-panel-ready">
                <span class="status-panel-ready-text error">后端未连接</span>
              </div>
            </div>
          </div>
          <div class="quick-actions stagger-children">
            <div class="quick-item hover-lift" @click="quickAsk('用 Python 写一个带类型提示的快速排序算法')">
              <span class="qa-icon">></span>
              <span class="qa-text">快速排序 · Python</span>
            </div>
            <div class="quick-item hover-lift" @click="quickAsk('解释 TCP 三次握手的工作原理')">
              <span class="qa-icon">></span>
              <span class="qa-text">TCP 三次握手</span>
            </div>
            <div class="quick-item hover-lift" @click="quickAsk('审查这段代码的性能问题: def fib(n): return fib(n-1) + fib(n-2) if n > 1 else n')">
              <span class="qa-icon">></span>
              <span class="qa-text">代码审查 · 斐波那契</span>
            </div>
            <div class="quick-item hover-lift" @click="quickAsk('生成一个 Node.js 应用的多阶段构建 Dockerfile')">
              <span class="qa-icon">></span>
              <span class="qa-text">Dockerfile · 多阶段构建</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <template v-for="(msg, idx) in messages" :key="msg.id">
        <div v-if="msg.role === 'system'" class="sys-line">
          <span class="sys-badge">
            <svg class="sys-icon" width="12" height="12" viewBox="0 0 1024 1024" fill="currentColor"><path d="M511.914667 85.333333c-235.52 0-426.666667 191.146667-426.666667 426.666667s191.146667 426.666667 426.666667 426.666667 426.666667-191.146667 426.666666-426.666667-191.146667-426.666667-426.666666-426.666667z m0 768c-188.586667 0-341.333333-152.746667-341.333334-341.333333s152.746667-341.333333 341.333334-341.333333 341.333333 152.746667 341.333333 341.333333-152.746667 341.333333-341.333333 341.333333z"/><path d="M512 640c-35.2 0-64 28.8-64 64S476.8 768 512 768s64-28.8 64-64S547.2 640 512 640z"/><path d="M512 256c-36.906667 0-66.176 29.269333-63.872 63.872l15.616 234.88c1.621333 23.936 22.741333 42.581333 48.256 42.581333s46.634667-18.645333 48.213333-42.581333l15.658667-234.88C578.176 285.269333 548.906667 256 512 256z"/></svg>
            <span class="sys-text">{{ msg.content }}</span>
          </span>
        </div>

        <div v-else-if="msg.role === 'user' || msg.role === 'assistant' || (msg.content && msg.content.trim())" class="msg-wrapper" :class="msg.role">
          
          <!-- User Message: Right-aligned Glass Bubble -->
          <div v-if="msg.role === 'user'" class="msg-bubble user-bubble">
            <div class="msg-content user-content">{{ msg.content }}</div>
            <div class="msg-time user-time">{{ formatTime(msg.timestamp) }}</div>
          </div>

          <!-- AI Message: Left-aligned Glass Card -->
          <div v-else class="msg-card ai-card">
            <div class="card-header">
              <span class="author-badge"><span class="ai-dot"></span> Hi!XNS</span>
              <span class="meta-info">
                <span v-if="msg.model" class="meta-tag">{{ msg.model }}</span>
                <template v-if="msg.duration_ms">
                  <span class="meta-dot"></span>
                  <span>{{ (msg.duration_ms / 1000).toFixed(1) }}s</span>
                </template>
              </span>
            </div>

            <div class="card-content markdown-body" v-html="renderMarkdown(msg.content)"></div>

            <!-- Tool calls: Accordion -->
            <div v-if="msg.tool_calls && msg.tool_calls.length" class="tool-accordion">
              <div v-for="(tc, i) in msg.tool_calls" :key="i" class="tool-item">
                <div class="tool-header" @click="(tc as any)._open = !(tc as any)._open">
                  <span class="tool-tri">{{ (tc as any)._open ? '▾' : '▸' }}</span>
                  <span :class="['tool-status', tc.status]"></span>
                  <span class="tool-name">{{ tc.tool }}</span>
                  <span class="tool-label">{{ tc.status === 'completed' ? '完成' : tc.status === 'failed' ? '失败' : '运行中...' }}</span>
                </div>
                <div v-if="(tc as any)._open" class="tool-body">
                  <div v-if="tc.input" class="tool-section">
                    <div class="tool-label-sm">Input</div>
                    <pre class="tool-json">{{ formatJson(tc.input) }}</pre>
                  </div>
                  <div v-if="tc.output" class="tool-section">
                    <div class="tool-label-sm">Output</div>
                    <pre class="tool-json">{{ tc.output }}</pre>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-footer">
              <span v-if="msg.token_usage" class="footer-tokens">
                <span class="token-item">输入 {{ (msg.token_usage.prompt_tokens || 0).toLocaleString() }}</span>
                <span class="token-item">输出 {{ (msg.token_usage.completion_tokens || 0).toLocaleString() }}</span>
              </span>
              <div class="action-group">
                <button class="action-icon" @click="copyMessage(msg.content)" title="复制">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
                <button class="action-icon" @click="regenerateMessage(idx)" :disabled="isStreaming" title="重新生成">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Streaming: AI Card Structure -->
      <div v-if="isStreaming" class="msg-wrapper assistant streaming">
        <div class="msg-card ai-card glass-glow">
          <div class="card-header">
            <span class="author-badge"><span class="ai-dot pulsing"></span> Hi!XNS</span>
            <span class="meta-info">
              <span v-if="agentIteration > 0" class="meta-tag">Iter {{ agentIteration }}/{{ agentMaxIter }}</span>
              <span class="meta-dot"></span>
              <span>Thinking...</span>
            </span>
          </div>

          <!-- Thinking State -->
          <div v-if="agentStatus && !currentResponse && !currentToolCalls.length" class="thinking-state">
            <div class="thinking-dots">
              <span></span><span></span><span></span>
            </div>
            <span class="status-text">{{ agentStatus }}</span>
          </div>

          <div v-if="!currentResponse && !currentToolCalls.length && !agentStatus" class="thinking-state">
            <div class="thinking-dots">
              <span></span><span></span><span></span>
            </div>
            <span class="status-text">思考中...</span>
          </div>

          <!-- Approval -->
          <div v-if="pendingApproval" class="approval-card">
            <div class="approval-header">
              <svg width="14" height="14" viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 42.666667C253.312 42.666667 42.666667 253.312 42.666667 512s210.645333 469.333333 469.333333 469.333333 469.333333-210.645333 469.333333-469.333333S770.688 42.666667 512 42.666667z m0 85.333333c212.565333 0 384 171.434667 384 384s-171.434667 384-384 384-384-171.434667-384-384 171.434667-384 384-384z"/><path d="M512 298.666667a42.666667 42.666667 0 0 0-42.666667 42.666666v170.666667a42.666667 42.666667 0 0 0 42.666667 42.666667 42.666667 42.666667 0 0 0 42.666667-42.666667V341.333333a42.666667 42.666667 0 0 0-42.666667-42.666666zM512 640a42.666667 42.666667 0 0 0-42.666667 42.666667 42.666667 42.666667 0 0 0 42.666667 42.666666h0.426667a42.666667 42.666667 0 0 0 42.666666-42.666666 42.666667 42.666667 0 0 0-42.666666-42.666667z"/></svg>
              <span>需要您的授权</span>
            </div>
            <div class="approval-body">
              <div class="approval-cmd">
                <span class="approval-label">Command</span>
                <code>{{ pendingApproval.command }}</code>
              </div>
              <div class="approval-reason">{{ pendingApproval.reason }}</div>
            </div>
            <div class="approval-actions">
              <button class="approve-btn" @click="approveCommand">允许执行</button>
              <button class="deny-btn" @click="denyCommand">拒绝</button>
            </div>
          </div>

          <!-- Response Content -->
          <template v-if="currentResponse">
            <div class="card-content markdown-body" :class="{ streaming: isStreaming }" v-html="renderMarkdown(currentResponse)"></div>
          </template>

          <!-- Streaming Tools -->
          <div v-if="currentToolCalls.length" class="tool-streaming">
            <div v-for="(tc, i) in currentToolCalls" :key="i" class="tool-item active">
              <div class="tool-header">
                <span v-if="tc.status === 'running'" class="tool-spinner-sm"></span>
                <span v-else :class="['tool-status', tc.status]"></span>
                <span class="tool-name">{{ tc.tool }}</span>
                <span class="tool-label">{{ tc.status === 'completed' ? '完成' : tc.status === 'failed' ? '失败' : '执行中...' }}</span>
              </div>
            </div>
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

    <div class="input-area">
      <!-- Upload bar floating above input -->
      <div class="upload-bar">
        <button @click="triggerFileUpload" class="upload-btn" title="上传文件">
          <svg width="18" height="14" viewBox="0 0 1329 1024" fill="currentColor"><path d="M1036.572 951.784h-780.721c-62.416 0-113.411-47.899-115.072-107.38l-78.125-495.818v-2.735c0-60.873 51.662-110.396 115.164-110.396h14.961v-63.036c0-60.873 51.651-110.396 115.13-110.396h234.199c42.067 0 105.428 34.714 140.178 74.338h302.237c48.717 0 161.228 35.661 166.943 104.891 45.468 14.762 78.311 56.069 78.311 104.599v2.747l-78.137 495.807c-1.659 59.493-52.643 107.38-115.072 107.38zM136.887 343.559l78.008 495.07v2.747c0 21.109 18.374 38.279 40.957 38.279h780.721c22.582 0 40.957-17.17 40.957-38.279v-2.747l78.008-495.07c-1.274-20.046-19.146-35.989-40.932-35.989h-37.075v-59.903c-1.823-3.846-12.027-14.026-34.48-24.113-23.096-10.357-46.52-15.078-58.536-15.078h-341.532l-10.87-17.147c-17.953-28.368-70.714-57.191-90-57.191h-234.199c-22.593 0-40.968 17.182-40.968 38.279v135.152h-89.135c-21.775 0-39.647 15.942-40.921 36z"/><path d="M100.875 306.542h1086.428v69.779h-1086.428z"/></svg>
        </button>
        <input 
          type="file" 
          ref="fileInputRef" 
          @change="handleFileSelect" 
          multiple 
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.md,.json,.yaml,.yml,.csv,.xml,.png,.jpg,.jpeg,.gif,.webp,.svg,.mp4,.webm,.avi,.mov,.mkv"
          class="file-input-hidden"
        />
        
        <!-- File Previews to the right of upload button -->
        <template v-if="attachedFiles.length > 0">
          <span v-for="(file, index) in attachedFiles.slice(0, 6)" :key="file.id" class="file-chip">
            <span class="file-chip-name">{{ file.file.name }}</span>
            <button @click="removeFile(index)" class="file-chip-remove" title="移除">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </span>
          <span v-if="attachedFiles.length > 6" class="file-overflow">+{{ attachedFiles.length - 6 }}</span>
        </template>
      </div>

      <div class="fab-anchor">
        <transition name="fab-fade">
          <button v-if="showScrollBtn" class="scroll-fab" @click="scrollToBottom(true)" title="滚动到底部">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </transition>

        <div class="input-capsule" :class="{ focused: inputFocused }">
        <span class="prompt-symbol">❯</span>
        
        <textarea
          v-model="inputText"
          @keydown.enter.exact.prevent="sendMessage"
          @focus="inputFocused = true"
          @blur="inputFocused = false"
          @contextmenu.prevent="showContextMenu"
          placeholder="输入指令..."
          rows="1"
          ref="textareaRef"
        ></textarea>
        
        <button @click="sendMessage" :disabled="!inputText.trim() && attachedFiles.length === 0" class="send-btn">
          <svg class="send-arrow" width="14" height="14" viewBox="0 0 1024 1024" fill="currentColor"><path d="M853.333333 128a42.666667 42.666667 0 0 0-42.666666 42.666667v298.666666c0 71.210667-56.789333 128-128 128H170.666667a42.666667 42.666667 0 0 0-42.666667 42.666667 42.666667 42.666667 0 0 0 42.666667 42.666667h512c117.632 0 213.333333-95.701333 213.333333-213.333334V170.666667a42.666667 42.666667 0 0 0-42.666667-42.666667z"/><path d="M384 384a42.666667 42.666667 0 0 0-30.165333 12.501333l-213.333334 213.333334a42.666667 42.666667 0 0 0 0 60.330666l213.333334 213.333334a42.666667 42.666667 0 0 0 60.330666 0 42.666667 42.666667 0 0 0 0-60.330667L231.168 640l182.997333-182.997333a42.666667 42.666667 0 0 0 0-60.330667A42.666667 42.666667 0 0 0 384 384z"/></svg>
        </button>
        <button @click="cancelExecution" class="cancel-btn" v-if="isStreaming">
          <span>停止</span>
          <svg class="cancel-icon" width="10" height="10" viewBox="0 0 1024 1024" fill="currentColor"><path d="M213.333333 85.333333C143.146667 85.333333 85.333333 143.146667 85.333333 213.333333v597.333334c0 70.186667 57.813333 128 128 128h597.333334c70.186667 0 128-57.813333 128-128V213.333333c0-70.186667-57.813333-128-128-128z"/></svg>
        </button>
      </div>
      </div>
      <div class="input-status">
        <span class="status-pill">{{ chatStore.getActiveConfig().model || '未选择模型' }}</span>
        <span class="status-dot-sep">·</span>
        <span class="status-pill" :class="chatStore.providerMode === 'custom' ? 'warning' : 'success'">{{ chatStore.providerMode === 'custom' ? 'Custom API' : 'gfw.net' }}</span>
        <span class="status-dot-sep">·</span>
        <span class="status-pill" :class="{ streaming: isStreaming }">{{ isStreaming ? 'Generating' : 'Ready' }}</span>
        <span v-if="messages.length > 0" class="status-dot-sep">·</span>
        <button v-if="messages.length > 0" class="export-btn" @click="exportChat" title="导出对话为 Markdown 文件">导出 Markdown</button>
      </div>
    </div>
    <!-- Context menu -->
    <div v-if="ctxMenu.show" class="ctx-menu" :style="{ top: ctxMenu.y + 'px', left: ctxMenu.x + 'px' }" @click.stop @contextmenu.prevent>
      <button v-if="ctxMenu.hasSelection && ctxMenu.source === 'body'" @click="ctxBodyCopy" class="ctx-item">复制</button>
      <button v-if="ctxMenu.hasSelection && ctxMenu.source === 'input'" @click="ctxCopy" class="ctx-item">复制</button>
      <button v-if="ctxMenu.hasSelection && ctxMenu.source === 'input'" @click="ctxCut" class="ctx-item">剪切</button>
      <button v-if="ctxMenu.hasContent && !ctxMenu.hasSelection && ctxMenu.source === 'input'" @click="ctxSelectAll" class="ctx-item">全选</button>
      <button v-if="ctxMenu.source === 'input'" @click="ctxPaste" class="ctx-item">粘贴</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted, reactive } from 'vue'
import { useChatStore } from '../stores/chat'
import { useAppStore } from '../stores/app'
import { useGfwStore } from '../stores/gfw'
import { storeToRefs } from 'pinia'
import { marked, type Tokens } from 'marked'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import * as api from '../api'
import { isBrowserMode, browserChat, hermesCancel, generateTitle } from '../api'
import IconSend from '../components/icons/IconSend.vue'
import IconStar from '../components/icons/IconStar.vue'
import IconChat from '../components/icons/IconChat.vue'
import IconSearch from '../components/icons/IconSearch.vue'
import IconStore from '../components/icons/IconStore.vue'
import IconUser from '../components/icons/IconUser.vue'
import IconSettings from '../components/icons/IconSettings.vue'
import IconChevronDown from '../components/icons/IconChevronDown.vue'
import { SpotlightCard, FadeIn, ShinyText } from '../components/fx'
import { HxBadge } from '../components/ui'
import { useToast } from '../composables/useToast'

const toast = useToast()

const chatStore = useChatStore()
const appStore = useAppStore()
const gfwStore = useGfwStore()
const appVersion = __APP_VERSION__
const { messages, isStreaming, currentResponse, currentToolCalls, selectedModel } = storeToRefs(chatStore)

const inputText = ref('')
const messagesRef = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

// Context menu state
const ctxMenu = reactive({ show: false, x: 0, y: 0, hasContent: false, hasSelection: false, source: '' as 'input' | 'body' | '' })

function showContextMenu(e: MouseEvent) {
  const ta = textareaRef.value
  ctxMenu.hasContent = !!ta?.value.length
  ctxMenu.hasSelection = ta ? ta.selectionStart !== ta.selectionEnd : false
  ctxMenu.source = 'input'
  ctxMenu.x = e.clientX
  ctxMenu.y = e.clientY
  ctxMenu.show = true
  nextTick(() => {
    document.addEventListener('click', hideContextMenu, { once: true })
  })
}

function showBodyContextMenu(e: MouseEvent) {
  const sel = window.getSelection()
  const hasText = !!(sel && sel.toString().trim())
  if (!hasText) return  // 没有选中文字时不显示菜单
  ctxMenu.hasSelection = true
  ctxMenu.hasContent = false
  ctxMenu.source = 'body'
  ctxMenu.x = e.clientX
  ctxMenu.y = e.clientY
  ctxMenu.show = true
  nextTick(() => {
    document.addEventListener('click', hideContextMenu, { once: true })
  })
}

function hideContextMenu() {
  ctxMenu.show = false
}

function ctxCopy() {
  const ta = textareaRef.value
  if (!ta) return
  ta.focus()
  try { document.execCommand('copy') } catch {}
  hideContextMenu()
}

function ctxBodyCopy() {
  try { document.execCommand('copy') } catch {}
  hideContextMenu()
}

function ctxCut() {
  const ta = textareaRef.value
  if (!ta) return
  ta.focus()
  try { document.execCommand('cut') } catch {}
  ta.dispatchEvent(new Event('input', { bubbles: true }))
  hideContextMenu()
}

function ctxPaste() {
  const ta = textareaRef.value
  if (!ta) return
  hideContextMenu()
  if (navigator.clipboard?.readText) {
    navigator.clipboard.readText().then(text => {
      if (text) {
        ta.focus()
        const start = ta.selectionStart
        const end = ta.selectionEnd
        ta.setRangeText(text, start, end, 'end')
        ta.dispatchEvent(new Event('input', { bubbles: true }))
      }
    }).catch(() => { /* 非 HTTPS 环境不可用，请用 Ctrl+V */ })
  }
}

function ctxSelectAll() {
  textareaRef.value?.select()
  hideContextMenu()
}
const attachedFiles = ref<Array<{ id: string; file: File; type: string; name: string; size: number }>>([])
const agentStatus = ref('')
const agentIteration = ref(0)
const agentMaxIter = ref(0)
const pendingApproval = ref<{ id: string; tool: string; command: string; reason: string } | null>(null)
const isConnecting = ref(false)
const inputFocused = ref(false)
const showScrollBtn = ref(false)

// Configure marked with highlight.js
const renderer = new marked.Renderer()
renderer.code = function({ text, lang }: Tokens.Code) {
  const language = lang && hljs.getLanguage(lang) ? lang : ''
  const highlighted = language
    ? hljs.highlight(text, { language }).value
    : hljs.highlightAuto(text).value
  const displayLang = lang || 'text'
  
  // Generate line numbers
  const lines = text.split('\n').length
  const lineNumbers = Array.from({ length: lines }, (_, i) => i + 1).join('\n')
  
  // Escape line numbers for HTML
  const escapedLineNumbers = lineNumbers.replace(/</g, '&lt;').replace(/>/g, '&gt;')

  return `<div class="code-window"><div class="code-tab"><span class="code-lang-icon">${getLangIcon(displayLang)} ${displayLang}</span><button class="code-copy-btn"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><span>Copy</span></button></div><div class="code-body"><div class="code-gutter">${escapedLineNumbers}</div><pre><code class="hljs language-${displayLang}">${highlighted}</code></pre></div></div>`
}

function getLangIcon(lang: string): string {
  const map: Record<string, string> = {
    python: '🐍', js: '🟨', typescript: '🔷', ts: '🔷', html: '🌐', css: '🎨',
    bash: '💻', sh: '💻', shell: '💻', json: '📦', yaml: '📝', yml: '📝',
    sql: '🗄️', go: '🐹', rust: '🦀', java: '☕', cpp: '⚙️', c: '⚙️', vue: '🟩', svelte: '🔴'
  }
  return map[lang.toLowerCase()] || '📄'
}

marked.setOptions({ renderer })

// File upload functions
const triggerFileUpload = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return
  
  const maxFileSize = 50 * 1024 * 1024 // 50MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/markdown',
    'application/json',
    'text/csv',
    'application/xml',
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'video/x-msvideo',
    'video/quicktime',
    'video/x-matroska'
  ]
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    
    // Check file size
    if (file.size > maxFileSize) {
      toast.error(`文件 "${file.name}" 超过 50MB 限制`)
      continue
    }
    
    // Check file type
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|ppt|pptx|xls|xlsx|txt|md|json|yaml|yml|csv|xml|png|jpg|jpeg|gif|webp|svg|mp4|webm|avi|mov|mkv)$/i)) {
      toast.warning(`文件类型不支持：${file.name}`)
      continue
    }
    
    attachedFiles.value.push({
      id: `${Date.now()}-${i}`,
      file,
      type: file.type || 'unknown',
      name: file.name,
      size: file.size
    })
  }
  
  // Reset input to allow re-selecting same file
  target.value = ''
  toast.success(`已添加 ${files.length} 个文件`)
}

const removeFile = (index: number) => {
  attachedFiles.value.splice(index, 1)
}

const getFileIcon = (type: string): string => {
  if (type.includes('pdf')) return '📄'
  if (type.includes('word') || type.includes('document')) return '📝'
  if (type.includes('powerpoint') || type.includes('presentation')) return '📊'
  if (type.includes('excel') || type.includes('spreadsheet')) return '📈'
  if (type.includes('image')) return '🖼️'
  if (type.includes('video')) return '🎬'
  if (type.includes('text') || type.includes('json') || type.includes('csv')) return '📄'
  return '📎'
}

const getFileIconClass = (type: string): string => {
  if (type.includes('pdf')) return 'icon-pdf'
  if (type.includes('word') || type.includes('document')) return 'icon-doc'
  if (type.includes('powerpoint') || type.includes('presentation')) return 'icon-ppt'
  if (type.includes('excel') || type.includes('spreadsheet')) return 'icon-xls'
  if (type.includes('image')) return 'icon-img'
  if (type.includes('video')) return 'icon-video'
  return 'icon-file'
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const getFilePreviewUrl = (file: File): string => {
  return URL.createObjectURL(file)
}

watch(inputText, async () => {
  await nextTick()
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = Math.min(textareaRef.value.scrollHeight, 200) + 'px'
  }
})

function renderMarkdown(content: string) {
  const html = marked(content) as string
  return DOMPurify.sanitize(html, { ADD_ATTR: ['class', 'onclick'] })
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
  const hasAttachments = attachedFiles.value.length > 0
  
  if (!text && !hasAttachments) return

  // 构建消息内容（包含文件信息）
  let messageContent = text
  if (hasAttachments) {
    const fileInfos = attachedFiles.value.map(f => 
      `[附件：${f.name} (${formatFileSize(f.size)})]`
    ).join('\n')
    messageContent = text ? `${text}\n\n${fileInfos}` : fileInfos
  }
  
  // 如果正在生成，先取消当前任务再发送新消息（支持中途打断/补充）
  if (isStreaming.value) {
    try { await hermesCancel() } catch { /* ignore */ }
    chatStore.finishResponse()
  }
  
  inputText.value = ''
  chatStore.addUserMessage(messageContent)
  
  // TODO: 实际发送文件到后端（当前先清空附件列表）
  // 后续需要实现文件上传 API 并将文件 ID 传递给模型
  const filesToSend = [...attachedFiles.value]
  attachedFiles.value = []

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
        // 首轮对话自动生成智能标题
        autoGenerateTitle(text, fullText, config)
      },
      (err) => {
        agentStatus.value = ''
        pendingApproval.value = null
        chatStore.finishResponse()
        chatStore.addSystemMessage(`错误：${err}`)
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

function scrollToBottom(smooth = false) {
  if (messagesRef.value) {
    if (smooth) {
      messagesRef.value.scrollTo({ top: messagesRef.value.scrollHeight, behavior: 'smooth' })
    } else {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  }
}

function onMessagesScroll() {
  if (!messagesRef.value) return
  const { scrollTop, scrollHeight, clientHeight } = messagesRef.value
  showScrollBtn.value = scrollHeight - scrollTop - clientHeight > 200
}

// Click delegation for code copy buttons (handles v-html inline onclick fallback)
function onMessagesClick(e: MouseEvent) {
  const btn = (e.target as HTMLElement).closest('.code-copy-btn')
  if (!btn) return
  e.preventDefault()
  const codeEl = btn.closest('.code-window')?.querySelector('code')
  if (!codeEl) return
  const text = codeEl.textContent || ''
  copyToClipboard(text, btn)
}

function copyToClipboard(text: string, btn?: HTMLElement) {
  // Try modern API first
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      if (btn) updateCopyBtn(btn)
    }).catch(() => {
      fallbackCopy(text, btn)
    })
  } else {
    fallbackCopy(text, btn)
  }
}

function fallbackCopy(text: string, btn?: HTMLElement) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.left = '-9999px'
  document.body.appendChild(ta)
  ta.select()
  try { document.execCommand('copy'); if (btn) updateCopyBtn(btn) } catch (_) {}
  document.body.removeChild(ta)
}

function updateCopyBtn(btn: HTMLElement) {
  const span = btn.querySelector('span')
  if (!span) return
  const original = span.textContent || 'Copy'
  span.textContent = '已复制!'
  setTimeout(() => { span.textContent = original }, 1500)
}

function copyMessage(content: string) {
  copyToClipboard(content)
  toast.success('已复制', undefined, 1500)
}

async function regenerateMessage(idx: number) {
  if (isStreaming.value) return
  // Find the user message right before this assistant message
  const msgs = messages.value
  let userMsgIdx = -1
  for (let i = idx - 1; i >= 0; i--) {
    if (msgs[i].role === 'user') { userMsgIdx = i; break }
  }
  if (userMsgIdx < 0) return
  const userText = msgs[userMsgIdx].content
  // Remove messages from the assistant reply onwards
  chatStore.truncateMessages(idx)
  // Re-send
  inputText.value = userText
  await nextTick()
  sendMessage()
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

async function autoGenerateTitle(userText: string, aiReply: string, config: { baseUrl: string; apiKey: string; model: string }) {
  // 只在首轮对话时生成标题（只有 1 条 user + 1 条 assistant）
  const session = chatStore.currentSession
  if (!session) return
  const userCount = session.messages.filter(m => m.role === 'user').length
  if (userCount !== 1) return
  // 如果标题已经不是默认截断标题就跳过
  const firstUser = session.messages.find(m => m.role === 'user')
  if (!firstUser) return
  const defaultTitle = firstUser.content.trim().length > 30
    ? firstUser.content.trim().substring(0, 30) + '...'
    : firstUser.content.trim()
  if (session.title !== defaultTitle && session.title !== '新会话') return
  // 后台异步生成标题，不阻塞 UI
  try {
    const title = await generateTitle(userText, aiReply, config)
    if (title && title.length >= 2) {
      chatStore.renameSession(session.id, title)
    }
  } catch { /* ignore */ }
}

onMounted(async () => {
  if (gfwStore.models.length === 0) await gfwStore.fetchModels()
})

function exportChat() {
  const session = chatStore.currentSession
  if (!session || session.messages.length === 0) return
  const title = session.title || '对话'
  const date = new Date().toLocaleDateString('zh-CN')
  let md = `# ${title}\n\n> 导出时间: ${date}\n\n---\n\n`
  for (const msg of session.messages) {
    if (msg.role === 'system') {
      md += `> **[系统]** ${msg.content}\n\n`
    } else if (msg.role === 'user') {
      md += `## 我\n\n${msg.content}\n\n`
    } else if (msg.role === 'assistant') {
      md += `## Hi!XNS\n\n${msg.content}\n\n`
      if (msg.tool_calls && msg.tool_calls.length > 0) {
        md += `<details><summary>工具调用 (${msg.tool_calls.length})</summary>\n\n`
        for (const tc of msg.tool_calls) {
          md += `- **${tc.tool}** [${tc.status}]\n`
          if (tc.input) md += `  - 参数: \`${JSON.stringify(tc.input).substring(0, 200)}\`\n`
          if (tc.output) md += `  - 结果: \`${tc.output.substring(0, 200)}\`\n`
        }
        md += `\n</details>\n\n`
      }
      if (msg.token_usage) {
        md += `*${msg.model || ''} · ⬆${msg.token_usage.prompt_tokens || 0} ⬇${msg.token_usage.completion_tokens || 0} tok*\n\n`
      }
    }
    md += `---\n\n`
  }
  // 触发浏览器下载
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${title.replace(/[/\\:*?"<>|]/g, '_')}_${new Date().toISOString().slice(0, 10)}.md`
  a.click()
  URL.revokeObjectURL(url)
  toast.success('导出成功', '对话已保存为 Markdown 文件', 3000)
}
</script>

<style scoped>
/* ===== Glass IDE Layout ===== */
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
  padding: 45px 45px;
  padding-bottom: 140px;
  scroll-behavior: smooth;
  /* Top & bottom inward Gaussian blur fade */
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0px,
    black 60px,
    black calc(100% - 150px),
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    transparent 0px,
    black 60px,
    black calc(100% - 150px),
    transparent 100%
  );
}

/* Scrollbar styling */
.messages::-webkit-scrollbar { width: 6px; }
.messages::-webkit-scrollbar-track { background: transparent; }
.messages::-webkit-scrollbar-thumb { 
  background: var(--glass-border); 
  border-radius: 10px; 
}
.messages::-webkit-scrollbar-thumb:hover { background: var(--text-tertiary); }

/* ===== Empty State ===== */
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

.status-panel {
  display: flex;
  flex-direction: column;
  background: var(--glass-base);
  backdrop-filter: blur(24px) saturate(1.5);
  -webkit-backdrop-filter: blur(24px) saturate(1.5);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 24px;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
}

.status-panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--glass-border);
}

.status-panel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-panel-dot.connected { background: var(--success); box-shadow: 0 0 8px rgba(48, 209, 88, 0.4); }
.status-panel-dot.connecting { background: var(--warning); box-shadow: 0 0 8px rgba(255, 159, 10, 0.4); }
.status-panel-dot.disconnected { background: var(--error); }

.status-panel-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.status-panel-version {
  margin-left: auto;
  font-size: 11px;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
}

.status-panel-body {
  padding: 12px 16px;
}

.status-panel-ready {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-panel-ready-text {
  font-size: 13px;
  color: var(--primary-text);
  font-weight: 500;
}

.status-panel-ready-text.error {
  color: var(--error);
}

.status-panel-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 159, 10, 0.3);
  border-top-color: var(--warning);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Quick actions */
.quick-actions {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  border-radius: 12px;
  border: 1px solid transparent;
  transition: all 0.2s var(--ease-expo);
}

.quick-item:hover {
  background: var(--glass-base);
  border-color: var(--glass-border);
  backdrop-filter: blur(16px);
}

.qa-icon {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-tertiary);
  user-select: none;
  flex-shrink: 0;
}

.qa-text {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text-secondary);
}

.quick-item:hover .qa-text { color: var(--text-primary); }
.quick-item:hover .qa-icon { color: var(--primary-text); }

/* ===== Message Wrappers ===== */
.msg-wrapper {
  display: flex;
  margin-bottom: 24px;
  transition: all 0.3s var(--ease-expo);
}

.msg-wrapper.user {
  justify-content: flex-end;
}

.msg-wrapper.assistant {
  justify-content: flex-start;
}

/* ===== User Bubble ===== */
.msg-bubble.user-bubble {
  max-width: 75%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  animation: bubblePop 0.3s var(--ease-expo) both;
}

@keyframes bubblePop {
  from { opacity: 0; transform: translateY(10px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.user-content {
  background: linear-gradient(135deg, rgba(90, 200, 250, 0.22) 0%, rgba(90, 200, 250, 0.12) 100%);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid rgba(90, 200, 250, 0.32);
  border-right-color: rgba(90, 200, 250, 0.18);
  box-shadow: inset 0 0 0 1px rgba(90, 200, 250, 0.08), 0 0 12px rgba(90, 200, 250, 0.1);
  border-radius: 18px 18px 4px 18px;
  padding: 10px 16px;
  font-size: 14px;
  line-height: 1.65;
  color: var(--text-primary);
  white-space: pre-wrap;
  word-break: break-word;
}

.user-time {
  font-size: 10px;
  color: var(--text-tertiary);
  padding-right: 4px;
  opacity: 0.6;
}

/* ===== AI Glass Card ===== */
.msg-card.ai-card {
  width: 100%;
  max-width: 900px;
  background: var(--glass-base);
  backdrop-filter: blur(48px) saturate(2);
  -webkit-backdrop-filter: blur(48px) saturate(2);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: var(--glass-inset), 0 4px 20px rgba(0, 0, 0, 0.05);
  animation: cardSlideIn 0.4s var(--ease-expo) both;
  overflow: hidden;
}

.msg-card.ai-card.glass-glow {
  border-color: rgba(10, 132, 255, 0.2);
  box-shadow: 0 0 12px rgba(10, 132, 255, 0.1);
}

@keyframes cardSlideIn {
  from { opacity: 0; transform: translateY(16px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-bottom: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.02);
}

.author-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--primary-text);
}

.ai-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--success);
  box-shadow: 0 0 6px rgba(48, 209, 88, 0.4);
}

.ai-dot.pulsing {
  animation: pulseDot 1.5s ease-in-out infinite;
}

@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.8); }
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-tertiary);
  margin-left: auto;
}

.meta-tag {
  font-family: var(--font-mono);
  background: rgba(10, 132, 255, 0.08);
  color: var(--primary-text);
  padding: 2px 6px;
  border-radius: 6px;
}

.meta-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--text-tertiary);
}

.meta-tokens {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.meta-icon {
  flex-shrink: 0;
  color: var(--text-tertiary);
}

.meta-icon.token-down {
  transform: scaleY(-1);
}

.card-content {
  padding: 20px 24px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-primary);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  padding: 8px 12px;
  border-top: 1px solid var(--glass-border);
}

.footer-tokens {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--text-tertiary);
}

.token-item {
  white-space: nowrap;
}

.action-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.15s;
}

.action-icon:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.06);
  border-color: var(--glass-border);
  color: var(--text-primary);
}

.action-icon:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* ===== Tools: Accordion ===== */
.tool-accordion {
  border-top: 1px solid var(--glass-border);
  margin: 0 16px;
}

.tool-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.tool-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 4px;
  cursor: pointer;
  font-size: 12px;
  color: var(--text-secondary);
  transition: all 0.15s;
}

.tool-header:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  padding-left: 8px;
}

.tool-tri {
  font-size: 8px;
  color: var(--text-tertiary);
  width: 12px;
  transition: transform 0.2s;
}

.tool-status {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.tool-status.completed { background: var(--success); }
.tool-status.failed { background: var(--error); }
.tool-status.running {
  background: var(--warning);
  animation: pulseDot 1s ease infinite;
}

.tool-name {
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--text-primary);
}

.tool-label {
  font-size: 11px;
  color: var(--text-tertiary);
  margin-left: auto;
}

.tool-body {
  padding: 4px 0 8px 20px;
}

.tool-section {
  margin-top: 6px;
}

.tool-label-sm {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.tool-json {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 10px 12px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-secondary);
  max-height: 200px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.5;
}

/* ===== Markdown Styles ===== */
.markdown-body { word-break: break-word; color: var(--text-primary); }
.markdown-body :deep(p) { margin: 8px 0; }
.markdown-body :deep(p:first-child) { margin-top: 0; }
.markdown-body :deep(p:last-child) { margin-bottom: 0; }

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  margin: 20px 0 8px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.2px;
  line-height: 1.3;
}
.markdown-body :deep(h1) { font-size: 20px; }
.markdown-body :deep(h2) { font-size: 17px; }
.markdown-body :deep(h3) { font-size: 15px; font-weight: 600; }

.markdown-body :deep(strong) { font-weight: 600; color: var(--text-primary); }

/* Code Window (IDE Style) */
.markdown-body :deep(.code-window) {
  margin: 16px 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--glass-border);
  background: #0D1117;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}

.markdown-body :deep(.code-tab) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid var(--glass-border);
}

.markdown-body :deep(.code-lang-icon) {
  font-size: 11px;
  font-weight: 600;
  color: #8B949E;
  text-transform: lowercase;
}

.markdown-body :deep(.code-copy-btn) {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #8B949E;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 3px 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.markdown-body :deep(.code-copy-btn:hover) {
  color: #E6EDF3;
  border-color: rgba(90, 200, 250, 0.4);
  background: rgba(90, 200, 250, 0.15);
}

.markdown-body :deep(.code-body) {
  display: flex;
  overflow: auto;
}

.markdown-body :deep(.code-gutter) {
  flex-shrink: 0;
  padding: 16px 8px;
  text-align: right;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.65;
  color: #484F58;
  background: rgba(255, 255, 255, 0.01);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  user-select: none;
  white-space: pre;
}

.markdown-body :deep(.code-body pre) {
  margin: 0;
  padding: 16px;
  overflow: auto;
  flex: 1;
  background: transparent;
  border: none;
  border-radius: 0;
}

.markdown-body :deep(code.hljs) {
  background: none;
  padding: 0;
  color: #E6EDF3;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.65;
}

/* highlight.js token colors (GitHub Dark) */
.markdown-body :deep(.hljs-keyword),
.markdown-body :deep(.hljs-selector-tag),
.markdown-body :deep(.hljs-built_in),
.markdown-body :deep(.hljs-type) { color: #FF7B72; }

.markdown-body :deep(.hljs-string),
.markdown-body :deep(.hljs-addition) { color: #A5D6FF; }

.markdown-body :deep(.hljs-number),
.markdown-body :deep(.hljs-literal) { color: #79C0FF; }

.markdown-body :deep(.hljs-comment),
.markdown-body :deep(.hljs-deletion) { color: #8B949E; }

.markdown-body :deep(.hljs-function),
.markdown-body :deep(.hljs-title) { color: #D2A8FF; }

.markdown-body :deep(.hljs-variable),
.markdown-body :deep(.hljs-attr) { color: #FFA657; }

.markdown-body :deep(.hljs-symbol),
.markdown-body :deep(.hljs-bullet) { color: #7EE787; }

.markdown-body :deep(.hljs-regexp) { color: #7EE787; }

.markdown-body :deep(.hljs-tag) { color: #7EE787; }
.markdown-body :deep(.hljs-name) { color: #7EE787; }
.markdown-body :deep(.hljs-attribute) { color: #79C0FF; }

/* Inline code */
.markdown-body :deep(code:not(.hljs)) {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--glass-border);
  padding: 2px 6px;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-primary);
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) { padding-left: 22px; margin: 10px 0; }
.markdown-body :deep(li) { margin: 4px 0; line-height: 1.65; }

.markdown-body :deep(blockquote) {
  border-left: 3px solid var(--primary);
  padding: 8px 16px;
  margin: 14px 0;
  color: var(--text-secondary);
  background: rgba(90, 200, 250, 0.03);
  border-radius: 0 8px 8px 0;
}

.markdown-body :deep(a) {
  color: var(--primary-text);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.15s;
}
.markdown-body :deep(a:hover) { border-bottom-color: var(--primary-text); }

.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--glass-border);
  margin: 18px 0;
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 14px 0;
  font-size: 13px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--glass-border);
}
.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid var(--glass-border);
  padding: 8px 12px;
  text-align: left;
}
.markdown-body :deep(th) {
  background: rgba(255, 255, 255, 0.04);
  font-weight: 600;
}

.markdown-body :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 8px 0;
  border: 1px solid var(--glass-border);
}

/* ===== Streaming & Thinking ===== */
.thinking-state {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 24px;
}

.thinking-dots {
  display: flex;
  align-items: center;
  gap: 4px;
}

.thinking-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--primary-text);
  animation: dotPulse 1.2s ease infinite;
}

.thinking-dots span:nth-child(1) { animation-delay: 0s; }
.thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
.thinking-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes dotPulse {
  0%, 60%, 100% { opacity: 0.2; transform: scale(0.8); }
  30% { opacity: 1; transform: scale(1.2); }
}

.thinking-state .status-text {
  font-size: 13px;
  color: var(--primary-text);
  animation: thinkingPulse 2.4s ease infinite;
}

@keyframes thinkingPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* Cursor: inline at end of last line via ::after */
.card-content.streaming::after {
  content: '\258C';
  display: inline;
  font-family: var(--font-mono);
  color: var(--primary-text);
  animation: cursorBlink 0.7s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  margin-left: 1px;
  text-shadow: 0 0 8px rgba(90, 200, 250, 0.6);
}

@keyframes cursorBlink {
  0%, 100% { opacity: 0.1; }
  45%, 55% { opacity: 1; }
}

.tool-streaming .tool-item.active {
  opacity: 1;
}

.tool-spinner-sm {
  width: 10px;
  height: 10px;
  border: 1.5px solid var(--glass-border);
  border-top-color: var(--primary-text);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  flex-shrink: 0;
}

/* Approval Card */
.approval-card {
  margin: 12px 0;
  background: var(--glass-base);
  backdrop-filter: blur(16px) saturate(1.5);
  border: 1px solid var(--warning);
  border-radius: 12px;
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
  background: rgba(255, 159, 10, 0.08);
  border-bottom: 1px solid var(--glass-border);
  color: var(--warning);
  font-size: 12px;
  font-weight: 600;
}

.approval-body { padding: 12px 14px; }

.approval-cmd { margin-bottom: 8px; }

.approval-label {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-tertiary);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.approval-cmd code {
  display: block;
  background: rgba(0, 0, 0, 0.2);
  color: #FF7B72;
  padding: 8px 10px;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 12px;
}

.approval-reason {
  font-size: 12px;
  color: var(--text-secondary);
}

.approval-actions {
  display: flex;
  gap: 8px;
  padding: 10px 14px;
  border-top: 1px solid var(--glass-border);
}

.approve-btn {
  padding: 6px 16px;
  background: var(--success);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.deny-btn {
  padding: 6px 16px;
  background: transparent;
  border: 1px solid var(--error);
  border-radius: 8px;
  color: var(--error);
  cursor: pointer;
}

/* ===== System Messages ===== */
.sys-line {
  display: flex;
  justify-content: center;
  padding: 14px 48px;
}

.sys-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-tertiary);
  background: var(--glass-base);
  backdrop-filter: blur(8px) saturate(1.2);
  -webkit-backdrop-filter: blur(8px) saturate(1.2);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  padding: 4px 14px 4px 10px;
  animation: pillIn 0.3s var(--ease-expo) both;
}

@keyframes pillIn {
  from { opacity: 0; transform: translateY(-8px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.sys-icon {
  flex-shrink: 0;
  color: var(--warning);
}

.sys-text {
  word-break: break-word;
}

/* ===== Scroll FAB (dynamic, anchored to input-capsule) ===== */
.fab-anchor {
  position: relative;
}

.scroll-fab {
  position: absolute;
  right: 0;
  bottom: calc(100% + 8px);
  z-index: 15;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--glass-base);
  backdrop-filter: blur(16px) saturate(1.5);
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--glass-inset), 0 4px 16px rgba(0,0,0,0.15);
  transition: all 0.3s var(--ease-expo);
}

.scroll-fab:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  border-color: var(--border-light);
  transform: translateY(-3px) scale(1.08);
  box-shadow: var(--glass-inset), 0 8px 24px rgba(0,0,0,0.2);
}

.scroll-fab:active { transform: scale(0.92); }

.fab-fade-enter-active, .fab-fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.fab-fade-enter-from, .fab-fade-leave-to { opacity: 0; transform: translateY(8px); }

/* ===== Input: Floating Glass Capsule ===== */
.input-area {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 45px 20px;
  padding-top: 24px;
  z-index: 10;
  background: linear-gradient(to top, var(--color-bg-page) 0%, transparent 100%);
}

.input-capsule {
  display: flex;
  align-items: center;
  background: var(--glass-base);
  backdrop-filter: blur(32px) saturate(1.5);
  -webkit-backdrop-filter: blur(32px) saturate(1.5);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  padding: 10px 12px 10px 16px;
  gap: 10px;
  box-shadow: var(--glass-inset), 0 8px 32px rgba(0,0,0,0.1);
  transition: all 0.3s var(--ease-expo);
  min-height: 52px;
}

.input-capsule.focused {
  border-color: rgba(10, 132, 255, 0.4);
  box-shadow: var(--glass-inset), 0 8px 32px rgba(0,0,0,0.1), 0 0 12px rgba(10, 132, 255, 0.2);
}

.prompt-symbol {
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 700;
  color: var(--primary-text);
  user-select: none;
  flex-shrink: 0;
  animation: pulse 2s ease-in-out infinite;
}

/* ===== Upload bar (floating above input) ===== */
.upload-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  padding-left: 4px;
}

.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  background: var(--glass-base);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.2s var(--ease-expo);
  flex-shrink: 0;
}

.upload-btn:hover {
  background: rgba(90, 200, 250, 0.15);
  border-color: rgba(90, 200, 250, 0.35);
  color: var(--info);
  box-shadow: 0 0 8px rgba(90, 200, 250, 0.15);
}

.file-input-hidden { display: none; }

textarea {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  resize: none;
  font-size: 14px;
  padding: 4px 0;
  line-height: 1.5;
  min-height: 22px;
  max-height: 120px;
  font-family: 'Noto Sans SC', var(--font-sans), sans-serif;
}

textarea:focus { outline: none; }
textarea::placeholder { color: var(--text-tertiary); font-family: 'Noto Sans SC', var(--font-sans), sans-serif; }

.send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(10, 132, 255, 0.15);
  border: 1px solid rgba(10, 132, 255, 0.2);
  border-radius: 50%;
  color: var(--primary-text);
  cursor: pointer;
  transition: all 0.2s var(--ease-expo);
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  background: rgba(10, 132, 255, 0.3);
  box-shadow: 0 0 10px rgba(10, 132, 255, 0.2);
  transform: scale(1.05);
}

.send-btn:active:not(:disabled) { transform: scale(0.95); }
.send-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.cancel-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 10px;
  color: var(--error);
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
}

/* File previews */
/* File Chips */
.file-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--glass-base);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 3px 8px;
  font-size: 11px;
  color: var(--text-secondary);
  font-family: 'Noto Sans SC', var(--font-sans), sans-serif;
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
  transition: all 0.2s var(--ease-expo);
}

.file-chip:hover {
  border-color: rgba(90, 200, 250, 0.3);
}

.file-chip-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.file-chip-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  border-radius: 50%;
  flex-shrink: 0;
  padding: 0;
}

.file-chip-remove:hover {
  color: var(--error);
  background: rgba(239, 68, 68, 0.1);
}

.file-overflow {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  flex-shrink: 0;
}

/* Remove old preview styles */

/* Input Status */
.input-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 10px;
  font-size: 11px;
  color: var(--text-tertiary);
}

.status-pill {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 8px;
  background: var(--glass-base);
  border: 1px solid var(--glass-border);
}

.status-pill.warning { color: var(--warning); border-color: rgba(255, 159, 10, 0.2); background: rgba(255, 159, 10, 0.05); }
.status-pill.success { color: var(--success); border-color: rgba(48, 209, 88, 0.2); background: rgba(48, 209, 88, 0.05); }
.status-pill.streaming { color: var(--primary-text); border-color: rgba(10, 132, 255, 0.2); background: rgba(10, 132, 255, 0.05); }

.status-dot-sep { font-size: 12px; opacity: 0.4; }

.export-btn {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 8px;
  background: var(--glass-base);
  border: 1px solid var(--glass-border);
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.2s var(--ease-expo);
  font-family: 'Noto Sans SC', var(--font-sans), sans-serif;
}

.export-btn:hover {
  color: var(--primary-text);
  border-color: var(--border-light);
  background: rgba(90, 200, 250, 0.1);
}

/* Context menu */
.ctx-menu {
  position: fixed;
  z-index: 2000;
  background: var(--bg-surface);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: 4px;
  min-width: 120px;
  backdrop-filter: blur(16px);
}

.ctx-item {
  display: block;
  width: 100%;
  padding: 7px 14px;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-family: var(--font-family);
  color: var(--text-primary);
  cursor: pointer;
  text-align: left;
  transition: background var(--fast);
}

.ctx-item:hover {
  background: var(--bg-elevated);
}
</style>
