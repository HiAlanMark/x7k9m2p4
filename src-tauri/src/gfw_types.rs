use serde::{Deserialize, Serialize};

// ============================================================
// 通用 API 响应
// ============================================================

#[derive(Deserialize)]
pub struct GfwApiResponse<T> {
    pub code: u32,
    #[serde(default)]
    pub message: String,
    pub data: Option<T>,
    #[serde(default, rename = "request_id")]
    pub request_id: Option<String>,
}

// ============================================================
// 认证
// ============================================================

#[derive(Serialize)]
pub struct LoginRequest<'a> {
    pub email: &'a str,
    pub password: &'a str,
}

#[derive(Deserialize)]
pub struct LoginResponse {
    pub token: String,
    pub refresh_token: String,
    pub user: UserProfile,
}

#[derive(Deserialize, Clone, Debug)]
pub struct UserProfile {
    pub id: u64,
    pub uuid: String,
    pub email: String,
    pub nickname: String,
    #[serde(default)]
    pub gcoin_balance: f64,
    #[serde(default)]
    pub gcoin_frozen: f64,
    #[serde(default)]
    pub total_recharge: f64,
    #[serde(default)]
    pub total_consumed: f64,
    pub status: u32,
    pub role: u32,
    #[serde(default)]
    pub user_group_code: String,
    #[serde(default)]
    pub created_at: String,
    #[serde(default)]
    pub last_login_at: String,
}

#[derive(Serialize)]
pub struct RefreshTokenRequest<'a> {
    pub refresh_token: &'a str,
}

// ============================================================
// 用户详情
// ============================================================

#[derive(Deserialize)]
pub struct UserDetail {
    pub group_code: String,
    pub group_name: String,
    pub is_reseller: bool,
    pub user: UserProfile,
}

// ============================================================
// 余额
// ============================================================

#[derive(Deserialize)]
pub struct BalanceResponse {
    pub balance: f64,
}

// ============================================================
// API Key
// ============================================================

#[derive(Deserialize)]
pub struct ApiKeyListResponse {
    pub keys: Vec<ApiKeyInfo>,
}

#[derive(Deserialize, Clone, Debug)]
pub struct ApiKeyInfo {
    pub id: u64,
    pub user_id: u64,
    pub key_prefix: String,
    pub can_retrieve: bool,
    pub name: String,
    pub rate_limit: u32,
    pub gcoin_limit: f64,
    pub used_quota: f64,
    pub cycle_type: String,
    pub cycle_reset_at: Option<String>,
    pub last_used_at: Option<String>,
    pub is_active: bool,
    pub created_at: String,
}

#[derive(Serialize)]
pub struct CreateApiKeyRequest {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub gcoin_limit: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub rate_limit: Option<u32>,
}

#[derive(Deserialize)]
pub struct CreateApiKeyResponse {
    pub key: ApiKeyObject,
}

#[derive(Deserialize)]
pub struct ApiKeyObject {
    pub id: u64,
    pub user_id: u64,
    pub key_prefix: String,
    pub can_retrieve: bool,
    pub name: String,
    pub gcoin_limit: f64,
    pub used_quota: f64,
    pub cycle_type: String,
    pub cycle_reset_at: Option<String>,
    pub is_active: bool,
    pub created_at: String,
}

#[derive(Deserialize)]
pub struct FullKeyResponse {
    pub key: String,
}

#[derive(Debug, Clone)]
pub struct FullApiKey {
    pub id: u64,
    pub key: String,
    pub name: String,
    pub gcoin_limit: f64,
    pub rate_limit: u32,
}

// ============================================================
// 模型 (管理 API - 完整信息)
// ============================================================

#[derive(Deserialize)]
pub struct ModelsResponse {
    pub models: Vec<ModelFull>,
}

#[derive(Deserialize, Clone, Debug)]
pub struct ModelFull {
    #[serde(rename = "model_code")]
    pub id: String,
    #[serde(rename = "model_name")]
    pub name: String,
    #[serde(rename = "model_name_en")]
    pub name_en: String,
    pub provider: String,
    #[serde(rename = "model_type")]
    pub model_type: String,
    #[serde(default)]
    pub input_price: f64,
    #[serde(default)]
    pub output_price: f64,
    #[serde(default)]
    pub cache_price: f64,
    #[serde(default)]
    pub context_window: u64,
    #[serde(default)]
    pub max_output_tokens: u64,
    #[serde(default)]
    pub max_input_tokens: u64,
    pub is_available: bool,
    pub is_featured: bool,
    #[serde(default)]
    pub rpm: u32,
    #[serde(default)]
    pub tpm: u64,
    #[serde(default)]
    pub supports_thinking: bool,
    #[serde(default)]
    pub supports_vision: bool,
    #[serde(default)]
    pub supports_function_call: bool,
    #[serde(default)]
    pub supports_json_output: bool,
    #[serde(default)]
    pub supports_cache: bool,
    #[serde(default)]
    pub description: String,
    #[serde(default)]
    pub pricing_rules: Option<PricingRules>,
    #[serde(default)]
    pub discount: Option<f64>,
}

#[derive(Deserialize, Clone, Debug)]
pub struct PricingRules {
    pub input: Vec<PricingTier>,
    pub output: Vec<PricingTier>,
}

#[derive(Deserialize, Clone, Debug)]
pub struct PricingTier {
    pub condition: String,
    #[serde(default)]
    pub input_price: f64,
    #[serde(default)]
    pub output_price: f64,
}

// ============================================================
// OpenAI 兼容 /v1/models 响应
// ============================================================

#[derive(Deserialize)]
pub struct OpenAiModelsResponse {
    pub data: Vec<OpenAiModelInfo>,
}

#[derive(Deserialize, Clone, Debug)]
pub struct OpenAiModelInfo {
    pub id: String,
    #[serde(default)]
    pub object: String,
    #[serde(default)]
    pub owned_by: String,
}

// ============================================================
// 用量统计
// ============================================================

#[derive(Deserialize)]
pub struct DailyUsageResponse {
    pub daily_usage: Vec<DailyUsage>,
}

#[derive(Deserialize, Clone, Debug)]
pub struct DailyUsage {
    pub date: String,
    pub request_count: u64,
    #[serde(default)]
    pub input_tokens: u64,
    #[serde(default)]
    pub output_tokens: u64,
    #[serde(default)]
    pub total_cost: f64,
}

#[derive(Deserialize)]
pub struct MonthlyUsageResponse {
    pub monthly_usage: Vec<MonthlyUsage>,
}

#[derive(Deserialize, Clone, Debug)]
pub struct MonthlyUsage {
    pub month: String,
    pub request_count: u64,
    pub input_tokens: u64,
    pub output_tokens: u64,
    pub total_cost: f64,
}

// ============================================================
// 充值
// ============================================================

#[derive(Deserialize)]
pub struct RechargePackagesResponse {
    pub packages: Vec<RechargePackage>,
}

#[derive(Deserialize, Clone, Debug)]
pub struct RechargePackage {
    pub id: u64,
    pub name: String,
    pub description: String,
    pub price: f64,
    pub gcoin_amount: f64,
    pub bonus_gcoin: f64,
    pub discount_rate: f64,
    pub is_active: bool,
    pub purchase_limit: u32,
    pub upgrade_group: String,
    pub badge: String,
}

#[derive(Serialize)]
pub struct CreateRechargeOrderRequest {
    pub package_id: u64,
    pub pay_method: String,
}

#[derive(Deserialize)]
pub struct RechargeOrderResponse {
    pub order: RechargeOrder,
}

#[derive(Deserialize, Clone, Debug)]
pub struct RechargeOrder {
    pub id: String,
    pub package_id: u64,
    pub amount: f64,
    pub pay_method: String,
    pub status: String,
    pub pay_url: Option<String>,
    pub created_at: String,
}

// ============================================================
// 超级路由
// ============================================================

#[derive(Deserialize)]
pub struct SrProvidersResponse {
    pub providers: Vec<SrProvider>,
}

#[derive(Deserialize, Clone, Debug)]
pub struct SrProvider {
    pub id: u64,
    pub code: String,
    pub name: String,
    #[serde(rename = "model_type")]
    pub model_type: String,
    pub base_url: String,
    pub auth_header: String,
    pub auth_prefix: String,
    pub is_active: bool,
}

// ============================================================
// 错误
// ============================================================

#[derive(Debug, thiserror::Error)]
pub enum GfwError {
    #[error("网络错误: {0}")]
    Network(#[from] reqwest::Error),

    #[error("API 错误: {message} (code: {code})")]
    Api { code: u32, message: String },

    #[error("未登录")]
    NotLoggedIn,

    #[error("Token 过期")]
    TokenExpired,

    #[error("无刷新 Token")]
    NoRefreshToken,

    #[error("API Key 无效")]
    InvalidApiKey,

    #[error("余额不足")]
    InsufficientBalance,

    #[error("频率限制")]
    RateLimited,

    #[error("序列化错误: {0}")]
    Serde(#[from] serde_json::Error),
}

impl GfwError {
    pub fn from_api_response(code: u32, message: String) -> Self {
        match code {
            1001 | 1005 => GfwError::TokenExpired,
            1007 => GfwError::NotLoggedIn,
            _ => GfwError::Api { code, message },
        }
    }
}

// ============================================================
// 前端通信类型
// ============================================================

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "type")]
pub enum FrontendMessage {
    // 连接
    Connected {
        hermes_version: String,
        gfw_base: String,
        timestamp: String,
    },
    // 流式响应
    StreamChunk {
        id: String,
        content: String,
        timestamp: String,
    },
    // 工具调用
    ToolCallStart {
        id: String,
        tool: String,
        tool_input: serde_json::Value,
        timestamp: String,
    },
    ToolCallResult {
        id: String,
        tool: String,
        status: String,
        output: String,
        timestamp: String,
    },
    // 完成
    ChatComplete {
        id: String,
        final_response: String,
        token_usage: serde_json::Value,
        model: String,
        duration_ms: u64,
        timestamp: String,
    },
    // 取消
    Cancelled {
        id: String,
        timestamp: String,
    },
    // 错误
    Error {
        #[serde(skip_serializing_if = "Option::is_none")]
        id: Option<String>,
        error_code: String,
        message: String,
        recoverable: bool,
        timestamp: String,
    },
    // 心跳
    Pong {
        timestamp: String,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "type")]
pub enum BackendMessage {
    Chat {
        id: String,
        content: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        session_id: Option<String>,
        #[serde(skip_serializing_if = "Option::is_none")]
        model: Option<String>,
        #[serde(default)]
        attachments: Vec<serde_json::Value>,
    },
    ConfigUpdate {
        #[serde(skip_serializing_if = "Option::is_none")]
        gfw: Option<GfwConfigUpdate>,
        #[serde(skip_serializing_if = "Option::is_none")]
        gfw_jwt: Option<String>,
    },
    Cancel {
        id: String,
    },
    Ping,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct GfwConfigUpdate {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub base_url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub api_key: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub default_model: Option<String>,
}
