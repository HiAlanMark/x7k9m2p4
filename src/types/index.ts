// GFW API 类型
export interface GfwUser {
  id: number
  email: string
  nickname: string
  gcoin_balance: number
  gcoin_frozen: number
  total_recharge: number
  total_consumed: number
  user_group_code: string
}

export interface GfwModel {
  id: string
  name: string
  name_en: string
  provider: string
  model_type: string
  input_price: number
  output_price: number
  cache_price: number
  context_window: number
  max_output_tokens: number
  max_input_tokens: number
  is_available: boolean
  is_featured: boolean
  rpm: number
  tpm: number
  model_code: string   // GFW API 模型标识符 (如 "gpt-4o")
  model_name: string   // 模型显示名 (如 "GPT-4o")
  supports_thinking: boolean
  supports_vision: boolean
  supports_function_call: boolean
  supports_json_output: boolean
  supports_cache: boolean
  description: string
  pricing_rules: PricingRules | null
  discount: number | null
}

export interface PricingRules {
  input: PricingTier[]
  output: PricingTier[]
}

export interface PricingTier {
  condition: string
  input_price: number
  output_price: number
}

export interface ApiKeyInfo {
  id: number
  key_prefix: string
  can_retrieve: boolean
  name: string
  rate_limit: number
  gcoin_limit: number
  used_quota: number
  cycle_type: string
  cycle_reset_at: string | null
  last_used_at: string | null
  is_active: boolean
  created_at: string
}

export interface DailyUsage {
  date: string
  request_count: number
  input_tokens: number
  output_tokens: number
  total_cost: number
}

export interface RechargePackage {
  id: number
  name: string
  description: string
  price: number
  gcoin_amount: number
  bonus_gcoin: number
  discount_rate: number
  is_active: boolean
  purchase_limit: number
  upgrade_group: string
  badge: string
}

export interface SrProvider {
  id: number
  code: string
  name: string
  model_type: string
  base_url: string
  auth_header: string
  auth_prefix: string
  is_active: boolean
}

// 2x.com.cn 类型
export interface TwoXUser {
  id: number
  phone?: string
  username: string
}

export interface TwoXUserProfile {
  id: number
  phone?: string
  username: string
  nickname: string
  avatar: string
  email?: string
  is_admin: boolean
  created_at: string
}

export interface TwoXSkill {
  id: number
  slug: string
  name: string
  summary: string
  description: string
  owner_id: number
  visibility: number
  category: string
  tags: string[]
  capabilities: string[]
  license: string
  current_version: string
  status: number
  total_downloads: number
  total_favorites: number
  average_rating: number
  total_reviews: number
  created_at: string
  updated_at: string
}

export interface TwoXSkillDetail extends TwoXSkill {
  long_description: string
  owner?: TwoXUserProfile
}

export interface TwoXReview {
  id: number
  rating: number
  title: string
  content: string
  user: TwoXUser
  created_at: string
}

export interface TwoXRanking {
  rank: number
  skill_id: number
  slug: string
  name: string
  score: number
}

export interface TwoXWorkflow {
  id: number
  user_id: number
  name: string
  slug: string
  summary: string
  description: string
  category: string
  tags: string[]
  visibility: string
  license: string
  version: string
  status: number
  downloads: number
  stars: number
  executions: number
  created_at: string
  updated_at: string
}

export interface TwoXWorkflowDetail extends TwoXWorkflow {
  workflow_yaml: string
}

export interface TwoXDownload {
  skill_id: number
  skill_name: string
  downloaded_at: string
}

// Agent WebSocket 消息类型
export interface StreamChunk {
  type: 'stream_chunk'
  id: string
  content: string
  timestamp: string
}

export interface ToolCallStart {
  type: 'tool_call_start'
  id: string
  tool: string
  tool_input: Record<string, unknown>
  timestamp: string
}

export interface ToolCallResult {
  type: 'tool_call_result'
  id: string
  tool: string
  status: 'completed' | 'failed'
  output: string
  timestamp: string
}

export interface ChatComplete {
  type: 'chat_complete'
  id: string
  final_response: string
  token_usage: Record<string, unknown>
  model: string
  duration_ms: number
  timestamp: string
}

export interface AgentError {
  type: 'error'
  id: string | null
  error_code: string
  message: string
  recoverable: boolean
  timestamp: string
}

export type AgentMessage = StreamChunk | ToolCallStart | ToolCallResult | ChatComplete | AgentError

// 聊天消息
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  tool_calls?: ToolCallInfo[]
  token_usage?: Record<string, number>
  model?: string
  duration_ms?: number
}

export interface ToolCallInfo {
  tool: string
  input: Record<string, unknown>
  output?: string
  status: 'running' | 'completed' | 'failed'
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
  hermesSessionId?: string  // hermes agent 会话 ID，用于上下文续接
}
