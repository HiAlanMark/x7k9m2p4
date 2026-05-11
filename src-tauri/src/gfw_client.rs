use std::sync::Arc;
use reqwest::Client;
use tokio::sync::RwLock;
use crate::gfw_types::*;

const BASE: &str = "https://api.gfw.net/api/v1";

pub struct GfwClient {
    http: Client,
    jwt: Arc<RwLock<Option<String>>>,
    rt: Arc<RwLock<Option<String>>>,
}

impl GfwClient {
    pub fn new() -> Self {
        Self {
            http: Client::builder().timeout(std::time::Duration::from_secs(30)).build().expect("http"),
            jwt: Arc::new(RwLock::new(None)),
            rt: Arc::new(RwLock::new(None)),
        }
    }

    async fn jwt(&self) -> Result<String, GfwError> {
        self.jwt.read().await.clone().ok_or(GfwError::NotLoggedIn)
    }

    pub async fn login(&self, email: &str, password: &str) -> Result<LoginResponse, GfwError> {
        let r = self.http.post(format!("{}/auth/login", BASE))
            .json(&LoginRequest { email, password }).send().await?;
        let body: GfwApiResponse<LoginResponse> = r.json().await?;
        let d = body.data.ok_or_else(|| GfwError::from_api_response(body.code, body.message))?;
        *self.jwt.write().await = Some(d.token.clone());
        *self.rt.write().await = Some(d.refresh_token.clone());
        Ok(d)
    }

    pub async fn refresh(&self) -> Result<LoginResponse, GfwError> {
        let rt = self.rt.read().await.clone().ok_or(GfwError::NoRefreshToken)?;
        let r = self.http.post(format!("{}/auth/refresh", BASE))
            .json(&RefreshTokenRequest { refresh_token: &rt }).send().await?;
        let body: GfwApiResponse<LoginResponse> = r.json().await?;
        let d = body.data.ok_or_else(|| GfwError::from_api_response(body.code, body.message))?;
        *self.jwt.write().await = Some(d.token.clone());
        *self.rt.write().await = Some(d.refresh_token.clone());
        Ok(d)
    }

    pub async fn get_user_info(&self) -> Result<UserDetail, GfwError> {
        let jwt = self.jwt().await?;
        let r = self.http.get(format!("{}/user", BASE))
            .header("Authorization", format!("Bearer {}", jwt)).send().await?;
        let body: GfwApiResponse<UserDetail> = r.json().await?;
        body.data.ok_or_else(|| GfwError::from_api_response(body.code, body.message))
    }

    pub async fn get_balance(&self) -> Result<f64, GfwError> {
        let jwt = self.jwt().await?;
        let r = self.http.get(format!("{}/gcoin/balance", BASE))
            .header("Authorization", format!("Bearer {}", jwt)).send().await?;
        let body: GfwApiResponse<BalanceResponse> = r.json().await?;
        Ok(body.data.ok_or_else(|| GfwError::from_api_response(body.code, body.message))?.balance)
    }

    pub async fn list_models_full(&self) -> Result<Vec<ModelFull>, GfwError> {
        let r = self.http.get(format!("{}/models", BASE)).send().await?;
        let body: GfwApiResponse<ModelsResponse> = r.json().await?;
        Ok(body.data.ok_or_else(|| GfwError::from_api_response(body.code, body.message))?.models)
    }

    pub async fn list_api_keys(&self) -> Result<Vec<ApiKeyInfo>, GfwError> {
        let jwt = self.jwt().await?;
        let r = self.http.get(format!("{}/api-keys", BASE))
            .header("Authorization", format!("Bearer {}", jwt)).send().await?;
        let body: GfwApiResponse<ApiKeyListResponse> = r.json().await?;
        Ok(body.data.ok_or_else(|| GfwError::from_api_response(body.code, body.message))?.keys)
    }

    pub async fn create_and_retrieve_key(&self, req: CreateApiKeyRequest) -> Result<FullApiKey, GfwError> {
        let jwt = self.jwt().await?;
        let r = self.http.post(format!("{}/api-keys", BASE))
            .header("Authorization", format!("Bearer {}", jwt)).json(&req).send().await?;
        let body: GfwApiResponse<CreateApiKeyResponse> = r.json().await?;
        let obj = body.data.ok_or_else(|| GfwError::from_api_response(body.code, body.message))?.key;

        let r2 = self.http.get(format!("{}/api-keys/{}/full", BASE, obj.id))
            .header("Authorization", format!("Bearer {}", jwt)).send().await?;
        let body2: GfwApiResponse<FullKeyResponse> = r2.json().await?;
        let key = body2.data.ok_or_else(|| GfwError::from_api_response(body2.code, body2.message))?.key;

        Ok(FullApiKey { id: obj.id, key, name: obj.name, gcoin_limit: obj.gcoin_limit, rate_limit: obj.rate_limit })
    }

    pub async fn get_full_key(&self, key_id: u64) -> Result<String, GfwError> {
        let jwt = self.jwt().await?;
        let r = self.http.get(format!("{}/api-keys/{}/full", BASE, key_id))
            .header("Authorization", format!("Bearer {}", jwt)).send().await?;
        let body: GfwApiResponse<FullKeyResponse> = r.json().await?;
        Ok(body.data.ok_or_else(|| GfwError::from_api_response(body.code, body.message))?.key)
    }

    pub async fn get_daily_usage(&self, days: u32) -> Result<Vec<DailyUsage>, GfwError> {
        let jwt = self.jwt().await?;
        let r = self.http.get(format!("{}/usage/daily?days={}", BASE, days))
            .header("Authorization", format!("Bearer {}", jwt)).send().await?;
        let body: GfwApiResponse<DailyUsageResponse> = r.json().await?;
        Ok(body.data.ok_or_else(|| GfwError::from_api_response(body.code, body.message))?.daily_usage)
    }

    pub async fn get_recharge_packages(&self) -> Result<Vec<RechargePackage>, GfwError> {
        let r = self.http.get(format!("{}/recharge/packages", BASE)).send().await?;
        let body: GfwApiResponse<RechargePackagesResponse> = r.json().await?;
        Ok(body.data.ok_or_else(|| GfwError::from_api_response(body.code, body.message))?.packages)
    }

    pub async fn create_recharge_order(&self, package_id: u64, pay_method: &str) -> Result<RechargeOrder, GfwError> {
        let jwt = self.jwt().await?;
        let r = self.http.post(format!("{}/recharge/create", BASE))
            .header("Authorization", format!("Bearer {}", jwt))
            .json(&CreateRechargeOrderRequest { package_id, pay_method: pay_method.to_string() })
            .send().await?;
        let body: GfwApiResponse<RechargeOrder> = r.json().await?;
        body.data.ok_or_else(|| GfwError::from_api_response(body.code, body.message))
    }

    pub async fn list_sr_providers(&self) -> Result<Vec<SrProvider>, GfwError> {
        let r = self.http.get(format!("{}/sr/public/providers", BASE)).send().await?;
        let body: GfwApiResponse<SrProvidersResponse> = r.json().await?;
        Ok(body.data.ok_or_else(|| GfwError::from_api_response(body.code, body.message))?.providers)
    }
}
