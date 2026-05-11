use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::RwLock;

const BASE_URL: &str = "https://api.2x.com.cn/api/v1";

pub struct SkillStoreClient {
    http: Client,
    base_url: String,
    access_token: Arc<RwLock<Option<String>>>,
}

impl SkillStoreClient {
    pub fn new(base_url: Option<String>) -> Self {
        Self {
            http: Client::builder()
                .timeout(std::time::Duration::from_secs(30))
                .build()
                .expect("Failed to create HTTP client"),
            base_url: base_url.unwrap_or_else(|| BASE_URL.to_string()),
            access_token: Arc::new(RwLock::new(None)),
        }
    }

    pub async fn set_token(&self, token: String) {
        *self.access_token.write().await = Some(token);
    }

    async fn auth_header(&self) -> Option<String> {
        self.access_token.read().await.as_ref()
            .map(|t| format!("Bearer {}", t))
    }

    fn check_auth(&self) -> Result<(), SkillStoreError> {
        if self.access_token.try_read().map(|t| t.is_some()).unwrap_or(false) {
            Ok(())
        } else {
            Err(SkillStoreError::NotLoggedIn)
        }
    }

    // ============================================================
    // 认证 (基于 2x.com.cn 真实 API)
    // ============================================================

    /// 发送邮箱验证码
    pub async fn send_email_code(&self, email: &str) -> Result<(), SkillStoreError> {
        #[derive(Serialize)]
        struct Req<'a> { email: &'a str }

        let resp = self.http
            .post(format!("{}/auth/email/send-code", self.base_url))
            .json(&Req { email })
            .send()
            .await?;

        let body: TwoXApiResponse<serde_json::Value> = resp.json().await?;
        if body.code != 0 {
            return Err(SkillStoreError::Api(body.message));
        }
        Ok(())
    }

    /// 邮箱登录
    pub async fn email_login(
        &self,
        email: &str,
        password: &str,
        captcha_id: Option<&str>,
        captcha_code: Option<&str>,
    ) -> Result<TwoXLoginResponse, SkillStoreError> {
        #[derive(Serialize)]
        struct Req<'a> {
            email: &'a str,
            password: &'a str,
            #[serde(skip_serializing_if = "Option::is_none")]
            captcha_id: Option<&'a str>,
            #[serde(skip_serializing_if = "Option::is_none")]
            captcha_code: Option<&'a str>,
        }

        let resp = self.http
            .post(format!("{}/auth/email/login", self.base_url))
            .json(&Req {
                email,
                password,
                captcha_id,
                captcha_code,
            })
            .send()
            .await?;

        let body: TwoXApiResponse<TwoXLoginData> = resp.json().await?;
        if body.code != 0 {
            return Err(SkillStoreError::Api(body.message));
        }

        let data = body.data.ok_or(SkillStoreError::Api("登录响应无数据".into()))?;
        *self.access_token.write().await = Some(data.token.clone());

        Ok(TwoXLoginResponse {
            token: data.token,
            expires_in: data.expires_in,
            user: data.user,
        })
    }

    /// 手机号登录
    pub async fn phone_login(
        &self,
        phone: &str,
        password: &str,
        captcha_id: Option<&str>,
        captcha_code: Option<&str>,
    ) -> Result<TwoXLoginResponse, SkillStoreError> {
        #[derive(Serialize)]
        struct Req<'a> {
            phone: &'a str,
            password: &'a str,
            #[serde(skip_serializing_if = "Option::is_none")]
            captcha_id: Option<&'a str>,
            #[serde(skip_serializing_if = "Option::is_none")]
            captcha_code: Option<&'a str>,
        }

        let resp = self.http
            .post(format!("{}/auth/login", self.base_url))
            .json(&Req {
                phone,
                password,
                captcha_id,
                captcha_code,
            })
            .send()
            .await?;

        let body: TwoXApiResponse<TwoXLoginData> = resp.json().await?;
        if body.code != 0 {
            return Err(SkillStoreError::Api(body.message));
        }

        let data = body.data.ok_or(SkillStoreError::Api("登录响应无数据".into()))?;
        *self.access_token.write().await = Some(data.token.clone());

        Ok(TwoXLoginResponse {
            token: data.token,
            expires_in: data.expires_in,
            user: data.user,
        })
    }

    /// 邮箱注册
    pub async fn email_register(
        &self,
        email: &str,
        code: &str,
        password: &str,
        confirm_password: &str,
        username: &str,
    ) -> Result<(), SkillStoreError> {
        #[derive(Serialize)]
        struct Req<'a> {
            email: &'a str,
            code: &'a str,
            password: &'a str,
            confirm_password: &'a str,
            username: &'a str,
        }

        let resp = self.http
            .post(format!("{}/auth/email/register", self.base_url))
            .json(&Req {
                email,
                code,
                password,
                confirm_password,
                username,
            })
            .send()
            .await?;

        let body: TwoXApiResponse<serde_json::Value> = resp.json().await?;
        if body.code != 0 {
            return Err(SkillStoreError::Api(body.message));
        }
        Ok(())
    }

    // ============================================================
    // 用户模块
    // ============================================================

    pub async fn get_profile(&self) -> Result<TwoXUserProfile, SkillStoreError> {
        self.check_auth()?;
        let auth = self.auth_header().await.unwrap();

        let resp = self.http
            .get(format!("{}/users/profile", self.base_url))
            .header("Authorization", &auth)
            .send()
            .await?;

        let body: TwoXApiResponse<TwoXUserProfile> = resp.json().await?;
        body.data.ok_or(SkillStoreError::Api("无用户数据".into()))
    }

    pub async fn get_my_skills(&self) -> Result<Vec<TwoXSkill>, SkillStoreError> {
        self.check_auth()?;
        let auth = self.auth_header().await.unwrap();

        let resp = self.http
            .get(format!("{}/users/my-skills", self.base_url))
            .header("Authorization", &auth)
            .send()
            .await?;

        let body: TwoXApiResponse<Vec<TwoXSkill>> = resp.json().await?;
        Ok(body.data.unwrap_or_default())
    }

    pub async fn get_downloads(&self) -> Result<Vec<TwoXDownload>, SkillStoreError> {
        self.check_auth()?;
        let auth = self.auth_header().await.unwrap();

        let resp = self.http
            .get(format!("{}/users/downloads", self.base_url))
            .header("Authorization", &auth)
            .send()
            .await?;

        let body: TwoXApiResponse<Vec<TwoXDownload>> = resp.json().await?;
        Ok(body.data.unwrap_or_default())
    }

    pub async fn get_favorites(&self) -> Result<Vec<TwoXSkill>, SkillStoreError> {
        self.check_auth()?;
        let auth = self.auth_header().await.unwrap();

        let resp = self.http
            .get(format!("{}/users/favorites", self.base_url))
            .header("Authorization", &auth)
            .send()
            .await?;

        let body: TwoXApiResponse<Vec<TwoXSkill>> = resp.json().await?;
        Ok(body.data.unwrap_or_default())
    }

    // ============================================================
    // 技能模块 (Skills)
    // ============================================================

    /// 获取热门技能（公开）
    pub async fn get_popular_skills(&self, limit: u32) -> Result<Vec<TwoXSkill>, SkillStoreError> {
        let resp = self.http
            .get(format!("{}/skills/popular?limit={}", self.base_url, limit))
            .send()
            .await?;

        let body: TwoXApiResponse<Vec<TwoXSkill>> = resp.json().await?;
        Ok(body.data.unwrap_or_default())
    }

    /// 获取最新技能（公开，支持搜索/分类/排序）
    pub async fn get_latest_skills(
        &self,
        q: Option<&str>,
        category: Option<&str>,
        sort: Option<&str>,
        limit: u32,
        offset: u32,
    ) -> Result<Vec<TwoXSkill>, SkillStoreError> {
        let mut url = format!("{}/skills/latest?limit={}&offset={}", self.base_url, limit, offset);
        if let Some(q) = q {
            url.push_str(&format!("&q={}", urlencoding::encode(q)));
        }
        if let Some(cat) = category {
            url.push_str(&format!("&category={}", urlencoding::encode(cat)));
        }
        if let Some(s) = sort {
            url.push_str(&format!("&sort={}", s));
        }

        let resp = self.http.get(&url).send().await?;
        let body: TwoXApiResponse<Vec<TwoXSkill>> = resp.json().await?;
        Ok(body.data.unwrap_or_default())
    }

    /// 技能列表（公开）
    pub async fn get_skills(
        &self,
        q: Option<&str>,
        category: Option<&str>,
        tags: Option<&str>,
        sort: Option<&str>,
        limit: u32,
        offset: u32,
    ) -> Result<Vec<TwoXSkill>, SkillStoreError> {
        let mut url = format!("{}/skills?limit={}&offset={}", self.base_url, limit, offset);
        if let Some(q) = q {
            url.push_str(&format!("&q={}", urlencoding::encode(q)));
        }
        if let Some(cat) = category {
            url.push_str(&format!("&category={}", urlencoding::encode(cat)));
        }
        if let Some(t) = tags {
            url.push_str(&format!("&tags={}", urlencoding::encode(t)));
        }
        if let Some(s) = sort {
            url.push_str(&format!("&sort={}", s));
        }
        url.push_str("&status=2"); // 默认只获取已发布的

        let resp = self.http.get(&url).send().await?;
        let body: TwoXApiResponse<Vec<TwoXSkill>> = resp.json().await?;
        Ok(body.data.unwrap_or_default())
    }

    /// 技能搜索（需认证）
    pub async fn search_skills(&self, q: &str) -> Result<Vec<TwoXSkill>, SkillStoreError> {
        self.check_auth()?;
        let auth = self.auth_header().await.unwrap();

        let resp = self.http
            .get(format!("{}/skills/search?q={}", self.base_url, urlencoding::encode(q)))
            .header("Authorization", &auth)
            .send()
            .await?;

        let body: TwoXApiResponse<Vec<TwoXSkill>> = resp.json().await?;
        Ok(body.data.unwrap_or_default())
    }

    /// 技能详情（公开，支持 ID 或 Slug）
    pub async fn get_skill_detail(&self, id_or_slug: &str) -> Result<TwoXSkillDetail, SkillStoreError> {
        let resp = self.http
            .get(format!("{}/skills/{}", self.base_url, id_or_slug))
            .send()
            .await?;

        let body: TwoXApiResponse<TwoXSkillDetail> = resp.json().await?;
        body.data.ok_or(SkillStoreError::Api("技能不存在".into()))
    }

    /// 创建技能（需认证）
    pub async fn create_skill(&self, req: CreateSkillRequest) -> Result<TwoXSkill, SkillStoreError> {
        self.check_auth()?;
        let auth = self.auth_header().await.unwrap();

        let resp = self.http
            .post(format!("{}/skills", self.base_url))
            .header("Authorization", &auth)
            .header("Content-Type", "application/json")
            .json(&req)
            .send()
            .await?;

        let body: TwoXApiResponse<TwoXSkill> = resp.json().await?;
        body.data.ok_or(SkillStoreError::Api("创建失败".into()))
    }

    /// 收藏/取消收藏
    pub async fn toggle_favorite(&self, id_or_slug: &str) -> Result<bool, SkillStoreError> {
        self.check_auth()?;
        let auth = self.auth_header().await.unwrap();

        // 先查询当前状态
        let resp = self.http
            .get(format!("{}/skills/{}/favorite", self.base_url, id_or_slug))
            .header("Authorization", &auth)
            .send()
            .await?;

        let body: TwoXApiResponse<FavoriteStatus> = resp.json().await?;
        let is_favorited = body.data.map(|d| d.favorited).unwrap_or(false);

        // 根据状态执行相反操作
        if is_favorited {
            let resp = self.http
                .delete(format!("{}/skills/{}/favorite", self.base_url, id_or_slug))
                .header("Authorization", &auth)
                .send()
                .await?;
            let body: TwoXApiResponse<serde_json::Value> = resp.json().await?;
            if body.code != 0 {
                return Err(SkillStoreError::Api(body.message));
            }
            Ok(false)
        } else {
            let resp = self.http
                .post(format!("{}/skills/{}/favorite", self.base_url, id_or_slug))
                .header("Authorization", &auth)
                .send()
                .await?;
            let body: TwoXApiResponse<serde_json::Value> = resp.json().await?;
            if body.code != 0 {
                return Err(SkillStoreError::Api(body.message));
            }
            Ok(true)
        }
    }

    /// 获取下载 URL
    pub async fn get_download_url(&self, id_or_slug: &str) -> Result<String, SkillStoreError> {
        self.check_auth()?;
        let auth = self.auth_header().await.unwrap();

        let resp = self.http
            .post(format!("{}/skills/{}/download", self.base_url, id_or_slug))
            .header("Authorization", &auth)
            .send()
            .await?;

        let body: TwoXApiResponse<DownloadUrlResponse> = resp.json().await?;
        let data = body.data.ok_or(SkillStoreError::Api("获取下载链接失败".into()))?;
        Ok(data.download_url)
    }

    /// 获取技能评价列表
    pub async fn get_reviews(
        &self,
        id_or_slug: &str,
        limit: u32,
        offset: u32,
    ) -> Result<Vec<TwoXReview>, SkillStoreError> {
        let resp = self.http
            .get(format!(
                "{}/skills/{}/reviews?limit={}&offset={}",
                self.base_url, id_or_slug, limit, offset
            ))
            .send()
            .await?;

        let body: TwoXApiResponse<Vec<TwoXReview>> = resp.json().await?;
        Ok(body.data.unwrap_or_default())
    }

    /// 创建评价（需认证）
    pub async fn create_review(
        &self,
        id_or_slug: &str,
        rating: u32,
        title: &str,
        content: &str,
    ) -> Result<TwoXReview, SkillStoreError> {
        self.check_auth()?;
        let auth = self.auth_header().await.unwrap();

        #[derive(Serialize)]
        struct Req<'a> {
            rating: u32,
            title: &'a str,
            content: &'a str,
        }

        let resp = self.http
            .post(format!("{}/skills/{}/reviews", self.base_url, id_or_slug))
            .header("Authorization", &auth)
            .json(&Req { rating, title, content })
            .send()
            .await?;

        let body: TwoXApiResponse<TwoXReview> = resp.json().await?;
        body.data.ok_or(SkillStoreError::Api("评价创建失败".into()))
    }

    // ============================================================
    // 排行榜
    // ============================================================

    pub async fn get_rankings(&self, ranking_type: &str) -> Result<Vec<TwoXRanking>, SkillStoreError> {
        let resp = self.http
            .get(format!("{}/rankings/{}", self.base_url, ranking_type))
            .send()
            .await?;

        let body: TwoXRankingsResponse = resp.json().await?;
        if body.code != 0 {
            return Err(SkillStoreError::Api(body.message.unwrap_or_default()));
        }
        Ok(body.skills)
    }

    // ============================================================
    // 工作流市场
    // ============================================================

    pub async fn get_workflows(
        &self,
        page: u32,
        limit: u32,
        category: Option<&str>,
        tag: Option<&str>,
        q: Option<&str>,
        sort: Option<&str>,
    ) -> Result<Vec<TwoXWorkflow>, SkillStoreError> {
        let mut url = format!(
            "{}/workflow-market?page={}&limit={}",
            self.base_url, page, limit
        );
        if let Some(cat) = category {
            url.push_str(&format!("&category={}", urlencoding::encode(cat)));
        }
        if let Some(t) = tag {
            url.push_str(&format!("&tag={}", urlencoding::encode(t)));
        }
        if let Some(q) = q {
            url.push_str(&format!("&q={}", urlencoding::encode(q)));
        }
        if let Some(s) = sort {
            url.push_str(&format!("&sort={}", s));
        }

        let resp = self.http.get(&url).send().await?;
        let body: TwoXApiResponse<Vec<TwoXWorkflow>> = resp.json().await?;
        Ok(body.data.unwrap_or_default())
    }

    pub async fn get_workflow_categories(&self) -> Result<Vec<String>, SkillStoreError> {
        let resp = self.http
            .get(format!("{}/workflow-market/categories", self.base_url))
            .send()
            .await?;

        let body: TwoXApiResponse<Vec<String>> = resp.json().await?;
        Ok(body.data.unwrap_or_default())
    }

    pub async fn get_workflow_detail(&self, id: u64) -> Result<TwoXWorkflowDetail, SkillStoreError> {
        self.check_auth()?;
        let auth = self.auth_header().await.unwrap();

        let resp = self.http
            .get(format!("{}/workflow-market/{}", self.base_url, id))
            .header("Authorization", &auth)
            .send()
            .await?;

        let body: TwoXApiResponse<TwoXWorkflowDetail> = resp.json().await?;
        body.data.ok_or(SkillStoreError::Api("工作流不存在".into()))
    }

    pub async fn download_workflow(&self, id: u64) -> Result<String, SkillStoreError> {
        self.check_auth()?;
        let auth = self.auth_header().await.unwrap();

        let resp = self.http
            .post(format!("{}/workflow-market/{}/download", self.base_url, id))
            .header("Authorization", &auth)
            .send()
            .await?;

        let body: TwoXApiResponse<WorkflowDownloadResponse> = resp.json().await?;
        let data = body.data.ok_or(SkillStoreError::Api("获取下载链接失败".into()))?;
        Ok(data.download_url)
    }
}

// ============================================================
// 数据类型定义 (基于 2x.com.cn 真实 API)
// ============================================================

#[derive(Deserialize)]
pub struct TwoXApiResponse<T> {
    pub code: u32,
    #[serde(default)]
    pub message: String,
    pub data: Option<T>,
}

#[derive(Deserialize)]
pub struct TwoXLoginData {
    pub token: String,
    pub expires_in: u64,
    pub user: TwoXUser,
}

#[derive(Deserialize, Clone, Debug)]
pub struct TwoXUser {
    pub id: u64,
    pub phone: Option<String>,
    pub username: String,
}

#[derive(Deserialize, Clone, Debug)]
pub struct TwoXUserProfile {
    pub id: u64,
    pub phone: Option<String>,
    pub username: String,
    pub nickname: String,
    pub avatar: String,
    pub email: Option<String>,
    pub is_admin: bool,
    pub created_at: String,
}

#[derive(Debug, Clone)]
pub struct TwoXLoginResponse {
    pub token: String,
    pub expires_in: u64,
    pub user: TwoXUser,
}

// 技能
#[derive(Deserialize, Clone, Debug, Serialize)]
pub struct TwoXSkill {
    pub id: u64,
    pub slug: String,
    pub name: String,
    pub summary: String,
    pub description: String,
    pub owner_id: u64,
    pub visibility: u32,
    pub category: String,
    pub tags: Vec<String>,
    pub capabilities: Vec<String>,
    pub license: String,
    pub current_version: String,
    pub status: u32,
    pub total_downloads: u64,
    pub total_favorites: u64,
    pub average_rating: f64,
    pub total_reviews: u64,
    pub created_at: String,
    pub updated_at: String,
}

// 技能详情
#[derive(Deserialize, Clone, Debug)]
pub struct TwoXSkillDetail {
    pub id: u64,
    pub slug: String,
    pub name: String,
    pub summary: String,
    pub description: String,
    pub long_description: String,
    pub owner_id: u64,
    pub visibility: u32,
    pub category: String,
    pub tags: Vec<String>,
    pub capabilities: Vec<String>,
    pub license: String,
    pub current_version: String,
    pub status: u32,
    pub total_downloads: u64,
    pub total_favorites: u64,
    pub average_rating: f64,
    pub total_reviews: u64,
    pub created_at: String,
    pub updated_at: String,
    pub owner: Option<TwoXUserProfile>,
}

// 创建技能请求
#[derive(Serialize)]
pub struct CreateSkillRequest {
    pub slug: String,
    pub name: String,
    pub summary: String,
    pub description: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub long_description: Option<String>,
    pub visibility: u32,
    pub category: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tags: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub capabilities: Option<Vec<String>>,
    pub license: String,
    pub version: String,
}

// 收藏状态
#[derive(Deserialize)]
pub struct FavoriteStatus {
    pub favorited: bool,
}

// 下载 URL 响应
#[derive(Deserialize)]
pub struct DownloadUrlResponse {
    pub download_url: String,
}

// 评价
#[derive(Deserialize, Clone, Debug)]
pub struct TwoXReview {
    pub id: u64,
    pub rating: u32,
    pub title: String,
    pub content: String,
    pub user: TwoXUser,
    pub created_at: String,
}

// 排行榜
#[derive(Deserialize)]
pub struct TwoXRankingsResponse {
    pub code: u32,
    #[serde(default)]
    pub message: Option<String>,
    #[serde(rename = "type")]
    pub ranking_type: String,
    pub skills: Vec<TwoXRanking>,
    pub cached: bool,
}

#[derive(Deserialize, Clone, Debug)]
pub struct TwoXRanking {
    pub rank: u32,
    pub skill_id: u64,
    pub slug: String,
    pub name: String,
    pub score: f64,
}

// 工作流
#[derive(Deserialize, Clone, Debug)]
pub struct TwoXWorkflow {
    pub id: u64,
    pub user_id: u64,
    pub name: String,
    pub slug: String,
    pub summary: String,
    pub description: String,
    pub category: String,
    pub tags: Vec<String>,
    pub visibility: String,
    pub license: String,
    pub version: String,
    pub status: u32,
    pub downloads: u64,
    pub stars: u64,
    pub executions: u64,
    pub created_at: String,
    pub updated_at: String,
}

// 工作流详情
#[derive(Deserialize, Clone, Debug)]
pub struct TwoXWorkflowDetail {
    pub id: u64,
    pub user_id: u64,
    pub name: String,
    pub slug: String,
    pub summary: String,
    pub description: String,
    pub category: String,
    pub tags: Vec<String>,
    pub visibility: String,
    pub license: String,
    pub version: String,
    pub workflow_yaml: String,
    pub status: u32,
    pub downloads: u64,
    pub stars: u64,
    pub executions: u64,
    pub created_at: String,
    pub updated_at: String,
}

// 工作流下载
#[derive(Deserialize)]
pub struct WorkflowDownloadResponse {
    pub download_url: String,
}

// 下载记录
#[derive(Deserialize, Clone, Debug)]
pub struct TwoXDownload {
    pub skill_id: u64,
    pub skill_name: String,
    pub downloaded_at: String,
}

// ============================================================
// 错误
// ============================================================

#[derive(Debug, thiserror::Error)]
pub enum SkillStoreError {
    #[error("网络错误: {0}")]
    Network(#[from] reqwest::Error),

    #[error("API 错误: {0}")]
    Api(String),

    #[error("未登录")]
    NotLoggedIn,

    #[error("序列化错误: {0}")]
    Serde(#[from] serde_json::Error),
}
