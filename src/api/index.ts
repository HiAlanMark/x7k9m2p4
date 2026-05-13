import type {
  GfwUser, GfwModel, ApiKeyInfo, DailyUsage, RechargePackage, SrProvider,
  TwoXSkill, TwoXSkillDetail, TwoXReview, TwoXRanking, TwoXWorkflow, TwoXDownload,
} from '@/types'

// ============================================================
// 检测是否在 Tauri 环境中运行
// ============================================================

const isTauri = typeof window !== 'undefined' && !!(window as any).__TAURI_INTERNALS__

async function invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  if (isTauri) {
    const { invoke: tauriInvoke } = await import('@tauri-apps/api/core')
    return tauriInvoke<T>(cmd, args)
  }
  // 浏览器模式：直接调用 gfw.net / 2x.com.cn API
  return browserFallback<T>(cmd, args)
}

// ============================================================
// 浏览器模式：直接 HTTP 调用 (无需 Tauri 后端)
// ============================================================

// 浏览器开发模式下通过 Vite 代理避免 CORS
const isDev = import.meta.env?.DEV ?? false
const GFW_BASE = isDev ? '/proxy/gfw/api/v1' : 'https://api.gfw.net/api/v1'
const GFW_AI = isDev ? '/proxy/gfw/v1' : 'https://api.gfw.net/v1'
const TWO_X_BASE = isDev ? '/proxy/2x/api/v1' : 'https://api.2x.com.cn/api/v1'

let gfwJwt: string | null = localStorage.getItem('gfw_jwt')
let gfwApiKey: string | null = localStorage.getItem('gfw_api_key')
let twoXToken: string | null = localStorage.getItem('2x_token')

async function browserFallback<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  switch (cmd) {
    case 'gfw_login': {
      const r = await fetch(`${GFW_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: args?.email, password: args?.password }),
      })
      const body = await r.json()
      if (body.code !== 0) throw new Error(body.message)
      gfwJwt = body.data.token
      localStorage.setItem('gfw_jwt', gfwJwt!)
      localStorage.setItem('gfw_refresh_token', body.data.refresh_token)
      return { token: body.data.token, user: body.data.user } as T
    }

    case 'gfw_refresh_token': {
      const rt = localStorage.getItem('gfw_refresh_token')
      if (!rt) throw new Error('No refresh token')
      const r = await fetch(`${GFW_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: rt }),
      })
      const body = await r.json()
      if (body.code !== 0) throw new Error(body.message)
      gfwJwt = body.data.token
      localStorage.setItem('gfw_jwt', gfwJwt!)
      return { token: body.data.token, user: body.data.user } as T
    }

    case 'gfw_get_user_info': {
      if (!gfwJwt) throw new Error('Not logged in')
      const r = await fetch(`${GFW_BASE}/user`, { headers: { Authorization: `Bearer ${gfwJwt}` } })
      const body = await r.json()
      if (body.code !== 0) throw new Error(body.message)
      return body.data as T
    }

    case 'gfw_get_balance': {
      if (!gfwJwt) throw new Error('Not logged in')
      const r = await fetch(`${GFW_BASE}/gcoin/balance`, { headers: { Authorization: `Bearer ${gfwJwt}` } })
      const body = await r.json()
      return body.data.balance as T
    }

    case 'gfw_list_models': {
      const r = await fetch(`${GFW_BASE}/models`)
      const body = await r.json()
      return body.data.models as T
    }

    case 'gfw_list_api_keys': {
      if (!gfwJwt) throw new Error('Not logged in')
      const r = await fetch(`${GFW_BASE}/api-keys`, { headers: { Authorization: `Bearer ${gfwJwt}` } })
      const body = await r.json()
      return body.data.keys as T
    }

    case 'gfw_create_api_key': {
      if (!gfwJwt) throw new Error('Not logged in')
      const r = await fetch(`${GFW_BASE}/api-keys`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${gfwJwt}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: args?.name, gcoin_limit: args?.gcoinLimit, rate_limit: args?.rateLimit }),
      })
      const body = await r.json()
      if (body.code !== 0) throw new Error(body.message)
      const keyId = body.data.key.id
      // 获取完整 key
      const r2 = await fetch(`${GFW_BASE}/api-keys/${keyId}/full`, { headers: { Authorization: `Bearer ${gfwJwt}` } })
      const body2 = await r2.json()
      const fullKey = body2.data.key
      gfwApiKey = fullKey
      localStorage.setItem('gfw_api_key', fullKey)
      return { id: keyId, key: fullKey, name: args?.name } as T
    }

    case 'gfw_get_full_key': {
      if (!gfwJwt) throw new Error('Not logged in')
      const r = await fetch(`${GFW_BASE}/api-keys/${args?.keyId}/full`, { headers: { Authorization: `Bearer ${gfwJwt}` } })
      const body = await r.json()
      return body.data.key as T
    }

    case 'gfw_get_daily_usage': {
      if (!gfwJwt) throw new Error('Not logged in')
      const r = await fetch(`${GFW_BASE}/usage/daily?days=${args?.days || 7}`, { headers: { Authorization: `Bearer ${gfwJwt}` } })
      const body = await r.json()
      return body.data.daily_usage as T
    }

    case 'gfw_get_recharge_packages': {
      const r = await fetch(`${GFW_BASE}/recharge/packages`)
      const body = await r.json()
      return body.data.packages as T
    }

    case 'gfw_create_recharge_order': {
      if (!gfwJwt) throw new Error('Not logged in')
      const r = await fetch(`${GFW_BASE}/recharge/create`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${gfwJwt}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ package_id: args?.packageId, pay_method: args?.payMethod }),
      })
      const body = await r.json()
      return body.data as T
    }

    case 'gfw_list_sr_providers': {
      const r = await fetch(`${GFW_BASE}/sr/public/providers`)
      const body = await r.json()
      return body.data.providers as T
    }

    // 2x.com.cn
    case 'skill_store_email_login': {
      const r = await fetch(`${TWO_X_BASE}/auth/email/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: args?.email, password: args?.password }),
      })
      const body = await r.json()
      if (body.code !== 0 && !body.data) throw new Error(body.message || 'Login failed')
      twoXToken = body.data.token
      localStorage.setItem('2x_token', twoXToken!)
      return { token: body.data.token, user: body.data.user } as T
    }

    case 'skill_store_get_skills': {
      let url = `${TWO_X_BASE}/skills/latest?limit=${args?.limit || 20}&offset=${args?.offset || 0}`
      if (args?.q) url += `&q=${encodeURIComponent(args.q as string)}`
      if (args?.category) url += `&category=${encodeURIComponent(args.category as string)}`
      if (args?.sort) url += `&sort=${args.sort}`
      const r = await fetch(url)
      const body = await r.json()
      return { skills: body.data || [] } as T
    }

    case 'skill_store_search_skills': {
      const r = await fetch(`${TWO_X_BASE}/skills/latest?q=${encodeURIComponent(args?.query as string)}&limit=50`)
      const body = await r.json()
      return { skills: body.data || [] } as T
    }

    case 'skill_store_get_skill_detail': {
      const r = await fetch(`${TWO_X_BASE}/skills/${args?.idOrSlug}`)
      const body = await r.json()
      return body.data as T
    }

    case 'skill_store_get_popular_skills': {
      const r = await fetch(`${TWO_X_BASE}/skills/popular?limit=${args?.limit || 50}`)
      const body = await r.json()
      return { skills: body.data || [] } as T
    }

    case 'skill_store_get_rankings': {
      const r = await fetch(`${TWO_X_BASE}/rankings/${args?.rankingType}`)
      const body = await r.json()
      return { rankings: body.skills || [] } as T
    }

    case 'skill_store_get_workflows': {
      let url = `${TWO_X_BASE}/workflow-market?page=${args?.page || 1}&limit=${args?.limit || 20}`
      if (args?.category) url += `&category=${encodeURIComponent(args.category as string)}`
      if (args?.q) url += `&q=${encodeURIComponent(args.q as string)}`
      const r = await fetch(url)
      const body = await r.json()
      return { workflows: body.data || [] } as T
    }

    // Agent (浏览器模式下直接调 gfw.net API)
    case 'agent_start':
      return 0 as T  // 浏览器模式不需要启动进程

    case 'agent_stop':
      return undefined as T

    case 'agent_send_message': {
      // 浏览器模式：直接调用 gfw.net chat completions
      const key = gfwApiKey || localStorage.getItem('gfw_api_key')
      if (!key) throw new Error('No API Key. Please create one in Settings.')
      // 这里不直接返回，由 ChatView 的 WebSocket/SSE 逻辑处理
      return undefined as T
    }

    case 'agent_cancel':
      return undefined as T

    // Config
    case 'config_get':
      return JSON.parse(localStorage.getItem(`config_${args?.key}`) || 'null') as T

    case 'config_set':
      localStorage.setItem(`config_${args?.key}`, JSON.stringify(args?.value))
      return undefined as T

    case 'config_get_all':
      return {} as T

    default:
      throw new Error(`Unknown command: ${cmd}`)
  }
}

// ============================================================
// 导出的 API 函数 (统一接口，Tauri 和浏览器通用)
// ============================================================

export async function gfwLogin(email: string, password: string) {
  return invoke<{ token: string; user: GfwUser }>('gfw_login', { email, password })
}

export async function gfwRefreshToken() {
  return invoke<{ token: string; user: GfwUser }>('gfw_refresh_token')
}

export async function gfwGetUserInfo() {
  return invoke<{ user: GfwUser; group_code: string; group_name: string; is_reseller: boolean }>('gfw_get_user_info')
}

export async function gfwGetBalance() {
  return invoke<number>('gfw_get_balance')
}

export async function gfwListModels() {
  return invoke<GfwModel[]>('gfw_list_models')
}

export async function gfwListApiKeys() {
  return invoke<ApiKeyInfo[]>('gfw_list_api_keys')
}

export async function gfwCreateApiKey(name: string, gcoinLimit?: number, rateLimit?: number) {
  return invoke<{ id: number; key: string; name: string }>('gfw_create_api_key', { name, gcoinLimit, rateLimit })
}

export async function gfwGetFullKey(keyId: number) {
  return invoke<string>('gfw_get_full_key', { keyId })
}

export async function gfwGetDailyUsage(days = 7) {
  return invoke<DailyUsage[]>('gfw_get_daily_usage', { days })
}

export async function gfwGetRechargePackages() {
  return invoke<RechargePackage[]>('gfw_get_recharge_packages')
}

export async function gfwCreateRechargeOrder(packageId: number, payMethod: string) {
  return invoke<{ id: string; pay_url: string | null; status: string }>('gfw_create_recharge_order', { packageId, payMethod })
}

export async function gfwListSrProviders() {
  return invoke<SrProvider[]>('gfw_list_sr_providers')
}

// 2x.com.cn
export async function twoXEmailLogin(email: string, password: string) {
  return invoke<{ token: string; user: { id: number; username: string } }>('skill_store_email_login', { email, password })
}

export async function twoXGetSkills(q?: string, category?: string, tags?: string, sort?: string, limit = 20, offset = 0) {
  return invoke<{ skills: TwoXSkill[] }>('skill_store_get_skills', { q, category, tags, sort, limit, offset })
}

export async function twoXSearchSkills(query: string) {
  return invoke<{ skills: TwoXSkill[] }>('skill_store_search_skills', { query })
}

export async function twoXGetSkillDetail(idOrSlug: string) {
  return invoke<TwoXSkillDetail>('skill_store_get_skill_detail', { idOrSlug })
}

export async function twoXGetPopularSkills(limit = 50) {
  return invoke<{ skills: TwoXSkill[] }>('skill_store_get_popular_skills', { limit })
}

export async function twoXGetRankings(rankingType: 'most_used' | 'highest_rated' | 'latest') {
  return invoke<{ rankings: TwoXRanking[] }>('skill_store_get_rankings', { rankingType })
}

export async function twoXGetWorkflows(page = 1, limit = 20, category?: string, q?: string, sort?: string) {
  return invoke<{ workflows: TwoXWorkflow[] }>('skill_store_get_workflows', { page, limit, category, q, sort })
}

export async function twoXPhoneLogin(phone: string, password: string) {
  return invoke<{ token: string; user: { id: number; username: string } }>('skill_store_email_login', { email: phone, password })
}

export async function twoXGetProfile() {
  if (isTauri) return invoke('skill_store_get_profile' as any)
  return { username: 'browser_user', nickname: 'Browser User' }
}

export async function twoXGetMySkills() {
  return invoke<{ skills: TwoXSkill[] }>('skill_store_get_skills', { limit: 50, offset: 0 })
}

export async function twoXGetFavorites() {
  return invoke<{ skills: TwoXSkill[] }>('skill_store_get_skills', { limit: 50, offset: 0 })
}

export async function twoXGetDownloads() {
  return { downloads: [] as TwoXDownload[] }
}

export async function twoXToggleFavorite(_idOrSlug: string) {
  return true
}

export async function twoXGetDownloadUrl(idOrSlug: string) {
  return `https://api.2x.com.cn/api/v1/skills/${idOrSlug}/download-file`
}

// Agent
export async function agentStart(hermesPath: string) {
  return invoke<number>('agent_start', { hermesPath })
}

export async function agentStop() {
  return invoke('agent_stop')
}

export async function agentSendMessage(content: string, model?: string) {
  return invoke('agent_send_message', { content, model })
}

export async function agentCancel(msgId: string) {
  return invoke('agent_cancel', { msgId })
}

// Config
export async function configGet(key: string) {
  return invoke<unknown>('config_get', { key })
}

export async function configSet(key: string, value: unknown) {
  return invoke('config_set', { key, value })
}

export async function configGetAll() {
  return invoke<Record<string, unknown>>('config_get_all')
}

// ============================================================
// Hermes Agent API — 真实对接 Go Server → Hermes CLI
// ============================================================

const AGENT_BASE = isDev ? '/proxy/agent' : 'http://127.0.0.1:9800'

async function agentFetch(path: string, opts?: RequestInit) {
  const r = await fetch(`${AGENT_BASE}${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts?.headers as Record<string, string> || {}) },
  })
  return r
}

async function agentJson(path: string, opts?: RequestInit) {
  const r = await agentFetch(path, opts)
  return r.json()
}

async function agentPost(path: string, body: Record<string, unknown>) {
  return agentJson(path, { method: 'POST', body: JSON.stringify(body) })
}

// --- Config ---
export async function hermesConfigGet(): Promise<string> {
  const r = await agentFetch('/v1/agent/config')
  return r.text()
}
export async function hermesConfigSet(key: string, value: string) {
  return agentPost('/v1/agent/config/set', { key, value })
}

// --- Cron ---
export async function hermesCronList() {
  return agentJson('/v1/agent/cron/list')
}
export async function hermesCronCreate(schedule: string, prompt: string, name?: string) {
  return agentPost('/v1/agent/cron/create', { schedule, prompt, name })
}
export async function hermesCronPause(id: string) {
  return agentPost('/v1/agent/cron/pause', { id })
}
export async function hermesCronResume(id: string) {
  return agentPost('/v1/agent/cron/resume', { id })
}
export async function hermesCronRemove(id: string) {
  return agentPost('/v1/agent/cron/remove', { id })
}
export async function hermesCronRun(id: string) {
  return agentPost('/v1/agent/cron/run', { id })
}

// --- Sessions ---
export async function hermesSessionsList() {
  return agentJson('/v1/agent/sessions/list')
}
export async function hermesSessionsDelete(id: string) {
  return agentPost('/v1/agent/sessions/delete', { id })
}
export async function hermesSessionsRename(id: string, title: string) {
  return agentPost('/v1/agent/sessions/rename', { id, title })
}

// --- Memory ---
export async function hermesMemoryGet() {
  return agentJson('/v1/agent/memory')
}
export async function hermesMemoryEdit(target: 'memory' | 'user', content: string) {
  return agentPost('/v1/agent/memory/edit', { target, content })
}

// --- Tools ---
export async function hermesToolsList() {
  return agentJson('/v1/agent/tools/list')
}
export async function hermesToolsEnable(name: string) {
  return agentPost('/v1/agent/tools/enable', { name })
}
export async function hermesToolsDisable(name: string) {
  return agentPost('/v1/agent/tools/disable', { name })
}

// --- Cancel ---
export async function hermesCancel() {
  return agentPost('/v1/agent/cancel', {})
}

// ============================================================
// 浏览器模式专用：直接调用 gfw.net 进行对话
// ============================================================

export function isBrowserMode() {
  return !isTauri
}

export async function browserChat(
  content: string,
  model: string,
  onChunk: (text: string) => void,
  onDone: (fullText: string, usage: Record<string, number>) => void,
  onError: (err: string) => void,
  customConfig?: { baseUrl: string; apiKey: string; model: string },
  onToolCall?: (tool: string, args: Record<string, unknown>) => void,
  onToolResult?: (tool: string, result: string, duration: number) => void,
  history?: Array<{ role: string; content: string }>,
  onStatus?: (message: string, iteration: number, maxIterations: number) => void,
  onApproval?: (id: string, tool: string, command: string, reason: string) => void,
) {
  // 优先尝试 Agent Server（本地 9800 端口）
  const agentUrl = isDev ? '/proxy/agent' : 'http://127.0.0.1:9800'
  const agentAvailable = await checkAgentHealth(agentUrl)

  if (agentAvailable) {
    return agentChat(content, model, onChunk, onDone, onError, customConfig, onToolCall, onToolResult, agentUrl, history, onStatus, onApproval)
  }

  // Fallback: 直接调 LLM API（纯聊天，无工具能力）
  return directChat(content, model, onChunk, onDone, onError, customConfig, history)
}

async function checkAgentHealth(agentUrl: string): Promise<boolean> {
  try {
    const r = await fetch(`${agentUrl}/v1/agent/health`, { signal: AbortSignal.timeout(1500) })
    return r.ok
  } catch {
    return false
  }
}

async function agentChat(
  content: string,
  model: string,
  onChunk: (text: string) => void,
  onDone: (fullText: string, usage: Record<string, number>) => void,
  onError: (err: string) => void,
  customConfig?: { baseUrl: string; apiKey: string; model: string },
  onToolCall?: (tool: string, args: Record<string, unknown>) => void,
  onToolResult?: (tool: string, result: string, duration: number) => void,
  agentUrl?: string,
  history?: Array<{ role: string; content: string }>,
  onStatus?: (message: string, iteration: number, maxIterations: number) => void,
  onApproval?: (id: string, tool: string, command: string, reason: string) => void,
) {
  const baseUrl = customConfig?.baseUrl || GFW_AI
  const key = customConfig?.apiKey || gfwApiKey || localStorage.getItem('gfw_api_key')
  const activeModel = customConfig?.model || model

  if (!key) {
    onError('未配置 API Key，请在设置中配置。')
    return
  }

  // 开发模式下 API base URL 需要通过 Vite 代理
  let llmBase = baseUrl
  if (isDev && llmBase.startsWith('http')) {
    // Agent server 自己会去调 LLM API，所以把原始 URL 传给它
  }

  const url = agentUrl || (isDev ? '/proxy/agent' : 'http://127.0.0.1:9800')

  try {
    const r = await fetch(`${url}/v1/agent/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        api_base: llmBase,
        api_key: key,
        model: activeModel,
        messages: history || [],
      }),
    })

    if (!r.ok) {
      const err = await r.text()
      onError(`Agent 错误 (${r.status}): ${err}`)
      return
    }

    const reader = r.body?.getReader()
    if (!reader) { onError('No response body'); return }

    const decoder = new TextDecoder()
    let fullText = ''
    let usage: Record<string, number> = {}
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''  // 最后一个可能是不完整的行，留到下次

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data: ')) continue
        const data = trimmed.slice(6).trim()
        if (data === '[DONE]') {
          onDone(fullText, usage)
          return
        }
        try {
          const evt = JSON.parse(data)
          switch (evt.type) {
            case 'text':
              fullText += evt.content
              onChunk(evt.content)
              break
            case 'text_delta':
              onChunk(evt.content || '')
              break
            case 'status':
              onStatus?.(evt.message || '', evt.iteration || 0, evt.max_iterations || 0)
              break
            case 'approval_request':
              onApproval?.(evt.id || '', evt.tool || '', evt.command || '', evt.reason || '')
              break
            case 'tool_call':
              onToolCall?.(evt.tool, evt.args || {})
              break
            case 'tool_result':
              onToolResult?.(evt.tool, evt.result || '', evt.duration || 0)
              break
            case 'usage':
              usage = evt
              break
            case 'error':
              onError(evt.message || '未知错误')
              return
            case 'done':
              fullText = evt.content || fullText
              onDone(fullText, usage)
              return
          }
        } catch {
          // JSON parse error — likely incomplete data, will retry next chunk
        }
      }
    }

    // 处理 buffer 里剩余的数据
    if (buffer.trim().startsWith('data: ')) {
      const data = buffer.trim().slice(6).trim()
      if (data && data !== '[DONE]') {
        try {
          const evt = JSON.parse(data)
          if (evt.type === 'text') { fullText += evt.content; onChunk(evt.content) }
          else if (evt.type === 'done') { fullText = evt.content || fullText }
        } catch { /* ignore */ }
      }
    }

    onDone(fullText, usage)
  } catch (e: unknown) {
    onError(e instanceof Error ? e.message : String(e))
  }
}

async function directChat(
  content: string,
  model: string,
  onChunk: (text: string) => void,
  onDone: (fullText: string, usage: Record<string, number>) => void,
  onError: (err: string) => void,
  customConfig?: { baseUrl: string; apiKey: string; model: string },
  history?: Array<{ role: string; content: string }>,
) {
  // 优先使用传入的自定义配置，否则用 gfw 默认
  // 开发模式下所有外部 API 都走 Vite 代理避免 CORS
  let baseUrl = customConfig?.baseUrl || GFW_AI
  let proxyTarget = ''
  if (isDev && baseUrl.startsWith('http')) {
    proxyTarget = baseUrl
    baseUrl = '/proxy/custom'
  }
  const key = customConfig?.apiKey || gfwApiKey || localStorage.getItem('gfw_api_key')
  const activeModel = customConfig?.model || model

  if (!key) {
    onError('未配置 API Key，请在设置中配置 gfw.net 账户或自定义 API 提供商。')
    return
  }

  try {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    }
    if (proxyTarget) {
      headers['x-proxy-target'] = proxyTarget
    }

    const r = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: activeModel,
        messages: [...(history || []), { role: 'user', content }],
        stream: true,
      }),
    })

    if (!r.ok) {
      const err = await r.text()
      onError(`API Error (${r.status}): ${err}`)
      return
    }

    const reader = r.body?.getReader()
    if (!reader) { onError('No response body'); return }

    const decoder = new TextDecoder()
    let fullText = ''
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data: ')) continue
        const data = trimmed.slice(6).trim()
        if (data === '[DONE]') {
          onDone(fullText, {})
          return
        }
        try {
          const parsed = JSON.parse(data)
          const delta = parsed.choices?.[0]?.delta?.content
          if (delta) {
            fullText += delta
            onChunk(delta)
          }
          if (parsed.usage) {
            onDone(fullText, parsed.usage)
            return
          }
        } catch {
          // incomplete JSON, will retry next chunk
        }
      }
    }

    // 处理 buffer 残留
    if (buffer.trim().startsWith('data: ')) {
      const data = buffer.trim().slice(6).trim()
      if (data && data !== '[DONE]') {
        try {
          const parsed = JSON.parse(data)
          const delta = parsed.choices?.[0]?.delta?.content
          if (delta) { fullText += delta; onChunk(delta) }
        } catch { /* ignore */ }
      }
    }

    onDone(fullText, {})
  } catch (e: unknown) {
    onError(e instanceof Error ? e.message : String(e))
  }
}
