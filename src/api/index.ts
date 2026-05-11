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
) {
  // 优先使用传入的自定义配置，否则用 gfw 默认
  // 自定义 URL 在开发模式下也需要代理（如果是 gfw.net 的话）
  let baseUrl = customConfig?.baseUrl || GFW_AI
  if (isDev && baseUrl.includes('api.gfw.net')) {
    baseUrl = baseUrl.replace('https://api.gfw.net', '/proxy/gfw')
  }
  const key = customConfig?.apiKey || gfwApiKey || localStorage.getItem('gfw_api_key')
  const activeModel = customConfig?.model || model

  if (!key) {
    onError('未配置 API Key，请在设置中配置 gfw.net 账户或自定义 API 提供商。')
    return
  }

  try {
    const r = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: activeModel,
        messages: [{ role: 'user', content }],
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

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      for (const line of chunk.split('\n')) {
        if (!line.startsWith('data: ')) continue
        const data = line.slice(6).trim()
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
          // 检查 usage
          if (parsed.usage) {
            onDone(fullText, parsed.usage)
            return
          }
        } catch {
          // ignore parse errors
        }
      }
    }

    onDone(fullText, {})
  } catch (e: unknown) {
    onError(e instanceof Error ? e.message : String(e))
  }
}
