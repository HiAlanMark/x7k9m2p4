import { invoke } from '@tauri-apps/api/core'
import type {
  GfwUser, GfwModel, ApiKeyInfo, DailyUsage, RechargePackage, SrProvider,
  TwoXSkill, TwoXSkillDetail, TwoXReview, TwoXRanking, TwoXWorkflow, TwoXDownload,
} from '@/types'

// ============================================================
// gfw.net API
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
  return invoke<{ id: number; key: string; name: string; gcoin_limit: number; rate_limit: number }>(
    'gfw_create_api_key',
    { name, gcoinLimit: gcoinLimit, rateLimit: rateLimit }
  )
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
  return invoke<{ id: string; pay_url: string | null; status: string }>(
    'gfw_create_recharge_order',
    { packageId, payMethod }
  )
}

export async function gfwListSrProviders() {
  return invoke<SrProvider[]>('gfw_list_sr_providers')
}

// ============================================================
// 2x.com.cn Skill 商店 API (基于真实 API)
// ============================================================

export async function twoXSendEmailCode(email: string) {
  return invoke('skill_store_send_email_code', { email })
}

export async function twoXEmailLogin(
  email: string,
  password: string,
  captchaId?: string,
  captchaCode?: string,
) {
  return invoke<{ token: string; expires_in: number; user: { id: number; username: string; phone?: string } }>(
    'skill_store_email_login',
    { email, password, captchaId, captchaCode }
  )
}

export async function twoXPhoneLogin(
  phone: string,
  password: string,
  captchaId?: string,
  captchaCode?: string,
) {
  return invoke<{ token: string; expires_in: number; user: { id: number; username: string; phone?: string } }>(
    'skill_store_phone_login',
    { phone, password, captchaId, captchaCode }
  )
}

export async function twoXGetProfile() {
  return invoke('skill_store_get_profile')
}

export async function twoXGetPopularSkills(limit = 50) {
  return invoke<{ skills: TwoXSkill[] }>('skill_store_get_popular_skills', { limit })
}

export async function twoXGetSkills(
  q?: string,
  category?: string,
  tags?: string,
  sort?: string,
  limit = 20,
  offset = 0,
) {
  return invoke<{ skills: TwoXSkill[] }>(
    'skill_store_get_skills',
    { q, category, tags, sort, limit, offset }
  )
}

export async function twoXSearchSkills(query: string) {
  return invoke<{ skills: TwoXSkill[] }>(
    'skill_store_search_skills',
    { query }
  )
}

export async function twoXGetSkillDetail(idOrSlug: string) {
  return invoke<TwoXSkillDetail>('skill_store_get_skill_detail', { idOrSlug })
}

export async function twoXToggleFavorite(idOrSlug: string) {
  return invoke<boolean>('skill_store_toggle_favorite', { idOrSlug })
}

export async function twoXGetDownloadUrl(idOrSlug: string) {
  return invoke<string>('skill_store_get_download_url', { idOrSlug })
}

export async function twoXGetReviews(idOrSlug: string, limit = 20, offset = 0) {
  return invoke<{ reviews: TwoXReview[] }>(
    'skill_store_get_reviews',
    { idOrSlug, limit, offset }
  )
}

export async function twoXGetRankings(rankingType: 'most_used' | 'highest_rated' | 'latest') {
  return invoke<{ type: string; rankings: TwoXRanking[] }>(
    'skill_store_get_rankings',
    { rankingType }
  )
}

export async function twoXGetWorkflows(
  page = 1,
  limit = 20,
  category?: string,
  tag?: string,
  q?: string,
  sort?: string,
) {
  return invoke<{ workflows: TwoXWorkflow[] }>(
    'skill_store_get_workflows',
    { page, limit, category, tag, q, sort }
  )
}

export async function twoXGetWorkflowCategories() {
  return invoke<string[]>('skill_store_get_workflow_categories')
}

export async function twoXGetMySkills() {
  return invoke<{ skills: TwoXSkill[] }>('skill_store_get_my_skills')
}

export async function twoXGetFavorites() {
  return invoke<{ skills: TwoXSkill[] }>('skill_store_get_favorites')
}

export async function twoXGetDownloads() {
  return invoke<{ downloads: TwoXDownload[] }>('skill_store_get_downloads')
}

// ============================================================
// Agent API
// ============================================================

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

// ============================================================
// 配置 API
// ============================================================

export async function configGet(key: string) {
  return invoke<unknown>('config_get', { key })
}

export async function configSet(key: string, value: unknown) {
  return invoke('config_set', { key, value })
}

export async function configGetAll() {
  return invoke<Record<string, unknown>>('config_get_all')
}
