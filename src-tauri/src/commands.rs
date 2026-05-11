use crate::gfw_types::*;
use crate::gfw_client::GfwClient;
use crate::skill_store::{SkillStoreClient, SkillInfo, SkillListResponse, SkillCategory, InstalledSkill};
use crate::agent_bridge::AgentBridge;
use crate::config::AppConfig;
use crate::AppState;
use parking_lot::RwLock;
use std::sync::Arc;

// ============================================================
// 全局 Agent 实例
// ============================================================

static AGENT_BRIDGE: once_cell::sync::Lazy<RwLock<AgentBridge>> =
    once_cell::sync::Lazy::new(|| RwLock::new(AgentBridge::new()));

// ============================================================
// gfw.net 命令
// ============================================================

#[tauri::command]
pub async fn gfw_login(
    state: tauri::State<'_, AppState>,
    email: String,
    password: String,
) -> Result<serde_json::Value, String> {
    let login_resp = state.gfw_client.login(&email, &password).await
        .map_err(|e| e.to_string())?;

    // 存储 JWT 到系统密钥链
    store_jwt(&login_resp.token)?;
    store_refresh_token(&login_resp.refresh_token)?;

    Ok(serde_json::json!({
        "token": login_resp.token,
        "refresh_token": login_resp.refresh_token,
        "user": {
            "id": login_resp.user.id,
            "email": login_resp.user.email,
            "nickname": login_resp.user.nickname,
            "gcoin_balance": login_resp.user.gcoin_balance,
        }
    }))
}

#[tauri::command]
pub async fn gfw_refresh_token(
    state: tauri::State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let login_resp = state.gfw_client.refresh().await
        .map_err(|e| e.to_string())?;

    store_jwt(&login_resp.token)?;
    store_refresh_token(&login_resp.refresh_token)?;

    Ok(serde_json::json!({
        "token": login_resp.token,
        "user": {
            "id": login_resp.user.id,
            "email": login_resp.user.email,
            "nickname": login_resp.user.nickname,
            "gcoin_balance": login_resp.user.gcoin_balance,
        }
    }))
}

#[tauri::command]
pub async fn gfw_get_user_info(
    state: tauri::State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let info = state.gfw_client.get_user_info().await
        .map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "group_code": info.group_code,
        "group_name": info.group_name,
        "is_reseller": info.is_reseller,
        "user": {
            "id": info.user.id,
            "email": info.user.email,
            "nickname": info.user.nickname,
            "gcoin_balance": info.user.gcoin_balance,
            "gcoin_frozen": info.user.gcoin_frozen,
            "total_recharge": info.user.total_recharge,
            "total_consumed": info.user.total_consumed,
            "user_group_code": info.user.user_group_code,
        }
    }))
}

#[tauri::command]
pub async fn gfw_get_balance(
    state: tauri::State<'_, AppState>,
) -> Result<f64, String> {
    state.gfw_client.get_balance().await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn gfw_list_models(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let models = state.gfw_client.list_models_full().await
        .map_err(|e| e.to_string())?;

    Ok(models.into_iter().map(|m| {
        serde_json::json!({
            "id": m.id,
            "name": m.name,
            "name_en": m.name_en,
            "provider": m.provider,
            "model_type": m.model_type,
            "input_price": m.input_price,
            "output_price": m.output_price,
            "cache_price": m.cache_price,
            "context_window": m.context_window,
            "max_output_tokens": m.max_output_tokens,
            "max_input_tokens": m.max_input_tokens,
            "is_available": m.is_available,
            "is_featured": m.is_featured,
            "rpm": m.rpm,
            "tpm": m.tpm,
            "supports_thinking": m.supports_thinking,
            "supports_vision": m.supports_vision,
            "supports_function_call": m.supports_function_call,
            "supports_json_output": m.supports_json_output,
            "supports_cache": m.supports_cache,
            "description": m.description,
            "pricing_rules": m.pricing_rules,
            "discount": m.discount,
        })
    }).collect())
}

#[tauri::command]
pub async fn gfw_list_api_keys(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let keys = state.gfw_client.list_api_keys().await
        .map_err(|e| e.to_string())?;

    Ok(keys.into_iter().map(|k| {
        serde_json::json!({
            "id": k.id,
            "key_prefix": k.key_prefix,
            "can_retrieve": k.can_retrieve,
            "name": k.name,
            "rate_limit": k.rate_limit,
            "gcoin_limit": k.gcoin_limit,
            "used_quota": k.used_quota,
            "cycle_type": k.cycle_type,
            "cycle_reset_at": k.cycle_reset_at,
            "last_used_at": k.last_used_at,
            "is_active": k.is_active,
            "created_at": k.created_at,
        })
    }).collect())
}

#[tauri::command]
pub async fn gfw_create_api_key(
    state: tauri::State<'_, AppState>,
    name: String,
    gcoin_limit: Option<f64>,
    rate_limit: Option<u32>,
) -> Result<serde_json::Value, String> {
    let full_key = state.gfw_client.create_and_retrieve_key(CreateApiKeyRequest {
        name,
        gcoin_limit,
        rate_limit,
    }).await.map_err(|e| e.to_string())?;

    // 存储 API Key 到系统密钥链
    store_api_key(&full_key.key)?;

    Ok(serde_json::json!({
        "id": full_key.id,
        "key": full_key.key,
        "name": full_key.name,
        "gcoin_limit": full_key.gcoin_limit,
        "rate_limit": full_key.rate_limit,
    }))
}

#[tauri::command]
pub async fn gfw_get_full_key(
    state: tauri::State<'_, AppState>,
    key_id: u64,
) -> Result<String, String> {
    state.gfw_client.get_full_key(key_id).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn gfw_get_daily_usage(
    state: tauri::State<'_, AppState>,
    days: u32,
) -> Result<Vec<serde_json::Value>, String> {
    let usage = state.gfw_client.get_daily_usage(days).await
        .map_err(|e| e.to_string())?;

    Ok(usage.into_iter().map(|u| {
        serde_json::json!({
            "date": u.date,
            "request_count": u.request_count,
            "input_tokens": u.input_tokens,
            "output_tokens": u.output_tokens,
            "total_cost": u.total_cost,
        })
    }).collect())
}

#[tauri::command]
pub async fn gfw_get_recharge_packages(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let packages = state.gfw_client.get_recharge_packages().await
        .map_err(|e| e.to_string())?;

    Ok(packages.into_iter().map(|p| {
        serde_json::json!({
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": p.price,
            "gcoin_amount": p.gcoin_amount,
            "bonus_gcoin": p.bonus_gcoin,
            "discount_rate": p.discount_rate,
            "is_active": p.is_active,
            "purchase_limit": p.purchase_limit,
            "upgrade_group": p.upgrade_group,
            "badge": p.badge,
        })
    }).collect())
}

#[tauri::command]
pub async fn gfw_create_recharge_order(
    state: tauri::State<'_, AppState>,
    package_id: u64,
    pay_method: String,
) -> Result<serde_json::Value, String> {
    let order = state.gfw_client.create_recharge_order(package_id, &pay_method).await
        .map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "id": order.id,
        "package_id": order.package_id,
        "amount": order.amount,
        "pay_method": order.pay_method,
        "status": order.status,
        "pay_url": order.pay_url,
        "created_at": order.created_at,
    }))
}

#[tauri::command]
pub async fn gfw_list_sr_providers(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let providers = state.gfw_client.list_sr_providers().await
        .map_err(|e| e.to_string())?;

    Ok(providers.into_iter().map(|p| {
        serde_json::json!({
            "id": p.id,
            "code": p.code,
            "name": p.name,
            "model_type": p.model_type,
            "base_url": p.base_url,
            "auth_header": p.auth_header,
            "auth_prefix": p.auth_prefix,
            "is_active": p.is_active,
        })
    }).collect())
}

// ============================================================
// Skill 商店命令 (2x.com.cn - 基于真实 API)
// ============================================================

#[tauri::command]
pub async fn skill_store_send_email_code(
    _state: tauri::State<'_, AppState>,
    email: String,
) -> Result<(), String> {
    let client = SkillStoreClient::new(None);
    client.send_email_code(&email).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn skill_store_email_login(
    _state: tauri::State<'_, AppState>,
    email: String,
    password: String,
    captcha_id: Option<String>,
    captcha_code: Option<String>,
) -> Result<serde_json::Value, String> {
    let client = SkillStoreClient::new(None);
    let resp = client.email_login(
        &email,
        &password,
        captcha_id.as_deref(),
        captcha_code.as_deref(),
    ).await.map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "token": resp.token,
        "expires_in": resp.expires_in,
        "user": {
            "id": resp.user.id,
            "username": resp.user.username,
            "phone": resp.user.phone,
        }
    }))
}

#[tauri::command]
pub async fn skill_store_phone_login(
    _state: tauri::State<'_, AppState>,
    phone: String,
    password: String,
    captcha_id: Option<String>,
    captcha_code: Option<String>,
) -> Result<serde_json::Value, String> {
    let client = SkillStoreClient::new(None);
    let resp = client.phone_login(
        &phone,
        &password,
        captcha_id.as_deref(),
        captcha_code.as_deref(),
    ).await.map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "token": resp.token,
        "expires_in": resp.expires_in,
        "user": {
            "id": resp.user.id,
            "username": resp.user.username,
            "phone": resp.user.phone,
        }
    }))
}

#[tauri::command]
pub async fn skill_store_get_profile(
    _state: tauri::State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let client = SkillStoreClient::new(None);
    let profile = client.get_profile().await.map_err(|e| e.to_string())?;

    Ok(serde_json::json!(profile))
}

#[tauri::command]
pub async fn skill_store_get_popular_skills(
    _state: tauri::State<'_, AppState>,
    limit: u32,
) -> Result<serde_json::Value, String> {
    let client = SkillStoreClient::new(None);
    let skills = client.get_popular_skills(limit).await.map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "skills": skills,
    }))
}

#[tauri::command]
pub async fn skill_store_get_skills(
    _state: tauri::State<'_, AppState>,
    q: Option<String>,
    category: Option<String>,
    tags: Option<String>,
    sort: Option<String>,
    limit: u32,
    offset: u32,
) -> Result<serde_json::Value, String> {
    let client = SkillStoreClient::new(None);
    let skills = client.get_skills(
        q.as_deref(),
        category.as_deref(),
        tags.as_deref(),
        sort.as_deref(),
        limit,
        offset,
    ).await.map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "skills": skills,
    }))
}

#[tauri::command]
pub async fn skill_store_search_skills(
    state: tauri::State<'_, AppState>,
    query: String,
) -> Result<serde_json::Value, String> {
    let client = SkillStoreClient::new(Some(state.config.read().skill_store.base_url.clone()));
    let skills = client.search_skills(&query).await
        .map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "skills": skills,
    }))
}

#[tauri::command]
pub async fn skill_store_get_skill_detail(
    _state: tauri::State<'_, AppState>,
    id_or_slug: String,
) -> Result<serde_json::Value, String> {
    let client = SkillStoreClient::new(None);
    let detail = client.get_skill_detail(&id_or_slug).await.map_err(|e| e.to_string())?;

    Ok(serde_json::json!(detail))
}

#[tauri::command]
pub async fn skill_store_toggle_favorite(
    _state: tauri::State<'_, AppState>,
    id_or_slug: String,
) -> Result<bool, String> {
    let client = SkillStoreClient::new(None);
    client.toggle_favorite(&id_or_slug).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn skill_store_get_download_url(
    _state: tauri::State<'_, AppState>,
    id_or_slug: String,
) -> Result<String, String> {
    let client = SkillStoreClient::new(None);
    client.get_download_url(&id_or_slug).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn skill_store_get_reviews(
    _state: tauri::State<'_, AppState>,
    id_or_slug: String,
    limit: u32,
    offset: u32,
) -> Result<serde_json::Value, String> {
    let client = SkillStoreClient::new(None);
    let reviews = client.get_reviews(&id_or_slug, limit, offset).await.map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "reviews": reviews,
    }))
}

#[tauri::command]
pub async fn skill_store_get_rankings(
    _state: tauri::State<'_, AppState>,
    ranking_type: String,
) -> Result<serde_json::Value, String> {
    let client = SkillStoreClient::new(None);
    let rankings = client.get_rankings(&ranking_type).await.map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "type": ranking_type,
        "rankings": rankings,
    }))
}

#[tauri::command]
pub async fn skill_store_get_workflows(
    _state: tauri::State<'_, AppState>,
    page: u32,
    limit: u32,
    category: Option<String>,
    tag: Option<String>,
    q: Option<String>,
    sort: Option<String>,
) -> Result<serde_json::Value, String> {
    let client = SkillStoreClient::new(None);
    let workflows = client.get_workflows(
        page,
        limit,
        category.as_deref(),
        tag.as_deref(),
        q.as_deref(),
        sort.as_deref(),
    ).await.map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "workflows": workflows,
    }))
}

#[tauri::command]
pub async fn skill_store_get_workflow_categories(
    _state: tauri::State<'_, AppState>,
) -> Result<Vec<String>, String> {
    let client = SkillStoreClient::new(None);
    client.get_workflow_categories().await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn skill_store_get_my_skills(
    _state: tauri::State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let client = SkillStoreClient::new(None);
    let skills = client.get_my_skills().await.map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "skills": skills,
    }))
}

#[tauri::command]
pub async fn skill_store_get_favorites(
    _state: tauri::State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let client = SkillStoreClient::new(None);
    let skills = client.get_favorites().await.map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "skills": skills,
    }))
}

#[tauri::command]
pub async fn skill_store_get_downloads(
    _state: tauri::State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let client = SkillStoreClient::new(None);
    let downloads = client.get_downloads().await.map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "downloads": downloads,
    }))
}

// ============================================================
// Agent 命令
// ============================================================

#[tauri::command]
pub async fn agent_start(
    state: tauri::State<'_, AppState>,
    hermes_path: String,
) -> Result<u16, String> {
    let api_key = load_api_key()
        .ok_or("未配置 API Key，请先在设置中创建 API Key")?;

    let jwt = load_jwt();

    let bridge = AGENT_BRIDGE.read().await;
    bridge.start(&hermes_path, &api_key, jwt.as_deref()).await
}

#[tauri::command]
pub async fn agent_stop(_state: tauri::State<'_, AppState>) -> Result<(), String> {
    let bridge = AGENT_BRIDGE.read().await;
    bridge.stop().await
}

#[tauri::command]
pub async fn agent_send_message(
    _state: tauri::State<'_, AppState>,
    content: String,
    model: Option<String>,
) -> Result<(), String> {
    let bridge = AGENT_BRIDGE.read().await;
    bridge.send_message(&content, model.as_deref()).await
}

#[tauri::command]
pub async fn agent_cancel(
    _state: tauri::State<'_, AppState>,
    msg_id: String,
) -> Result<(), String> {
    let bridge = AGENT_BRIDGE.read().await;
    bridge.cancel(&msg_id).await
}

// ============================================================
// 配置命令
// ============================================================

#[tauri::command]
pub async fn config_get(
    state: tauri::State<'_, AppState>,
    key: String,
) -> Result<serde_json::Value, String> {
    let config = state.config.read();
    let value = get_config_value(&config, &key);
    Ok(value.unwrap_or(serde_json::Value::Null))
}

#[tauri::command]
pub async fn config_set(
    state: tauri::State<'_, AppState>,
    key: String,
    value: serde_json::Value,
) -> Result<(), String> {
    let mut config = state.config.write();
    set_config_value(&mut config, &key, value);
    config.save().map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn config_get_all(
    state: tauri::State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let config = state.config.read();
    Ok(serde_json::to_value(&*config).map_err(|e| e.to_string())?)
}

// ============================================================
// 辅助函数
// ============================================================

fn store_jwt(token: &str) -> Result<(), String> {
    #[cfg(not(test))]
    {
        let entry = keyring::Entry::new("hermes-desktop", "gfw_jwt");
        entry.set_password(token).map_err(|e| e.to_string())?;
    }
    #[cfg(test)]
    {
        let _ = token;
    }
    Ok(())
}

fn store_refresh_token(token: &str) -> Result<(), String> {
    #[cfg(not(test))]
    {
        let entry = keyring::Entry::new("hermes-desktop", "gfw_refresh_token");
        entry.set_password(token).map_err(|e| e.to_string())?;
    }
    #[cfg(test)]
    {
        let _ = token;
    }
    Ok(())
}

fn store_api_key(key: &str) -> Result<(), String> {
    #[cfg(not(test))]
    {
        let entry = keyring::Entry::new("hermes-desktop", "gfw_api_key");
        entry.set_password(key).map_err(|e| e.to_string())?;
    }
    #[cfg(test)]
    {
        let _ = key;
    }
    Ok(())
}

fn load_jwt() -> Option<String> {
    #[cfg(not(test))]
    {
        let entry = keyring::Entry::new("hermes-desktop", "gfw_jwt");
        entry.get_password().ok()
    }
    #[cfg(test)]
    {
        None
    }
}

fn load_api_key() -> Option<String> {
    #[cfg(not(test))]
    {
        let entry = keyring::Entry::new("hermes-desktop", "gfw_api_key");
        entry.get_password().ok()
    }
    #[cfg(test)]
    {
        None
    }
}

fn get_config_value(config: &AppConfig, key: &str) -> Option<serde_json::Value> {
    match key {
        "gfw.management_base_url" => Some(serde_json::json!(config.gfw.management_base_url)),
        "gfw.ai_base_url" => Some(serde_json::json!(config.gfw.ai_base_url)),
        "gfw.default_model" => Some(serde_json::json!(config.gfw.default_model)),
        "gfw.api_key_id" => config.gfw.api_key_id.map(|v| serde_json::json!(v)),
        "skill_store.base_url" => Some(serde_json::json!(config.skill_store.base_url)),
        "agent.context_length" => Some(serde_json::json!(config.agent.context_length)),
        "agent.max_iterations" => Some(serde_json::json!(config.agent.max_iterations)),
        "agent.streaming" => Some(serde_json::json!(config.agent.streaming)),
        "agent.timeout_secs" => Some(serde_json::json!(config.agent.timeout_secs)),
        _ => None,
    }
}

fn set_config_value(config: &mut AppConfig, key: &str, value: serde_json::Value) {
    match key {
        "gfw.management_base_url" => {
            if let Some(v) = value.as_str() {
                config.gfw.management_base_url = v.to_string();
            }
        }
        "gfw.ai_base_url" => {
            if let Some(v) = value.as_str() {
                config.gfw.ai_base_url = v.to_string();
            }
        }
        "gfw.default_model" => {
            if let Some(v) = value.as_str() {
                config.gfw.default_model = v.to_string();
            }
        }
        "gfw.api_key_id" => {
            if let Some(v) = value.as_u64() {
                config.gfw.api_key_id = Some(v);
            }
        }
        "skill_store.base_url" => {
            if let Some(v) = value.as_str() {
                config.skill_store.base_url = v.to_string();
            }
        }
        "agent.context_length" => {
            if let Some(v) = value.as_u64() {
                config.agent.context_length = v;
            }
        }
        "agent.max_iterations" => {
            if let Some(v) = value.as_u64() {
                config.agent.max_iterations = v as u32;
            }
        }
        "agent.streaming" => {
            if let Some(v) = value.as_bool() {
                config.agent.streaming = v;
            }
        }
        "agent.timeout_secs" => {
            if let Some(v) = value.as_u64() {
                config.agent.timeout_secs = v;
            }
        }
        _ => {}
    }
}
