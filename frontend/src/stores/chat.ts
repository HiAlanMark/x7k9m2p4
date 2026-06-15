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

export interface ModelProfile {
  id: string
  name: string
  provider: 'gfw' | 'custom'
  baseUrl: string
  apiKey: string
  model: string
  isDefault: boolean
  createdAt: string
}

const DEFAULT_GFW_BASE = 'https://api.gfw.net/v1'
const STORAGE_KEY = 'hixns_sessions'
const ACTIVE_KEY = 'hixns_active_session'
const MODEL_PROFILES_KEY = 'hixns_model_profiles'
const ACTIVE_MODEL_KEY = 'hixns_active_model'

function generateId() {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6)
}

function generateMsgId() {
  return 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
}

function loadModelProfiles(): ModelProfile[] {
  try {
    const raw = localStorage.getItem(MODEL_PROFILES_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return []
}

function saveModelProfiles(profiles: ModelProfile[]) {
  try {
    localStorage.setItem(MODEL_PROFILES_KEY, JSON.stringify(profiles))
  } catch { /* ignore */ }
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
  // Streaming timing
  const streamStartTime = ref(0)        // timestamp when streaming started
  const firstTokenTime = ref(0)         // timestamp when first token arrived
  const streamToolTimeMs = ref(0)       // cumulative tool call time in current stream
  const selectedModel = ref('gpt-4o-mini')

  // Blueprint context association
  const blueprintRunId = ref('')

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

  // Model Profiles (多模型配置)
  const modelProfiles = ref<ModelProfile[]>(loadModelProfiles())
  const activeModelId = ref(localStorage.getItem(ACTIVE_MODEL_KEY) || '')

  // Ensure active model exists
  if (modelProfiles.value.length > 0 && !modelProfiles.value.find(p => p.id === activeModelId.value)) {
    const def = modelProfiles.value.find(p => p.isDefault) || modelProfiles.value[0]
    activeModelId.value = def.id
  }

  // === 会话管理 ===

  async function newSession() {
    const s = createSession()
    sessions.value.unshift(s)
    activeSessionId.value = s.id
    persist()
    // Create server-side session
    const serverId = await createServerSession(s.title)
    if (serverId) {
      s.serverId = serverId
      persist()
    }
    return s
  }

  function switchSession(id: string) {
    if (sessions.value.find(s => s.id === id)) {
      activeSessionId.value = id
      localStorage.setItem(ACTIVE_KEY, id)
      const session = sessions.value.find(s => s.id === id)
      if (session && session.serverId && session.messages.length === 0) {
        loadServerMessages(session) // async, fire-and-forget
      }
    }
  }

  function deleteSession(id: string) {
    const idx = sessions.value.findIndex(s => s.id === id)
    if (idx < 0) return
    const session = sessions.value[idx]
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
    deleteServerSession(session) // async, fire-and-forget
  }

  function renameSession(id: string, title: string) {
    const s = sessions.value.find(s => s.id === id)
    if (s) {
      s.title = title
      persist()
      renameServerSession(id, title) // async, fire-and-forget
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

  // ── 服务端会话同步 (P2-2) ──

  async function fetchServerSessions() {
    try {
      const { agentJson } = await import('@/api')
      const data = await agentJson('/v1/agent/chat-sessions')
      const serverSessions = Array.isArray(data?.sessions) ? data.sessions : []
      // Merge server sessions with local sessions by serverId
      for (const ss of serverSessions) {
        const local = sessions.value.find(s => s.serverId === ss.id)
        if (local) {
          // Update metadata from server
          local.title = ss.title || local.title
          local.updatedAt = ss.updated_at || local.updatedAt
        } else {
          // New session from server — create local stub
          sessions.value.push({
            id: 'srv-' + ss.id,
            title: ss.title,
            messages: [], // will be fetched on demand
            createdAt: ss.created_at,
            updatedAt: ss.updated_at,
            serverId: ss.id,
          })
        }
      }
    } catch (e) {
      console.warn('[chat] fetchServerSessions failed, using localStorage only:', e)
    }
  }

  async function createServerSession(title: string): Promise<string | null> {
    try {
      const { agentPost } = await import('@/api')
      const data = await agentPost('/v1/agent/chat-sessions', { title })
      const session = data?.session || data
      return session?.id || null
    } catch (e) {
      console.warn('[chat] createServerSession failed:', e)
      return null
    }
  }

  async function saveServerMessages(sessionId: string) {
    const session = sessions.value.find(s => s.id === sessionId)
    if (!session || !session.serverId) return
    try {
      const { agentPost } = await import('@/api')
      // Only save user/assistant messages (not system/tool)
      const messages = session.messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content, timestamp: m.timestamp }))
      await agentPost('/v1/agent/chat-sessions/messages', {
        session_id: session.serverId,
        messages,
      })
    } catch (e) {
      console.warn('[chat] saveServerMessages failed:', e)
    }
  }

  async function loadServerMessages(session: ChatSession) {
    if (!session.serverId) return
    try {
      const { agentJson } = await import('@/api')
      const data = await agentJson(`/v1/agent/chat-sessions/messages?session_id=${session.serverId}`)
      const serverMsgs = Array.isArray(data?.messages) ? data.messages : []
      // Merge: keep local messages that aren't on server, add server messages
      if (serverMsgs.length > 0 && session.messages.length === 0) {
        session.messages = serverMsgs.map((m: any, i: number) => ({
          id: generateMsgId(),
          role: m.role as 'user' | 'assistant',
          content: m.content || '',
          timestamp: m.timestamp || new Date().toISOString(),
        }))
      }
    } catch (e) {
      console.warn('[chat] loadServerMessages failed:', e)
    }
  }

  async function renameServerSession(sessionId: string, title: string) {
    const session = sessions.value.find(s => s.id === sessionId)
    if (!session?.serverId) return
    try {
      const { agentPost } = await import('@/api')
      await agentPost('/v1/agent/chat-sessions/rename', { id: session.serverId, title })
    } catch (e) {
      console.warn('[chat] renameServerSession failed:', e)
    }
  }

  async function deleteServerSession(session: ChatSession) {
    if (!session.serverId) return
    try {
      const { agentPost } = await import('@/api')
      await agentPost('/v1/agent/chat-sessions/delete', { id: session.serverId })
    } catch (e) {
      console.warn('[chat] deleteServerSession failed:', e)
    }
  }

  // === 消息操作（操作当前会话）===

  function getActiveConfig() {
    // Priority: active model profile > custom provider > gfw
    const activeProfile = modelProfiles.value.find(p => p.id === activeModelId.value)
    const bpRunId = blueprintRunId.value || undefined
    if (activeProfile) {
      return {
        baseUrl: activeProfile.baseUrl || (activeProfile.provider === 'gfw' ? DEFAULT_GFW_BASE : ''),
        apiKey: activeProfile.apiKey,
        model: activeProfile.model || 'gpt-4o-mini',
        profileName: activeProfile.name,
        blueprint_run_id: bpRunId,
      }
    }
    if (providerMode.value === 'custom' && customProvider.value.baseUrl && customProvider.value.apiKey) {
      return {
        baseUrl: customProvider.value.baseUrl,
        apiKey: customProvider.value.apiKey,
        model: customProvider.value.model || 'gpt-4o-mini',
        blueprint_run_id: bpRunId,
      }
    }
    return {
      baseUrl: DEFAULT_GFW_BASE,
      apiKey: localStorage.getItem('gfw_api_key') || '',
      model: selectedModel.value,
      blueprint_run_id: bpRunId,
    }
  }

  // ── Model Profile CRUD ──
  function addModelProfile(profile: Omit<ModelProfile, 'id' | 'createdAt'>) {
    const p: ModelProfile = {
      ...profile,
      id: 'mp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      createdAt: new Date().toISOString(),
    }
    if (p.isDefault) {
      modelProfiles.value.forEach(mp => { mp.isDefault = false })
    }
    modelProfiles.value.push(p)
    saveModelProfiles(modelProfiles.value)
    if (!activeModelId.value) {
      activeModelId.value = p.id
      localStorage.setItem(ACTIVE_MODEL_KEY, p.id)
    }
    return p
  }

  function removeModelProfile(id: string) {
    const idx = modelProfiles.value.findIndex(p => p.id === id)
    if (idx < 0) return
    modelProfiles.value.splice(idx, 1)
    saveModelProfiles(modelProfiles.value)
    if (activeModelId.value === id) {
      const next = modelProfiles.value.find(p => p.isDefault) || modelProfiles.value[0]
      activeModelId.value = next?.id || ''
      localStorage.setItem(ACTIVE_MODEL_KEY, activeModelId.value)
    }
  }

  function updateModelProfile(id: string, updates: Partial<ModelProfile>) {
    const p = modelProfiles.value.find(mp => mp.id === id)
    if (!p) return
    if (updates.isDefault) {
      modelProfiles.value.forEach(mp => { mp.isDefault = false })
    }
    Object.assign(p, updates)
    saveModelProfiles(modelProfiles.value)
  }

  function switchModel(id: string) {
    const p = modelProfiles.value.find(mp => mp.id === id)
    if (!p) return
    activeModelId.value = id
    localStorage.setItem(ACTIVE_MODEL_KEY, id)
    // Also update legacy provider mode for compatibility
    if (p.provider === 'gfw') {
      providerMode.value = 'gfw'
      localStorage.setItem('hermes_provider_mode', 'gfw')
    } else {
      providerMode.value = 'custom'
      localStorage.setItem('hermes_provider_mode', 'custom')
      customProvider.value = { name: p.name, baseUrl: p.baseUrl, apiKey: p.apiKey, model: p.model }
      setCustomProvider(customProvider.value)
    }
    selectedModel.value = p.model
  }

  const activeModelProfile = computed(() =>
    modelProfiles.value.find(p => p.id === activeModelId.value) || null
  )

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
    saveServerMessages(session.id) // async, fire-and-forget
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
    streamStartTime.value = Date.now()
    firstTokenTime.value = 0
    streamToolTimeMs.value = 0
  }

  function appendToResponse(content: string) {
    currentResponse.value += content
    if (!firstTokenTime.value) firstTokenTime.value = Date.now()
  }

  function addToolCall(tool: string, input: Record<string, unknown>) {
    currentToolCalls.value.push({ tool, input, status: 'running', _startTime: Date.now() } as any)
  }

  function completeToolCall(index: number, output: string, status: 'completed' | 'failed') {
    if (currentToolCalls.value[index]) {
      const tc = currentToolCalls.value[index] as any
      if (tc._startTime) streamToolTimeMs.value += Date.now() - tc._startTime
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
      ttft_ms: firstTokenTime.value ? firstTokenTime.value - streamStartTime.value : undefined,
      tool_time_ms: streamToolTimeMs.value || undefined,
    })
    isStreaming.value = false
    currentResponse.value = ''
    currentToolCalls.value = []
    session.updatedAt = new Date().toISOString()
    persist()
    saveServerMessages(session.id) // async, fire-and-forget
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
    // 服务端会话同步
    fetchServerSessions,
    // 消息
    messages, isStreaming, currentResponse, currentToolCalls, selectedModel,
    streamStartTime, firstTokenTime, streamToolTimeMs,
    blueprintRunId,
    // Provider
    providerMode, customProvider,
    getActiveConfig, setProviderMode, setCustomProvider,
    // Model Profiles
    modelProfiles, activeModelId, activeModelProfile,
    addModelProfile, removeModelProfile, updateModelProfile, switchModel,
    // 消息操作
    addUserMessage, addSystemMessage, startAssistantResponse, appendToResponse,
    addToolCall, completeToolCall, finishResponse, clearMessages, truncateMessages,
    setHermesSessionId, getHermesSessionId,
  }
})
