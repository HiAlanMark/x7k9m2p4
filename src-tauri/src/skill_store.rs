use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::RwLock;

const BASE_URL: &str = "https://api.2x.com.cn/api/v1";

pub struct SkillStoreClient {
    http: Client,
    base_url: String,
    token: Arc<RwLock<Option<String>>>,
}

impl SkillStoreClient {
    pub fn new(base_url: Option<String>) -> Self {
        Self {
            http: Client::builder()
                .timeout(std::time::Duration::from_secs(30))
                .build()
                .expect("http client"),
            base_url: base_url.unwrap_or_else(|| BASE_URL.to_string()),
            token: Arc::new(RwLock::new(None)),
        }
    }

    async fn auth(&self) -> Option<String> {
        self.token.read().await.as_ref().map(|t| format!("Bearer {}", t))
    }

    pub async fn email_login(&self, email: &str, password: &str, _captcha_id: Option<&str>, _captcha_code: Option<&str>) -> Result<TwoXLoginResponse, SkillStoreError> {
        #[derive(Serialize)]
        struct Req<'a> { email: &'a str, password: &'a str }
        let r = self.http.post(format!("{}/auth/email/login", self.base_url)).json(&Req { email, password }).send().await?;
        let body: TwoXApiResponse<TwoXLoginData> = r.json().await?;
        let d = body.data.ok_or(SkillStoreError::Api(body.message))?;
        *self.token.write().await = Some(d.token.clone());
        Ok(TwoXLoginResponse { token: d.token, expires_in: d.expires_in, user: d.user })
    }

    pub async fn get_popular_skills(&self, limit: u32) -> Result<Vec<TwoXSkill>, SkillStoreError> {
        let r = self.http.get(format!("{}/skills/popular?limit={}", self.base_url, limit)).send().await?;
        let body: TwoXApiResponse<Vec<TwoXSkill>> = r.json().await?;
        Ok(body.data.unwrap_or_default())
    }

    pub async fn get_skills(&self, q: Option<&str>, category: Option<&str>, _tags: Option<&str>, sort: Option<&str>, limit: u32, offset: u32) -> Result<Vec<TwoXSkill>, SkillStoreError> {
        let mut url = format!("{}/skills/latest?limit={}&offset={}", self.base_url, limit, offset);
        if let Some(q) = q { url.push_str(&format!("&q={}", urlencoding::encode(q))); }
        if let Some(c) = category { url.push_str(&format!("&category={}", urlencoding::encode(c))); }
        if let Some(s) = sort { url.push_str(&format!("&sort={}", s)); }
        let r = self.http.get(&url).send().await?;
        let body: TwoXApiResponse<Vec<TwoXSkill>> = r.json().await?;
        Ok(body.data.unwrap_or_default())
    }

    pub async fn search_skills(&self, q: &str) -> Result<Vec<TwoXSkill>, SkillStoreError> {
        let r = self.http.get(format!("{}/skills/latest?q={}&limit=50", self.base_url, urlencoding::encode(q))).send().await?;
        let body: TwoXApiResponse<Vec<TwoXSkill>> = r.json().await?;
        Ok(body.data.unwrap_or_default())
    }

    pub async fn get_skill_detail(&self, id_or_slug: &str) -> Result<TwoXSkillDetail, SkillStoreError> {
        let r = self.http.get(format!("{}/skills/{}", self.base_url, id_or_slug)).send().await?;
        let body: TwoXApiResponse<TwoXSkillDetail> = r.json().await?;
        body.data.ok_or(SkillStoreError::Api("not found".into()))
    }

    pub async fn get_rankings(&self, ranking_type: &str) -> Result<Vec<TwoXRanking>, SkillStoreError> {
        let r = self.http.get(format!("{}/rankings/{}", self.base_url, ranking_type)).send().await?;
        let body: TwoXRankingsResponse = r.json().await?;
        Ok(body.skills)
    }

    pub async fn get_workflows(&self, page: u32, limit: u32, category: Option<&str>, _tag: Option<&str>, q: Option<&str>, sort: Option<&str>) -> Result<Vec<TwoXWorkflow>, SkillStoreError> {
        let mut url = format!("{}/workflow-market?page={}&limit={}", self.base_url, page, limit);
        if let Some(c) = category { url.push_str(&format!("&category={}", urlencoding::encode(c))); }
        if let Some(q) = q { url.push_str(&format!("&q={}", urlencoding::encode(q))); }
        if let Some(s) = sort { url.push_str(&format!("&sort={}", s)); }
        let r = self.http.get(&url).send().await?;
        let body: TwoXApiResponse<Vec<TwoXWorkflow>> = r.json().await?;
        Ok(body.data.unwrap_or_default())
    }
}

// ============================================================
// Types
// ============================================================

#[derive(Deserialize)]
pub struct TwoXApiResponse<T> {
    #[serde(default)]
    pub code: u32,
    #[serde(default)]
    pub message: String,
    pub data: Option<T>,
}

#[derive(Deserialize)]
pub struct TwoXLoginData {
    pub token: String,
    #[serde(default)]
    pub expires_in: u64,
    pub user: TwoXUser,
}

#[derive(Deserialize, Clone, Debug, Serialize)]
pub struct TwoXUser {
    pub id: u64,
    #[serde(default)]
    pub username: String,
    pub phone: Option<String>,
}

pub struct TwoXLoginResponse {
    pub token: String,
    pub expires_in: u64,
    pub user: TwoXUser,
}

#[derive(Deserialize, Clone, Debug, Serialize)]
pub struct TwoXSkill {
    pub id: u64,
    #[serde(default)]
    pub slug: String,
    #[serde(default)]
    pub name: String,
    #[serde(default)]
    pub summary: String,
    #[serde(default)]
    pub description: String,
    #[serde(default)]
    pub category: String,
    #[serde(default)]
    pub tags: Vec<String>,
    #[serde(default)]
    pub current_version: String,
    #[serde(default)]
    pub total_downloads: u64,
    #[serde(default)]
    pub total_favorites: u64,
    #[serde(default)]
    pub average_rating: f64,
    #[serde(default)]
    pub total_reviews: u64,
}

#[derive(Deserialize, Clone, Debug, Serialize)]
pub struct TwoXSkillDetail {
    pub id: u64,
    #[serde(default)]
    pub slug: String,
    #[serde(default)]
    pub name: String,
    #[serde(default)]
    pub summary: String,
    #[serde(default)]
    pub description: String,
    #[serde(default)]
    pub long_description: String,
    #[serde(default)]
    pub category: String,
    #[serde(default)]
    pub tags: Vec<String>,
    #[serde(default)]
    pub current_version: String,
    #[serde(default)]
    pub total_downloads: u64,
    #[serde(default)]
    pub average_rating: f64,
}

#[derive(Deserialize, Clone, Debug, Serialize)]
pub struct TwoXRanking {
    #[serde(default)]
    pub rank: u32,
    #[serde(default)]
    pub skill_id: u64,
    #[serde(default)]
    pub slug: String,
    #[serde(default)]
    pub name: String,
    #[serde(default)]
    pub score: f64,
}

#[derive(Deserialize)]
pub struct TwoXRankingsResponse {
    #[serde(default)]
    pub skills: Vec<TwoXRanking>,
}

#[derive(Deserialize, Clone, Debug, Serialize)]
pub struct TwoXWorkflow {
    pub id: u64,
    #[serde(default)]
    pub name: String,
    #[serde(default)]
    pub slug: String,
    #[serde(default)]
    pub summary: String,
    #[serde(default)]
    pub category: String,
    #[serde(default)]
    pub tags: Vec<String>,
    #[serde(default)]
    pub downloads: u64,
    #[serde(default)]
    pub stars: u64,
}

// ============================================================
// Error
// ============================================================

#[derive(Debug)]
pub enum SkillStoreError {
    Network(reqwest::Error),
    Api(String),
}

impl std::fmt::Display for SkillStoreError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            SkillStoreError::Network(e) => write!(f, "{}", e),
            SkillStoreError::Api(s) => write!(f, "{}", s),
        }
    }
}

impl From<reqwest::Error> for SkillStoreError {
    fn from(e: reqwest::Error) -> Self { SkillStoreError::Network(e) }
}
