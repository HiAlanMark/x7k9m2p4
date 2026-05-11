use std::sync::Arc;
use reqwest::Client;
use tokio::sync::RwLock;
use crate::gfw_types::*;

const BASE_URL: &str = "https://api.gfw.net/api/v1";
const AI_BASE_URL: &str = "https://api.gfw.net/v1";

pub struct GfwClient {
    http: Client,
    jwt: Arc<RwLock<Option<String>>>,
    refresh_token: Arc<RwLock<Option<String>>>,
}

impl GfwClient {
    pub fn new() -> Self {
        Self {
            http: Client::builder()
                .timeout(std::time::Duration::from_secs(30))
                .build()
                .expect("Failed to create HTTP client"),
            jwt: Arc::new(RwLock::new(None)),
            refresh_token: Arc::new(RwLock::new(None)),
        }
    }

    pub fn base_url() -> &'static str {
        BASE_URL
    }

    pub fn ai_base_url() -> &'static str {
        AI_BASE_URL
    }

    // ============================================================
    // 认证
    // ============================================================

    pub async fn login(&self, email: &str, password: &str) -> Result<LoginResponse, GfwError> {
        let resp = self.http
            .post(format!("{}/auth/login", BASE_URL))
            .json(&LoginRequest { email, password })
            .send()
            .await?;

        let body: GfwApiResponse<LoginResponse> = resp.json().await?;
        let data = body.data.ok_or_else(|| {
            GfwError::from_api_response(body.code, body.message)
        })?;

        *self.jwt.write().await = Some(data.token.clone());
        *self.refresh_token.write().await = Some(data.refresh_token.clone());

        Ok(data)
    }

    pub async fn refresh(&self) -> Result<LoginResponse, GfwError> {
        let rt = self.refresh_token.read().await;
        let refresh_token = rt.as_ref()
            .ok_or(GfwError::NoRefreshToken)?
            .clone();
        drop(rt);

        let resp = self.http
            .post(format!("{}/auth/refresh", BASE_URL))
            .json(&RefreshTokenRequest { refresh_token: &refresh_token })
            .send()
            .await?;

        let body: GfwApiResponse<LoginResponse> = resp.json().await?;
        let data = body.data.ok_or_else(|| {
            GfwError::from_api_response(body.code, body.message)
        })?;

        *self.jwt.write().await = Some(data.token.clone());
        *self.refresh_token.write().await = Some(data.refresh_token.clone());

        Ok(data)
    }

    pub async fn set_jwt(&self, token: String, refresh_token: String) {
        *self.jwt.write().await = Some(token);
        *self.refresh_token.write().await = Some(refresh_token);
    }

    pub async fn get_jwt(&self) -> Option<String> {
        self.jwt.read().await.clone()
    }

    // ============================================================
    // 用户
    // ============================================================

    pub async fn get_user_info(&self) -> Result<UserDetail, GfwError> {
        let jwt = self.get_jwt().await.ok_or(GfwError::NotLoggedIn)?;

        let resp = self.http
            .get(format!("{}/user", BASE_URL))
            .header("Authorization", format!("Bearer {}", jwt))
            .send()
            .await?;

        let body: GfwApiResponse<UserDetail> = resp.json().await?;
        body.data.ok_or_else(|| {
            GfwError::from_api_response(body.code, body.message)
        })
    }

    // ============================================================
    // 余额
    // ============================================================

    pub async fn get_balance(&self) -> Result<f64, GfwError> {
        let jwt = self.get_jwt().await.ok_or(GfwError::NotLoggedIn)?;

        let resp = self.http
            .get(format!("{}/gcoin/balance", BASE_URL))
            .header("Authorization", format!("Bearer {}", jwt))
            .send()
            .await?;

        let body: GfwApiResponse<BalanceResponse> = resp.json().await?;
        let data = body.data.ok_or_else(|| {
            GfwError::from_api_response(body.code, body.message)
        })?;

        Ok(data.balance)
    }

    // ============================================================
    // 模型列表 (管理 API - 完整信息)
    // ============================================================

    pub async fn list_models_full(&self) -> Result<Vec<ModelFull>, GfwError> {
        let resp = self.http
            .get(format!("{}/models", BASE_URL))
            .send()
            .await?;

        let body: GfwApiResponse<ModelsResponse> = resp.json().await?;
        let data = body.data.ok_or_else(|| {
            GfwError::from_api_response(body.code, body.message)
        })?;

        Ok(data.models)
    }

    // ============================================================
    // API Key 管理
    // ============================================================

    pub async fn list_api_keys(&self) -> Result<Vec<ApiKeyInfo>, GfwError> {
        let jwt = self.get_jwt().await.ok_or(GfwError::NotLoggedIn)?;

        let resp = self.http
            .get(format!("{}/api-keys", BASE_URL))
            .header("Authorization", format!("Bearer {}", jwt))
            .send()
            .await?;

        let body: GfwApiResponse<ApiKeyListResponse> = resp.json().await?;
        let data = body.data.ok_or_else(|| {
            GfwError::from_api_response(body.code, body.message)
        })?;

        Ok(data.keys)
    }

    pub async fn create_and_retrieve_key(&self, req: CreateApiKeyRequest) -> Result<FullApiKey, GfwError> {
        let jwt = self.get_jwt().await.ok_or(GfwError::NotLoggedIn)?;

        // 1. 创建 Key
        let resp = self.http
            .post(format!("{}/api-keys", BASE_URL))
            .header("Authorization", format!("Bearer {}", jwt))
            .json(&req)
            .send()
            .await?;

        let body: GfwApiResponse<CreateApiKeyResponse> = resp.json().await?;
        let key_obj = body.data.ok_or_else(|| {
            GfwError::from_api_response(body.code, body.message)
        })?.key;

        let key_id = key_obj.id;
        let name = key_obj.name.clone();
        let gcoin_limit = key_obj.gcoin_limit;
        let rate_limit = key_obj.rate_limit;

        // 2. 获取完整 Key
        let full_resp = self.http
            .get(format!("{}/api-keys/{}/full", BASE_URL, key_id))
            .header("Authorization", format!("Bearer {}", jwt))
            .send()
            .await?;

        let full_body: GfwApiResponse<FullKeyResponse> = full_resp.json().await?;
        let full_key = full_body.data.ok_or_else(|| {
            GfwError::from_api_response(full_body.code, full_body.message)
        })?.key;

        Ok(FullApiKey {
            id: key_id,
            key: full_key,
            name,
            gcoin_limit,
            rate_limit,
        })
    }

    pub async fn get_full_key(&self, key_id: u64) -> Result<String, GfwError> {
        let jwt = self.get_jwt().await.ok_or(GfwError::NotLoggedIn)?;

        let resp = self.http
            .get(format!("{}/api-keys/{}/full", BASE_URL, key_id))
            .header("Authorization", format!("Bearer {}", jwt))
            .send()
            .await?;

        let body: GfwApiResponse<FullKeyResponse> = resp.json().await?;
        let data = body.data.ok_or_else(|| {
            GfwError::from_api_response(body.code, body.message)
        })?;

        Ok(data.key)
    }

    // ============================================================
    // 用量统计
    // ============================================================

    pub async fn get_daily_usage(&self, days: u32) -> Result<Vec<DailyUsage>, GfwError> {
        let jwt = self.get_jwt().await.ok_or(GfwError::NotLoggedIn)?;

        let resp = self.http
            .get(format!("{}/usage/daily?days={}", BASE_URL, days))
            .header("Authorization", format!("Bearer {}", jwt))
            .send()
            .await?;

        let body: GfwApiResponse<DailyUsageResponse> = resp.json().await?;
        let data = body.data.ok_or_else(|| {
            GfwError::from_api_response(body.code, body.message)
        })?;

        Ok(data.daily_usage)
    }

    pub async fn get_monthly_usage(&self, months: u32) -> Result<Vec<MonthlyUsage>, GfwError> {
        let jwt = self.get_jwt().await.ok_or(GfwError::NotLoggedIn)?;

        let resp = self.http
            .get(format!("{}/usage/monthly?months={}", BASE_URL, months))
            .header("Authorization", format!("Bearer {}", jwt))
            .send()
            .await?;

        let body: GfwApiResponse<MonthlyUsageResponse> = resp.json().await?;
        let data = body.data.ok_or_else(|| {
            GfwError::from_api_response(body.code, body.message)
        })?;

        Ok(data.monthly_usage)
    }

    // ============================================================
    // 充值
    // ============================================================

    pub async fn get_recharge_packages(&self) -> Result<Vec<RechargePackage>, GfwError> {
        let resp = self.http
            .get(format!("{}/recharge/packages", BASE_URL))
            .send()
            .await?;

        let body: GfwApiResponse<RechargePackagesResponse> = resp.json().await?;
        let data = body.data.ok_or_else(|| {
            GfwError::from_api_response(body.code, body.message)
        })?;

        Ok(data.packages)
    }

    pub async fn create_recharge_order(
        &self,
        package_id: u64,
        pay_method: &str,
    ) -> Result<RechargeOrder, GfwError> {
        let jwt = self.get_jwt().await.ok_or(GfwError::NotLoggedIn)?;

        let resp = self.http
            .post(format!("{}/recharge/create", BASE_URL))
            .header("Authorization", format!("Bearer {}", jwt))
            .json(&CreateRechargeOrderRequest {
                package_id,
                pay_method: pay_method.to_string(),
            })
            .send()
            .await?;

        let body: GfwApiResponse<RechargeOrderResponse> = resp.json().await?;
        let data = body.data.ok_or_else(|| {
            GfwError::from_api_response(body.code, body.message)
        })?;

        Ok(data.order)
    }

    // ============================================================
    // 超级路由
    // ============================================================

    pub async fn list_sr_providers(&self) -> Result<Vec<SrProvider>, GfwError> {
        let resp = self.http
            .get(format!("{}/sr/public/providers", BASE_URL))
            .send()
            .await?;

        let body: GfwApiResponse<SrProvidersResponse> = resp.json().await?;
        let data = body.data.ok_or_else(|| {
            GfwError::from_api_response(body.code, body.message)
        })?;

        Ok(data.providers)
    }
}
