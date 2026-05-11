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
}

// ============================================================
// 认证
// ============================================================

#[derive(Serialize)]
pub struct LoginRequest<'a> {
    pub email: &'a str,
    pub password: &'a str,
}

#[derive(Deserialize, Clone)]
pub struct LoginResponse {
    pub token: String,
    pub refresh_token: String,
    pub user: UserProfile,
}

#[derive(Deserialize, Clone, Debug, Serialize)]
pub struct UserProfile {
    pub id: u64,
    #[serde(default)]
    pub uuid: String,
    pub email: String,
    #[serde(default)]
    pub nickname: String,
    #[serde(default)]
    pub gcoin_balance: f64,
    #[serde(default)]
    pub gcoin_frozen: f64,
    #[serde(default)]
    pub total_recharge: f64,
    #[serde(default)]
    pub total_consumed: f64,
    #[serde(default)]
    pub status: u32,
    #[serde(default)]
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

#[derive(Deserialize, Clone)]
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

#[derive(Deserialize, Clone, Debug, Serialize)]
pub struct ApiKeyInfo {
    pub id: u64,
    #[serde(default)]
    pub user_id: u64,
    pub key_prefix: String,
    #[serde(default)]
    pub can_retrieve: bool,
    pub name: String,
    #[serde(default)]
    pub rate_limit: u32,
    #[serde(default)]
    pub gcoin_limit: f64,
    #[serde(default)]
    pub used_quota: f64,
    #[serde(default)]
    pub cycle_type: String,
    pub cycle_reset_at: Option<String>,
    pub last_used_at: Option<String>,
    #[serde(default)]
    pub is_active: bool,
    #[serde(default)]
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
    #[serde(default)]
    pub key_prefix: String,
    #[serde(default)]
    pub can_retrieve: bool,
    pub name: String,
    #[serde(default)]
    pub gcoin_limit: f64,
    #[serde(default)]
    pub rate_limit: u32,
    #[serde(default)]
    pub created_at: String,
}

#[derive(Deserialize)]
pub struct FullKeyResponse {
    pub key: String,
}

pub struct FullApiKey {
    pub id: u64,
    pub key: String,
    pub name: String,
    pub gcoin_limit: f64,
    pub rate_limit: u32,
}

// ============================================================
// 模型
// ============================================================

#[derive(Deserialize)]
pub struct ModelsResponse {
    pub models: Vec<ModelFull>,
}

#[derive(Deserialize, Clone, Debug, Serialize)]
pub struct ModelFull {
    #[serde(alias = "model_code")]
    pub id: String,
    #[serde(alias = "model_name", default)]
    pub name: String,
    #[serde(alias = "model_name_en", default)]
    pub name_en: String,
    #[serde(default)]
    pub provider: String,
    #[serde(alias = "model_type", default)]
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
    #[serde(default)]
    pub is_available: bool,
    #[serde(default)]
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
    pub pricing_rules: Option<serde_json::Value>,
    #[serde(default)]
    pub discount: Option<f64>,
}

// ============================================================
// 用量统计
// ============================================================

#[derive(Deserialize)]
pub struct DailyUsageResponse {
    pub daily_usage: Vec<DailyUsage>,
}

#[derive(Deserialize, Clone, Debug, Serialize)]
pub struct DailyUsage {
    pub date: String,
    #[serde(default)]
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

#[derive(Deserialize, Clone, Debug, Serialize)]
pub struct MonthlyUsage {
    pub month: String,
    #[serde(default)]
    pub request_count: u64,
    #[serde(default)]
    pub input_tokens: u64,
    #[serde(default)]
    pub output_tokens: u64,
    #[serde(default)]
    pub total_cost: f64,
}

// ============================================================
// 充值
// ============================================================

#[derive(Deserialize)]
pub struct RechargePackagesResponse {
    pub packages: Vec<RechargePackage>,
}

#[derive(Deserialize, Clone, Debug, Serialize)]
pub struct RechargePackage {
    pub id: u64,
    pub name: String,
    #[serde(default)]
    pub description: String,
    pub price: f64,
    pub gcoin_amount: f64,
    #[serde(default)]
    pub bonus_gcoin: f64,
    #[serde(default)]
    pub discount_rate: f64,
    #[serde(default)]
    pub is_active: bool,
    #[serde(default)]
    pub purchase_limit: u32,
    #[serde(default)]
    pub upgrade_group: String,
    #[serde(default)]
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

#[derive(Deserialize, Clone, Debug, Serialize)]
pub struct RechargeOrder {
    pub id: String,
    #[serde(default)]
    pub package_id: u64,
    #[serde(default)]
    pub amount: f64,
    #[serde(default)]
    pub pay_method: String,
    #[serde(default)]
    pub status: String,
    pub pay_url: Option<String>,
    #[serde(default)]
    pub created_at: String,
}

// ============================================================
// 超级路由
// ============================================================

#[derive(Deserialize)]
pub struct SrProvidersResponse {
    pub providers: Vec<SrProvider>,
}

#[derive(Deserialize, Clone, Debug, Serialize)]
pub struct SrProvider {
    pub id: u64,
    pub code: String,
    pub name: String,
    #[serde(alias = "model_type", default)]
    pub model_type: String,
    #[serde(default)]
    pub base_url: String,
    #[serde(default)]
    pub auth_header: String,
    #[serde(default)]
    pub auth_prefix: String,
    #[serde(default)]
    pub is_active: bool,
}

// ============================================================
// 错误
// ============================================================

#[derive(Debug)]
pub enum GfwError {
    Network(reqwest::Error),
    Api { code: u32, message: String },
    NotLoggedIn,
    NoRefreshToken,
}

impl std::fmt::Display for GfwError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            GfwError::Network(e) => write!(f, "网络错误: {}", e),
            GfwError::Api { code, message } => write!(f, "API 错误({}): {}", code, message),
            GfwError::NotLoggedIn => write!(f, "未登录"),
            GfwError::NoRefreshToken => write!(f, "无刷新 Token"),
        }
    }
}

impl From<reqwest::Error> for GfwError {
    fn from(e: reqwest::Error) -> Self {
        GfwError::Network(e)
    }
}

impl GfwError {
    pub fn from_api_response(code: u32, message: String) -> Self {
        GfwError::Api { code, message }
    }
}

// ============================================================
// WebSocket 通信类型
// ============================================================

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "type")]
pub enum BackendMessage {
    #[serde(rename = "chat")]
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
    #[serde(rename = "config_update")]
    ConfigUpdate {
        #[serde(skip_serializing_if = "Option::is_none")]
        gfw: Option<GfwConfigUpdate>,
        #[serde(skip_serializing_if = "Option::is_none")]
        gfw_jwt: Option<String>,
    },
    #[serde(rename = "cancel")]
    Cancel {
        id: String,
    },
    #[serde(rename = "ping")]
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
