use crate::gfw_types::*;
use crate::skill_store::SkillStoreClient;
use crate::agent_bridge::AgentBridge;
use crate::config::AppConfig;
use crate::AppState;
use std::sync::Arc;
use tokio::sync::RwLock;
use once_cell::sync::Lazy;

// ============================================================
// 全局 Agent 实例
// ============================================================

static AGENT_BRIDGE: Lazy<Arc<RwLock<AgentBridge>>> =
    Lazy::new(|| Arc::new(RwLock::new(AgentBridge::new())));

// ============================================================
// 密钥链辅助函数 (简化版，跨平台兼容)
// ============================================================

fn store_credential(service: &str, key: &str, value: &str) -> Result<(), String> {
    let entry = keyring::Entry::new(service, key)
        .map_err(|e| format!("keyring error: {}", e))?;
    entry.set_password(value).map_err(|e| format!("keyring set error: {}", e))
}

fn load_credential(service: &str, key: &str) -> Option<String> {
    let entry = keyring::Entry::new(service, key).ok()?;
    entry.get_password().ok()
}

// ============================================================
// gfw.net 命令
// ============================================================

#[tauri::command]
pub async fn gfw_login(
    state: tauri::State<'_, AppState>,
    email: String,
    password: String,
) -> Result<serde_json::Value, String> {
    let resp = state.gfw_client.login(&email, &password).await
        .map_err(|e| e.to_string())?;

    let _ = store_credential("hermes-desktop", "gfw_jwt", &resp.token);
    let _ = store_credential("hermes-desktop", "gfw_refresh_token", &resp.refresh_token);

    Ok(serde_json::json!({
        "token": resp.token,
        "user": {
            "id": resp.user.id,
            "email": resp.user.email,
            "nickname": resp.user.nickname,
            "gcoin_balance": resp.user.gcoin_balance,
        }
    }))
}

#[tauri::command]
pub async fn gfw_refresh_token(
    state: tauri::State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let resp = state.gfw_client.refresh().await
        .map_err(|e| e.to_string())?;

    let _ = store_credential("hermes-desktop", "gfw_jwt", &resp.token);

    Ok(serde_json::json!({
        "token": resp.token,
        "user": {
            "id": resp.user.id,
            "email": resp.user.email,
            "nickname": resp.user.nickname,
            "gcoin_balance": resp.user.gcoin_balance,
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
        "user": info.user,
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

    Ok(models.into_iter().map(|m| serde_json::to_value(&m).unwrap_or_default()).collect())
}

#[tauri::command]
pub async fn gfw_list_api_keys(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let keys = state.gfw_client.list_api_keys().await
        .map_err(|e| e.to_string())?;

    Ok(keys.into_iter().map(|k| serde_json::to_value(&k).unwrap_or_default()).collect())
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

    let _ = store_credential("hermes-desktop", "gfw_api_key", &full_key.key);

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

    Ok(usage.into_iter().map(|u| serde_json::to_value(&u).unwrap_or_default()).collect())
}

#[tauri::command]
pub async fn gfw_get_recharge_packages(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let packages = state.gfw_client.get_recharge_packages().await
        .map_err(|e| e.to_string())?;

    Ok(packages.into_iter().map(|p| serde_json::to_value(&p).unwrap_or_default()).collect())
}

#[tauri::command]
pub async fn gfw_create_recharge_order(
    state: tauri::State<'_, AppState>,
    package_id: u64,
    pay_method: String,
) -> Result<serde_json::Value, String> {
    let order = state.gfw_client.create_recharge_order(package_id, &pay_method).await
        .map_err(|e| e.to_string())?;

    Ok(serde_json::to_value(&order).unwrap_or_default())
}

#[tauri::command]
pub async fn gfw_list_sr_providers(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let providers = state.gfw_client.list_sr_providers().await
        .map_err(|e| e.to_string())?;

    Ok(providers.into_iter().map(|p| serde_json::to_value(&p).unwrap_or_default()).collect())
}

// ============================================================
// 2x.com.cn Skill 商店命令
// ============================================================

#[tauri::command]
pub async fn skill_store_email_login(
    _state: tauri::State<'_, AppState>,
    email: String,
    password: String,
) -> Result<serde_json::Value, String> {
    let client = SkillStoreClient::new(None);
    let resp = client.email_login(&email, &password, None, None).await
        .map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "token": resp.token,
        "expires_in": resp.expires_in,
        "user": {
            "id": resp.user.id,
            "username": resp.user.username,
        }
    }))
}

#[tauri::command]
pub async fn skill_store_get_skills(
    _state: tauri::State<'_, AppState>,
    q: Option<String>,
    category: Option<String>,
    sort: Option<String>,
    limit: u32,
    offset: u32,
) -> Result<serde_json::Value, String> {
    let client = SkillStoreClient::new(None);
    let skills = client.get_skills(
        q.as_deref(), category.as_deref(), None, sort.as_deref(), limit, offset,
    ).await.map_err(|e| e.to_string())?;

    Ok(serde_json::json!({ "skills": skills }))
}

#[tauri::command]
pub async fn skill_store_search_skills(
    _state: tauri::State<'_, AppState>,
    query: String,
) -> Result<serde_json::Value, String> {
    let client = SkillStoreClient::new(None);
    let skills = client.search_skills(&query).await
        .map_err(|e| e.to_string())?;

    Ok(serde_json::json!({ "skills": skills }))
}

#[tauri::command]
pub async fn skill_store_get_skill_detail(
    _state: tauri::State<'_, AppState>,
    id_or_slug: String,
) -> Result<serde_json::Value, String> {
    let client = SkillStoreClient::new(None);
    let detail = client.get_skill_detail(&id_or_slug).await
        .map_err(|e| e.to_string())?;

    Ok(serde_json::to_value(&detail).unwrap_or_default())
}

#[tauri::command]
pub async fn skill_store_get_popular_skills(
    _state: tauri::State<'_, AppState>,
    limit: u32,
) -> Result<serde_json::Value, String> {
    let client = SkillStoreClient::new(None);
    let skills = client.get_popular_skills(limit).await
        .map_err(|e| e.to_string())?;

    Ok(serde_json::json!({ "skills": skills }))
}

#[tauri::command]
pub async fn skill_store_get_rankings(
    _state: tauri::State<'_, AppState>,
    ranking_type: String,
) -> Result<serde_json::Value, String> {
    let client = SkillStoreClient::new(None);
    let rankings = client.get_rankings(&ranking_type).await
        .map_err(|e| e.to_string())?;

    Ok(serde_json::json!({ "type": ranking_type, "rankings": rankings }))
}

#[tauri::command]
pub async fn skill_store_get_workflows(
    _state: tauri::State<'_, AppState>,
    page: u32,
    limit: u32,
    category: Option<String>,
    q: Option<String>,
    sort: Option<String>,
) -> Result<serde_json::Value, String> {
    let client = SkillStoreClient::new(None);
    let workflows = client.get_workflows(
        page, limit, category.as_deref(), None, q.as_deref(), sort.as_deref(),
    ).await.map_err(|e| e.to_string())?;

    Ok(serde_json::json!({ "workflows": workflows }))
}

// ============================================================
// Agent 命令
// ============================================================

#[tauri::command]
pub async fn agent_start(
    _state: tauri::State<'_, AppState>,
    hermes_path: String,
) -> Result<u16, String> {
    let api_key = load_credential("hermes-desktop", "gfw_api_key")
        .unwrap_or_default();
    let jwt = load_credential("hermes-desktop", "gfw_jwt");

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
    let config = state.config.read().await;
    Ok(get_config_value(&config, &key))
}

#[tauri::command]
pub async fn config_set(
    state: tauri::State<'_, AppState>,
    key: String,
    value: serde_json::Value,
) -> Result<(), String> {
    let mut config = state.config.write().await;
    set_config_value(&mut config, &key, value);
    config.save().map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn config_get_all(
    state: tauri::State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let config = state.config.read().await;
    serde_json::to_value(&*config).map_err(|e| e.to_string())
}

// ============================================================
// 辅助函数
// ============================================================

fn get_config_value(config: &AppConfig, key: &str) -> serde_json::Value {
    match key {
        "gfw.ai_base_url" => serde_json::json!(config.gfw.ai_base_url),
        "gfw.default_model" => serde_json::json!(config.gfw.default_model),
        "agent.context_length" => serde_json::json!(config.agent.context_length),
        "agent.max_iterations" => serde_json::json!(config.agent.max_iterations),
        "agent.streaming" => serde_json::json!(config.agent.streaming),
        _ => serde_json::Value::Null,
    }
}

fn set_config_value(config: &mut AppConfig, key: &str, value: serde_json::Value) {
    match key {
        "gfw.ai_base_url" => {
            if let Some(v) = value.as_str() { config.gfw.ai_base_url = v.to_string(); }
        }
        "gfw.default_model" => {
            if let Some(v) = value.as_str() { config.gfw.default_model = v.to_string(); }
        }
        "agent.context_length" => {
            if let Some(v) = value.as_u64() { config.agent.context_length = v; }
        }
        "agent.max_iterations" => {
            if let Some(v) = value.as_u64() { config.agent.max_iterations = v as u32; }
        }
        "agent.streaming" => {
            if let Some(v) = value.as_bool() { config.agent.streaming = v; }
        }
        _ => {}
    }
}
