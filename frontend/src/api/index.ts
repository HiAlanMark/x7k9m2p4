import type {
  GfwUser, GfwModel, ApiKeyInfo, DailyUsage, RechargePackage, SrProvider,
  TwoXSkill, TwoXSkillDetail, TwoXReview, TwoXRanking, TwoXWorkflow, TwoXDownload,
} from '@/types'

// ============================================================
// API 调用层 — 直接 HTTP 调用 (Wails 模式)
// ============================================================

async function invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  return browserFallback<T>(cmd, args)
}

// ============================================================
// 浏览器模式：直接 HTTP 调用 (无需 Tauri 后端)
// ============================================================

// 浏览器开发模式下通过 Vite 代理避免 CORS
const isDev = import.meta.env?.DEV ?? false
const GFW_BASE = isDev ? '/proxy/gfw/api/v1' : 'https://api.gfw.net/api/v1'
const GFW_AI = isDev ? '/proxy/gfw/v1' : 'https://api.gfw.net/v1'
const TWO_X_BASE = isDev ? '/proxy/agent/v1/store' : '/v1/store'

// ══ 2x 全局限流：所有 2x API 请求串行排队，间隔 300ms ══
let twoXQueue: Array<() => void> = []
let twoXIdle = true
function twoXEnqueue(task: () => void) {
  twoXQueue.push(task)
  if (twoXIdle) drainTwoXQueue()
}
async function drainTwoXQueue() {
  twoXIdle = false
  while (twoXQueue.length > 0) {
    const task = twoXQueue.shift()!
    task()
    await new Promise(r => setTimeout(r, 300))
  }
  twoXIdle = true
}

async function twoXFetch(url: string, opts?: RequestInit, retries = 2): Promise<any> {
  return new Promise((resolve, reject) => {
    twoXEnqueue(async () => {
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const r = await fetch(url, opts)
          if (r.status === 429) {
            if (attempt < retries) {
              await new Promise(r => setTimeout(r, 2000 * (attempt + 1)))
              continue
            }
            resolve({ _error: true, _status: 429 })
            return
          }
          const body = await r.json()
          // 转换 PostgreSQL 数组字段为 JS 数组（2x 数据库格式）
          normalizeTwoXResponse(body)
          resolve(body)
          return
        } catch (err) {
          if (attempt < retries) {
            await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
            continue
          }
          reject(err)
        }
      }
    })
  })
}

// 解析 PostgreSQL 数组字符串 → JS 数组
function parsePGArray(s: any): string[] {
  if (Array.isArray(s)) return s
  if (typeof s !== 'string' || !s.startsWith('{')) return []
  const inner = s.slice(1, -1)
  if (!inner) return []
  const result: string[] = []
  let i = 0
  while (i < inner.length) {
    if (inner[i] === '"') {
      const end = inner.indexOf('"', i + 1)
      if (end === -1) break
      result.push(inner.slice(i + 1, end))
      i = end + 1
      while (i < inner.length && inner[i] === ',') i++
    } else {
      const comma = inner.indexOf(',', i)
      if (comma === -1) { result.push(inner.slice(i)); break }
      result.push(inner.slice(i, comma))
      i = comma + 1
    }
  }
  return result
}

// 递归转换 2x API 响应中的 PostgreSQL 数组字段
function normalizeTwoXResponse(obj: any) {
  if (!obj || typeof obj !== 'object') return
  if (Array.isArray(obj)) { for (const item of obj) normalizeTwoXResponse(item); return }
  for (const key of ['tags', 'capabilities', 'capability', 'requirements', 'platforms']) {
    if (typeof obj[key] === 'string') obj[key] = parsePGArray(obj[key])
  }
  for (const k of ['data', 'skills', 'results', 'result']) {
    if (obj[k]) normalizeTwoXResponse(obj[k])
  }
}

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
      const body = await twoXFetch(url)
      return { skills: body.data || [], total: body.total || 0 } as T
    }

    case 'skill_store_search_skills': {
      const body = await twoXFetch(`${TWO_X_BASE}/skills/latest?q=${encodeURIComponent(args?.query as string)}&limit=50`)
      return { skills: body.data || [] } as T
    }

    case 'skill_store_get_skill_detail': {
      const body = await twoXFetch(`${TWO_X_BASE}/skills/${args?.idOrSlug}`)
      return body.data as T
    }

    case 'skill_store_get_popular_skills': {
      const body = await twoXFetch(`${TWO_X_BASE}/skills/popular?limit=${args?.limit || 50}`)
      return { skills: body.data || [] } as T
    }

    case 'skill_store_get_rankings': {
      const body = await twoXFetch(`${TWO_X_BASE}/rankings/${args?.rankingType}`)
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

const AGENT_BASE = isDev ? '/proxy/agent' : ''  // Wails 模式下走 AssetServer Handler（同源）

// ── Auth Token ──
const HERMES_AUTH_KEY = 'hermes_auth_token'

export function getAuthToken(): string | null {
  return localStorage.getItem(HERMES_AUTH_KEY)
}

export function setAuthToken(token: string) {
  localStorage.setItem(HERMES_AUTH_KEY, token)
}

export function clearAuthToken() {
  localStorage.removeItem(HERMES_AUTH_KEY)
}

export async function agentFetch(path: string, opts?: RequestInit) {
  const token = getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts?.headers as Record<string, string> || {}),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  const r = await fetch(`${AGENT_BASE}${path}`, {
    ...opts,
    headers,
  })
  // If we get 401, clear the stored token so the login modal reappears
  if (r.status === 401 && token) {
    clearAuthToken()
  }
  if (!r.ok) {
    const errBody = await r.text().catch(() => '')
    throw new Error(`Agent 请求失败 (${r.status}): ${errBody || r.statusText}`)
  }
  return r
}

export async function agentJson(path: string, opts?: RequestInit) {
  const r = await agentFetch(path, opts)
  return r.json()
}

export async function agentPost(path: string, body: Record<string, unknown>) {
  return agentJson(path, { method: 'POST', body: JSON.stringify(body) })
}

// --- File Browser ---
export interface FileEntry {
  name: string
  type: 'file' | 'dir' | 'unknown'
  size: number
  modified: string
  permissions: string
}

export interface FileListResult {
  path: string
  entries: FileEntry[]
}

export interface FileReadResult {
  path: string
  content: string
  language: string
}

export interface FileUploadResult {
  uploaded: Array<{ path: string; name: string; size: number }>
}

export async function filesList(dirPath: string = '~'): Promise<FileListResult> {
  return agentJson(`/v1/agent/files?path=${encodeURIComponent(dirPath)}`)
}

export async function filesRead(filePath: string): Promise<FileReadResult> {
  return agentJson(`/v1/agent/files/read?path=${encodeURIComponent(filePath)}`)
}

export async function filesUpload(dirPath: string, file: File): Promise<FileUploadResult> {
  const token = getAuthToken()
  const formData = new FormData()
  formData.append('path', dirPath)
  formData.append('file', file)
  const headers: Record<string, string> = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  const r = await fetch(`${AGENT_BASE}/v1/agent/files/upload`, {
    method: 'POST',
    headers,
    body: formData,
  })
  if (!r.ok) {
    const errBody = await r.text().catch(() => '')
    throw new Error(`Upload failed (${r.status}): ${errBody || r.statusText}`)
  }
  return r.json()
}

export async function filesDownload(filePath: string): Promise<void> {
  const token = getAuthToken()
  const headers: Record<string, string> = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  const r = await fetch(`${AGENT_BASE}/v1/agent/files/download?path=${encodeURIComponent(filePath)}`, { headers })
  if (!r.ok) {
    throw new Error(`Download failed (${r.status})`)
  }
  const blob = await r.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filePath.split('/').pop() || 'download'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function filesMkdir(dirPath: string): Promise<{ path: string; created: boolean }> {
  return agentPost('/v1/agent/files/mkdir', { path: dirPath })
}

export async function filesRename(filePath: string, newName: string): Promise<{ path: string; old_path: string }> {
  return agentPost('/v1/agent/files/rename', { path: filePath, new_name: newName })
}

export async function filesMove(filePath: string, dest: string): Promise<{ path: string; old_path: string }> {
  return agentPost('/v1/agent/files/move', { path: filePath, dest })
}

export async function filesDelete(filePath: string): Promise<{ deleted: string }> {
  return agentJson(`/v1/agent/files?path=${encodeURIComponent(filePath)}`, { method: 'DELETE' })
}

// --- Auth ---
export async function hermesAuthLogin(token: string): Promise<{ success: boolean; token?: string }> {
  const r = await fetch(`${AGENT_BASE}/v1/agent/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
  if (!r.ok) {
    if (r.status === 401) return { success: false }
    throw new Error(`Auth login failed (${r.status})`)
  }
  return r.json()
}

export async function hermesAuthStatus(): Promise<{ authenticated: boolean; has_token: boolean }> {
  const r = await fetch(`${AGENT_BASE}/v1/agent/auth/status`)
  if (!r.ok) throw new Error(`Auth status failed (${r.status})`)
  return r.json()
}

export async function hermesAuthAutoLogin(): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const r = await fetch(`${AGENT_BASE}/v1/agent/auth/auto-login`, { signal: AbortSignal.timeout(2000) })
    if (!r.ok) return { success: false, error: `HTTP ${r.status}` }
    return r.json()
  } catch (e: any) {
    return { success: false, error: e?.message || 'auto-login unavailable' }
  }
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
export async function hermesCronEdit(id: string, updates: { schedule?: string; prompt?: string; name?: string; skills?: string }) {
  return agentPost('/v1/agent/cron/edit', { id, ...updates })
}

export async function hermesCronUpdate(id: string, updates: { schedule?: string; prompt?: string; name?: string }) {
  return hermesCronEdit(id, updates)
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

// --- Usage Analytics ---
export async function hermesUsageSummary(period: string = '30d') {
  return agentJson(`/v1/agent/usage/summary?period=${period}`)
}

export async function hermesUsageModels() {
  return agentJson('/v1/agent/usage/models')
}

// --- Channels ---
export interface ChannelConfig {
  platform: string
  enabled: boolean
  config: Record<string, string>
}

export async function hermesChannelsList(): Promise<{ channels: ChannelConfig[] }> {
  return agentJson('/v1/agent/channels')
}

export async function hermesChannelsUpdate(platform: string, config: Record<string, string>, enabled: boolean) {
  return agentPost('/v1/agent/channels/update', { platform, config, enabled })
}

// --- Generate Title ---
export async function generateTitle(
  userMessage: string,
  assistantReply: string,
  config: { baseUrl: string; apiKey: string; model: string },
): Promise<string> {
  const isDev_ = import.meta.env?.DEV ?? false
  let baseUrl = config.baseUrl || GFW_AI
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${config.apiKey}`,
    'Content-Type': 'application/json',
  }
  if (isDev_ && baseUrl.startsWith('http')) {
    headers['x-proxy-target'] = baseUrl
    baseUrl = '/proxy/custom'
  }
  try {
    const r = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: '用5-10个中文字概括以下对话的主题，只输出标题本身，不要标点符号、引号或解释。' },
          { role: 'user', content: `用户: ${userMessage.substring(0, 200)}\n助手: ${assistantReply.substring(0, 300)}` },
        ],
        max_tokens: 20,
        temperature: 0.3,
        stream: false,
      }),
      signal: AbortSignal.timeout(8000),
    })
    if (!r.ok) return ''
    const data = await r.json()
    const title = data.choices?.[0]?.message?.content?.trim() || ''
    return title.replace(/["""''「」『』]/g, '').substring(0, 30)
  } catch (e) {
    console.warn('[API] generateTitle failed:', e)
    return ''
  }
}

// ============================================================
// 浏览器模式专用：直接调用 gfw.net 进行对话
// ============================================================

export function isBrowserMode() {
  return true
}

export async function browserChat(
  content: string,
  model: string,
  onChunk: (text: string) => void,
  onDone: (fullText: string, usage: Record<string, number>) => void,
  onError: (err: string) => void,
  customConfig?: { baseUrl: string; apiKey: string; model: string; blueprint_run_id?: string },
  onToolCall?: (tool: string, args: Record<string, unknown>) => void,
  onToolResult?: (tool: string, result: string, duration: number) => void,
  history?: Array<{ role: string; content: string }>,
  onStatus?: (message: string, iteration: number, maxIterations: number) => void,
  onApproval?: (id: string, tool: string, command: string, reason: string) => void,
  sessionId?: string,
  onSessionId?: (sid: string) => void,
) {
  // 优先尝试 Agent Server（同源或本地端口）
  const agentUrl = isDev ? '/proxy/agent' : ''  // Wails 模式下走 AssetServer Handler（同源）
  const agentAvailable = await checkAgentHealth(agentUrl)

  if (agentAvailable) {
    return agentChat(content, model, onChunk, onDone, onError, customConfig, onToolCall, onToolResult, agentUrl, history, onStatus, onApproval, sessionId, onSessionId)
  }

  // Fallback: 直接调 LLM API（纯聊天，无工具能力）
  return directChat(content, model, onChunk, onDone, onError, customConfig, history)
}

async function checkAgentHealth(agentUrl: string): Promise<boolean> {
  try {
    const r = await fetch(`${agentUrl}/v1/agent/health`, { signal: AbortSignal.timeout(1500) })
    return r.ok
  } catch (e) {
    console.warn('[API] Agent health check failed:', e)
    return false
  }
}

export interface AgentStatus {
  status: string
  uptime: number
  agent: string
  version: string
  runtime: string
  tools: string[]
  platform: string
  hermes: {
    available: boolean
    path?: string
    version?: string
    source_dir?: string
    skills_dir: string
    source: string
  }
}

export async function getAgentStatus(): Promise<AgentStatus | null> {
  try {
    const r = await agentFetch('/v1/agent/status', {
      signal: AbortSignal.timeout(3000),
    })
    if (!r.ok) return null
    return await r.json()
  } catch (e) {
    console.warn('[API] getAgentStatus failed:', e)
    return null
  }
}

async function agentChat(
  content: string,
  model: string,
  onChunk: (text: string) => void,
  onDone: (fullText: string, usage: Record<string, number>) => void,
  onError: (err: string) => void,
  customConfig?: { baseUrl: string; apiKey: string; model: string; blueprint_run_id?: string },
  onToolCall?: (tool: string, args: Record<string, unknown>) => void,
  onToolResult?: (tool: string, result: string, duration: number) => void,
  agentUrl?: string,
  history?: Array<{ role: string; content: string }>,
  onStatus?: (message: string, iteration: number, maxIterations: number) => void,
  onApproval?: (id: string, tool: string, command: string, reason: string) => void,
  sessionId?: string,
  onSessionId?: (sid: string) => void,
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

  const url = agentUrl || AGENT_BASE

  try {
    const authToken = getAuthToken()
    const chatHeaders: Record<string, string> = { 'Content-Type': 'application/json' }
    if (authToken) {
      chatHeaders['Authorization'] = `Bearer ${authToken}`
    }
    const r = await fetch(`${url}/v1/agent/chat`, {
      method: 'POST',
      headers: chatHeaders,
      body: JSON.stringify({
        content,
        api_base: llmBase,
        api_key: key,
        model: activeModel,
        messages: history || [],
        session_id: sessionId || '',
        blueprint_run_id: customConfig?.blueprint_run_id || undefined,
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
            case 'session_id':
              onSessionId?.(evt.session_id || '')
              break
            case 'usage':
              usage = evt
              break
            case 'error':
              onError(evt.message || '未知错误')
              return
            case 'done':
              fullText = evt.final_response || evt.content || fullText
              if (evt.token_usage) {
                usage = evt.token_usage
              }
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
          else if (evt.type === 'done') {
            fullText = evt.final_response || evt.content || fullText
            if (evt.token_usage) { usage = evt.token_usage }
          }
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

// ═══════════════════════════════════════════════════════════
//  Group Chat API
// ═══════════════════════════════════════════════════════════

export interface GroupChatListResult {
  groups: Array<{
    id: string
    name: string
    created_at: string
    updated_at: string
    agent_count: number
  }>
}

export interface GroupChatDetailResult {
  group: {
    id: string
    name: string
    created_at: string
    updated_at: string
    agents: Array<{
      id: string
      name: string
      model: string
      system_prompt: string
      color: string
      created_at: string
    }>
    messages: Array<{
      id: string
      group_id: string
      agent_id: string | null
      role: string
      content: string
      timestamp: string
      mentions: string
    }>
  }
}

export interface GroupChatCreateResult {
  group: {
    id: string
    name: string
    created_at: string
    updated_at: string
    agents: Array<{
      id: string
      name: string
      model: string
      system_prompt: string
      color: string
      created_at: string
    }>
  }
}

export interface GroupMessagesResult {
  messages: Array<{
    id: string
    group_id: string
    agent_id: string | null
    role: string
    content: string
    timestamp: string
    mentions: string
  }>
  total: number
  limit: number
  offset: number
}

export async function groupChatsList(): Promise<GroupChatListResult> {
  return agentJson('/v1/agent/group-chats')
}

export async function groupChatsCreate(name: string, agents: Array<{
  name: string
  model: string
  system_prompt: string
  color?: string
}>): Promise<GroupChatCreateResult> {
  return agentPost('/v1/agent/group-chats', { name, agents })
}

export async function groupChatDetail(id: string): Promise<GroupChatDetailResult> {
  return agentJson(`/v1/agent/group-chats/${id}`)
}

export async function groupChatDelete(id: string): Promise<{ deleted: string }> {
  return agentJson(`/v1/agent/group-chats/${id}`, { method: 'DELETE' })
}

export async function groupChatAddAgent(
  groupId: string,
  agent: { name: string; model: string; system_prompt: string; color?: string },
): Promise<{ agent: { id: string; name: string; model: string; system_prompt: string; color: string; created_at: string } }> {
  return agentPost(`/v1/agent/group-chats/${groupId}/agents`, agent as unknown as Record<string, unknown>)
}

export async function groupChatRemoveAgent(
  groupId: string,
  agentId: string,
): Promise<{ removed: string }> {
  return agentJson(`/v1/agent/group-chats/${groupId}/agents/${agentId}`, { method: 'DELETE' })
}

export async function groupChatMessages(
  groupId: string,
  limit = 50,
  offset = 0,
): Promise<GroupMessagesResult> {
  return agentJson(`/v1/agent/group-chats/${groupId}/messages?limit=${limit}&offset=${offset}`)
}

export async function groupChatSendMessage(
  groupId: string,
  content: string,
  mentions: string[] = [],
): Promise<Response> {
  // Returns SSE stream — use agentFetch to get raw Response
  return agentFetch(`/v1/agent/group-chats/${groupId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content, mentions }),
  })
}

// ═══════════════════════════════════════════════════════════
//  Coding Agents API
// ═══════════════════════════════════════════════════════════

export interface CodingAgent {
  id: string
  name: string
  installed: boolean
  version: string | null
  running: boolean
  config: Record<string, unknown>
}

export interface CodingAgentsListResult {
  agents: CodingAgent[]
}

export interface CodingAgentLaunchResult {
  pid: number
  started_at: string
}

export interface CodingAgentLogsResult {
  logs: string[]
  lines: number
}

export interface CodingAgentConfigResult {
  config: Record<string, unknown>
}

export async function codingAgentsList(): Promise<CodingAgentsListResult> {
  return agentJson('/v1/agent/coding-agents')
}

export async function codingAgentLaunch(
  id: string,
  opts?: { workdir?: string; prompt?: string; model?: string },
): Promise<CodingAgentLaunchResult> {
  return agentPost(`/v1/agent/coding-agents/${id}/launch`, {
    workdir: opts?.workdir,
    prompt: opts?.prompt,
    model: opts?.model,
  })
}

export async function codingAgentStop(id: string): Promise<{ stopped: boolean }> {
  return agentPost(`/v1/agent/coding-agents/${id}/stop`, {})
}

export async function codingAgentLogs(id: string): Promise<CodingAgentLogsResult> {
  return agentJson(`/v1/agent/coding-agents/${id}/logs`)
}

export async function codingAgentGetConfig(id: string): Promise<CodingAgentConfigResult> {
  return agentJson(`/v1/agent/coding-agents/${id}/config`)
}

export async function codingAgentSetConfig(id: string, config: Record<string, unknown>): Promise<{ success: boolean }> {
  return agentPost(`/v1/agent/coding-agents/${id}/config`, { config })
}

// ══════════════════════════════════════════════════════════════════
// P0+P1 New API Functions
// ══════════════════════════════════════════════════════════════════

// ── Session Search (FTS5) ──

export interface SessionSearchResult {
  id: string
  title: string
  model: string
  source: string
  started_at: string
  message_count: number
  snippet?: string
}

export interface SessionSearchResponse {
  total: number
  sessions: SessionSearchResult[]
  query: string
  limit: number
  offset: number
}

export async function sessionSearch(query: string, limit = 20, offset = 0): Promise<SessionSearchResponse> {
  return agentJson(`/v1/agent/sessions/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`)
}

// ── Session Export ──

export async function sessionExport(sessionId: string, format: 'json' | 'markdown' = 'json'): Promise<Blob> {
  const r = await agentFetch(`/v1/agent/sessions/export?session_id=${encodeURIComponent(sessionId)}&format=${format}`)
  return r.blob()
}

// ── Session Usage ──

export interface SessionUsage {
  id: string
  title: string
  model: string
  started_at: string
  input_tokens: number
  output_tokens: number
  cache_read_tokens: number
  cache_write_tokens: number
  reasoning_tokens: number
  estimated_cost_usd: number
  actual_cost_usd: number
  message_count: number
}

export interface SessionUsageResponse {
  total: number
  sessions: SessionUsage[]
}

export async function sessionUsage(limit = 50, offset = 0): Promise<SessionUsageResponse> {
  return agentJson(`/v1/agent/sessions/usage?limit=${limit}&offset=${offset}`)
}

// ── Session Batch Delete ──

export async function sessionBatchDelete(sessionIds: string[]): Promise<{ deleted: number; errors: string[] }> {
  return agentPost('/v1/agent/sessions/batch-delete', { session_ids: sessionIds })
}

// ── Available Models ──

export interface AvailableModel {
  id: string
  provider: string
  base_url?: string
  api_key_set?: boolean
}

export interface AvailableModelsResponse {
  models: AvailableModel[]
  default_model: string
  total: number
}

export async function availableModels(): Promise<AvailableModelsResponse> {
  return agentJson('/v1/agent/available-models')
}

// ── Model Context ──

export interface ModelContextResponse {
  model: string
  context_length: number
  known_models: Record<string, number>
}

export async function modelContext(): Promise<ModelContextResponse> {
  return agentJson('/v1/agent/model-context')
}

// ── Profile Runtime Status ──

export interface ProfileRuntimeStatus {
  name: string
  running: boolean
  pids: number[]
  config_exists: boolean
  status: string
}

export interface ProfilesRuntimeResponse {
  profiles: ProfileRuntimeStatus[]
}

export async function profilesRuntimeStatuses(): Promise<ProfilesRuntimeResponse> {
  return agentJson('/v1/agent/profiles/runtime-statuses')
}

export async function profileRuntimeStatus(name: string): Promise<ProfileRuntimeStatus> {
  return agentJson(`/v1/agent/profiles/${encodeURIComponent(name)}/runtime-status`)
}

export async function profileRestart(name: string): Promise<{ name: string; restarted: boolean; error?: string }> {
  return agentPost(`/v1/agent/profiles/${encodeURIComponent(name)}/restart`, {})
}

// ── Cron History ──

export interface CronHistoryEntry {
  id: string
  name: string
  schedule: string
  last_run: string | null
  next_run: string | null
  last_status: string | null
  last_output: string | null
}

export interface CronHistoryResponse {
  total: number
  history: CronHistoryEntry[]
}

export async function cronHistory(): Promise<CronHistoryResponse> {
  return agentJson('/v1/agent/cron-history')
}

// ── Config PUT ──

export async function updateConfigYaml(yamlContent: string): Promise<{ success: boolean }> {
  const r = await agentFetch('/v1/agent/config', {
    method: 'PUT',
    headers: { 'Content-Type': 'text/yaml' },
    body: yamlContent,
  })
  return r.json()
}

// ── Config Credentials ──

export interface CredentialsResponse {
  credentials: Record<string, string>
  keys: string[]
}

export async function getCredentials(): Promise<CredentialsResponse> {
  const r = await agentFetch('/v1/agent/config/credentials', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  })
  return r.json()
}

export async function updateCredentials(credentials: Record<string, string>): Promise<{ success: boolean; updated: string[] }> {
  return agentPost('/v1/agent/config/credentials', credentials)
}

// ── Logs ──

export interface LogFile {
  name: string
  size: number
  modified: string
}

export interface LogsResponse {
  logs: LogFile[]
  directory: string
}

export async function listLogs(): Promise<LogsResponse> {
  return agentJson('/v1/agent/logs')
}

export async function readLog(name: string, lines = 100): Promise<string> {
  const r = await agentFetch(`/v1/agent/logs/${encodeURIComponent(name)}?lines=${lines}`)
  const data = await r.json()
  return data.content || ''
}

// ── Skills Toggle/Pin/Usage ──

export async function toggleSkill(name: string): Promise<{ name: string; enabled: boolean }> {
  return agentPost('/v1/agent/skills/toggle', { name })
}

export async function pinSkill(name: string): Promise<{ name: string; pinned: boolean }> {
  return agentPost('/v1/agent/skills/pin', { name })
}

export interface SkillUsageStat {
  tool_name: string
  count: number
  last_used: string | null
}

export interface SkillUsageResponse {
  stats: SkillUsageStat[]
  total_tools: number
}

export async function skillsUsageStats(): Promise<SkillUsageResponse> {
  return agentJson('/v1/agent/skills/usage/stats')
}

// ── File Copy/Write/Stat ──

export async function fileCopy(src: string, dst: string): Promise<{ success: boolean; src: string; dst: string }> {
  return agentPost('/v1/agent/files/copy', { src, dst })
}

export async function fileWrite(path: string, content: string): Promise<{ success: boolean; path: string; bytes: number }> {
  const r = await agentFetch('/v1/agent/files/write', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, content }),
  })
  return r.json()
}

export interface FileStat {
  path: string
  name: string
  size: number
  is_dir: boolean
  modified: string
  created: string
  permissions: string
}

export async function fileStat(path: string): Promise<FileStat> {
  return agentJson(`/v1/agent/files/stat?path=${encodeURIComponent(path)}`)
}

// ── TTS ──

export interface TTSResponse {
  provider: string
  status: string
  audio_url?: string
  message?: string
}

export async function textToSpeech(text: string, voice?: string): Promise<TTSResponse> {
  return agentPost('/v1/agent/tts', { text, voice })
}
