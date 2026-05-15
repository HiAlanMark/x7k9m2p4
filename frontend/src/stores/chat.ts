import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { ChatMessage, ToolCallInfo, ChatSession } from '@/types'

export type ProviderMode = 'gfw' | 'custom'

export interface CustomProvider {
  name: string
  baseUrl: string
  apiKey: string
  model: string
}

const DEFAULT_GFW_BASE = 'https://api.gfw.net/v1'
const STORAGE_KEY = 'hixns_sessions'
const ACTIVE_KEY = 'hixns_active_session'

function generateId() {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6)
}

function generateMsgId() {
  return 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
}

function createSession(title = '新会话'): ChatSession {
  const now = new Date().toISOString()
  return { id: generateId(), title, messages: [], createdAt: now, updatedAt: now }
}

function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return []
}

function saveSessions(sessions: ChatSession[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  } catch { /* quota exceeded — drop oldest */ }
}

// 从消息中提取标题（取第一条用户消息的前 30 字符）
function extractTitle(messages: ChatMessage[]): string {
  const first = messages.find(m => m.role === 'user')
  if (first) {
    const text = first.content.trim()
    return text.length > 30 ? text.substring(0, 30) + '...' : text
  }
  return '新会话'
}

export const useChatStore = defineStore('chat', () => {
  // 会话列表
  const sessions = ref<ChatSession[]>(loadSessions())
  const activeSessionId = ref(localStorage.getItem(ACTIVE_KEY) || '')

  // 确保至少有一个会话
  if (sessions.value.length === 0) {
    const first = createSession()
    sessions.value.push(first)
    activeSessionId.value = first.id
  }
  if (!activeSessionId.value || !sessions.value.find(s => s.id === activeSessionId.value)) {
    activeSessionId.value = sessions.value[0].id
  }

  // 当前会话
  const currentSession = computed(() =>
    sessions.value.find(s => s.id === activeSessionId.value) || sessions.value[0]
  )

  // 当前消息列表（指向当前会话）
  const messages = computed(() => currentSession.value?.messages || [])

  // 流式状态
  const isStreaming = ref(false)
  const currentResponse = ref('')
  const currentToolCalls = ref<ToolCallInfo[]>([])
  const selectedModel = ref('gpt-4o-mini')

  // Provider
  const providerMode = ref<ProviderMode>(
    (localStorage.getItem('hermes_provider_mode') as ProviderMode) || 'gfw'
  )
  const customProvider = ref<CustomProvider>({
    name: localStorage.getItem('hermes_custom_name') || '',
    baseUrl: localStorage.getItem('hermes_custom_base_url') || '',
    apiKey: localStorage.getItem('hermes_custom_api_key') || '',
    model: localStorage.getItem('hermes_custom_model') || '',
  })

  // === 会话管理 ===

  function newSession() {
    const s = createSession()
    sessions.value.unshift(s) // 新会话在最前面
    activeSessionId.value = s.id
    persist()
    return s
  }

  function switchSession(id: string) {
    if (sessions.value.find(s => s.id === id)) {
      activeSessionId.value = id
      localStorage.setItem(ACTIVE_KEY, id)
    }
  }

  function deleteSession(id: string) {
    const idx = sessions.value.findIndex(s => s.id === id)
    if (idx < 0) return
    sessions.value.splice(idx, 1)
    // 如果删除的是当前会话，切到第一个或新建
    if (activeSessionId.value === id) {
      if (sessions.value.length === 0) {
        const s = createSession()
        sessions.value.push(s)
        activeSessionId.value = s.id
      } else {
        activeSessionId.value = sessions.value[0].id
      }
    }
    persist()
  }

  function renameSession(id: string, title: string) {
    const s = sessions.value.find(s => s.id === id)
    if (s) {
      s.title = title
      persist()
    }
  }

  function clearAllSessions() {
    const s = createSession()
    sessions.value = [s]
    activeSessionId.value = s.id
    persist()
  }

  // 持久化
  function persist() {
    saveSessions(sessions.value)
    localStorage.setItem(ACTIVE_KEY, activeSessionId.value)
  }

  // === 消息操作（操作当前会话）===

  function getActiveConfig() {
    if (providerMode.value === 'custom' && customProvider.value.baseUrl && customProvider.value.apiKey) {
      return {
        baseUrl: customProvider.value.baseUrl,
        apiKey: customProvider.value.apiKey,
        model: customProvider.value.model || 'gpt-4o-mini',
      }
    }
    return {
      baseUrl: DEFAULT_GFW_BASE,
      apiKey: localStorage.getItem('gfw_api_key') || '',
      model: selectedModel.value,
    }
  }

  function setProviderMode(mode: ProviderMode) {
    providerMode.value = mode
    localStorage.setItem('hermes_provider_mode', mode)
  }

  function setCustomProvider(provider: CustomProvider) {
    customProvider.value = { ...provider }
    localStorage.setItem('hermes_custom_name', provider.name)
    localStorage.setItem('hermes_custom_base_url', provider.baseUrl)
    localStorage.setItem('hermes_custom_api_key', provider.apiKey)
    localStorage.setItem('hermes_custom_model', provider.model)
  }

  function addUserMessage(content: string) {
    const session = currentSession.value
    if (!session) return
    session.messages.push({
      id: generateMsgId(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    })
    // 自动更新标题（如果是第一条消息）
    if (session.messages.filter(m => m.role === 'user').length === 1) {
      session.title = extractTitle(session.messages)
    }
    session.updatedAt = new Date().toISOString()
    persist()
  }

  function addSystemMessage(content: string) {
    const session = currentSession.value
    if (!session) return
    session.messages.push({
      id: generateMsgId(),
      role: 'system',
      content,
      timestamp: new Date().toISOString(),
    })
    persist()
  }

  function startAssistantResponse() {
    isStreaming.value = true
    currentResponse.value = ''
    currentToolCalls.value = []
  }

  function appendToResponse(content: string) {
    currentResponse.value += content
  }

  function addToolCall(tool: string, input: Record<string, unknown>) {
    currentToolCalls.value.push({ tool, input, status: 'running' })
  }

  function completeToolCall(index: number, output: string, status: 'completed' | 'failed') {
    if (currentToolCalls.value[index]) {
      currentToolCalls.value[index].output = output
      currentToolCalls.value[index].status = status
    }
  }

  function finishResponse(tokenUsage?: Record<string, number>, model?: string, durationMs?: number, finalContent?: string) {
    const session = currentSession.value
    if (!session) return
    // finalContent 优先（Agent done 事件的完整响应），否则用流式累积的 currentResponse
    const content = finalContent || currentResponse.value
    if (finalContent) currentResponse.value = finalContent  // 更新流式预览
    session.messages.push({
      id: generateMsgId(),
      role: 'assistant',
      content,
      timestamp: new Date().toISOString(),
      tool_calls: currentToolCalls.value.length > 0 ? [...currentToolCalls.value] : undefined,
      token_usage: tokenUsage,
      model,
      duration_ms: durationMs,
    })
    isStreaming.value = false
    currentResponse.value = ''
    currentToolCalls.value = []
    session.updatedAt = new Date().toISOString()
    persist()
  }

  function clearMessages() {
    const session = currentSession.value
    if (session) {
      session.messages = []
      session.hermesSessionId = undefined
      session.updatedAt = new Date().toISOString()
      persist()
    }
  }

  function truncateMessages(fromIndex: number) {
    const session = currentSession.value
    if (session && fromIndex >= 0 && fromIndex < session.messages.length) {
      session.messages.splice(fromIndex)
      session.updatedAt = new Date().toISOString()
      persist()
    }
  }

  // hermes session_id 管理（用于上下文续接）
  function setHermesSessionId(sid: string) {
    const session = currentSession.value
    if (session && sid) {
      session.hermesSessionId = sid
      persist()
    }
  }

  function getHermesSessionId(): string {
    return currentSession.value?.hermesSessionId || ''
  }

  // 会话列表（按更新时间倒序）
  const sortedSessions = computed(() =>
    [...sessions.value].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  )

  return {
    // 会话管理
    sessions, activeSessionId, currentSession, sortedSessions,
    newSession, switchSession, deleteSession, renameSession, clearAllSessions,
    // 消息
    messages, isStreaming, currentResponse, currentToolCalls, selectedModel,
    // Provider
    providerMode, customProvider,
    getActiveConfig, setProviderMode, setCustomProvider,
    // 消息操作
    addUserMessage, addSystemMessage, startAssistantResponse, appendToResponse,
    addToolCall, completeToolCall, finishResponse, clearMessages, truncateMessages,
    setHermesSessionId, getHermesSessionId,
  }
})
