use crate::gfw_types::*;
use crate::skill_store::SkillStoreClient;
use crate::agent_bridge::AgentBridge;
use crate::config::AppConfig;
use crate::AppState;
use std::sync::Arc;
use tokio::sync::RwLock;
use once_cell::sync::Lazy;

static AGENT: Lazy<Arc<RwLock<AgentBridge>>> =
    Lazy::new(|| Arc::new(RwLock::new(AgentBridge::new())));

fn store_cred(_svc: &str, _key: &str, _val: &str) -> Result<(), String> {
    match keyring::Entry::new(_svc, _key) {
        Ok(e) => e.set_password(_val).map_err(|e| e.to_string()),
        Err(e) => Err(e.to_string()),
    }
}

fn load_cred(_svc: &str, _key: &str) -> Option<String> {
    keyring::Entry::new(_svc, _key).ok()?.get_password().ok()
}

// ============================================================
// gfw.net
// ============================================================

#[tauri::command]
pub async fn gfw_login(state: tauri::State<'_, AppState>, email: String, password: String) -> Result<serde_json::Value, String> {
    let r = state.gfw_client.login(&email, &password).await.map_err(|e| e.to_string())?;
    let _ = store_cred("hermes-desktop", "gfw_jwt", &r.token);
    let _ = store_cred("hermes-desktop", "gfw_rt", &r.refresh_token);
    Ok(serde_json::json!({"token": r.token, "user": r.user}))
}

#[tauri::command]
pub async fn gfw_refresh_token(state: tauri::State<'_, AppState>) -> Result<serde_json::Value, String> {
    let r = state.gfw_client.refresh().await.map_err(|e| e.to_string())?;
    let _ = store_cred("hermes-desktop", "gfw_jwt", &r.token);
    Ok(serde_json::json!({"token": r.token, "user": r.user}))
}

#[tauri::command]
pub async fn gfw_get_user_info(state: tauri::State<'_, AppState>) -> Result<serde_json::Value, String> {
    let i = state.gfw_client.get_user_info().await.map_err(|e| e.to_string())?;
    Ok(serde_json::json!({"group_code": i.group_code, "group_name": i.group_name, "user": i.user}))
}

#[tauri::command]
pub async fn gfw_get_balance(state: tauri::State<'_, AppState>) -> Result<f64, String> {
    state.gfw_client.get_balance().await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn gfw_list_models(state: tauri::State<'_, AppState>) -> Result<serde_json::Value, String> {
    let m = state.gfw_client.list_models_full().await.map_err(|e| e.to_string())?;
    Ok(serde_json::json!(m))
}

#[tauri::command]
pub async fn gfw_list_api_keys(state: tauri::State<'_, AppState>) -> Result<serde_json::Value, String> {
    let k = state.gfw_client.list_api_keys().await.map_err(|e| e.to_string())?;
    Ok(serde_json::json!(k))
}

#[tauri::command]
pub async fn gfw_create_api_key(state: tauri::State<'_, AppState>, name: String, gcoin_limit: Option<f64>, rate_limit: Option<u32>) -> Result<serde_json::Value, String> {
    let k = state.gfw_client.create_and_retrieve_key(CreateApiKeyRequest { name, gcoin_limit, rate_limit }).await.map_err(|e| e.to_string())?;
    let _ = store_cred("hermes-desktop", "gfw_api_key", &k.key);
    Ok(serde_json::json!({"id": k.id, "key": k.key, "name": k.name}))
}

#[tauri::command]
pub async fn gfw_get_full_key(state: tauri::State<'_, AppState>, key_id: u64) -> Result<String, String> {
    state.gfw_client.get_full_key(key_id).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn gfw_get_daily_usage(state: tauri::State<'_, AppState>, days: u32) -> Result<serde_json::Value, String> {
    let u = state.gfw_client.get_daily_usage(days).await.map_err(|e| e.to_string())?;
    Ok(serde_json::json!(u))
}

#[tauri::command]
pub async fn gfw_get_recharge_packages(state: tauri::State<'_, AppState>) -> Result<serde_json::Value, String> {
    let p = state.gfw_client.get_recharge_packages().await.map_err(|e| e.to_string())?;
    Ok(serde_json::json!(p))
}

#[tauri::command]
pub async fn gfw_create_recharge_order(state: tauri::State<'_, AppState>, package_id: u64, pay_method: String) -> Result<serde_json::Value, String> {
    let o = state.gfw_client.create_recharge_order(package_id, &pay_method).await.map_err(|e| e.to_string())?;
    Ok(serde_json::json!(o))
}

#[tauri::command]
pub async fn gfw_list_sr_providers(state: tauri::State<'_, AppState>) -> Result<serde_json::Value, String> {
    let p = state.gfw_client.list_sr_providers().await.map_err(|e| e.to_string())?;
    Ok(serde_json::json!(p))
}

// ============================================================
// 2x.com.cn
// ============================================================

#[tauri::command]
pub async fn skill_store_email_login(_state: tauri::State<'_, AppState>, email: String, password: String) -> Result<serde_json::Value, String> {
    let c = SkillStoreClient::new(None);
    let r = c.email_login(&email, &password, None, None).await.map_err(|e| e.to_string())?;
    Ok(serde_json::json!({"token": r.token, "user": {"id": r.user.id, "username": r.user.username}}))
}

#[tauri::command]
pub async fn skill_store_get_skills(_state: tauri::State<'_, AppState>, q: Option<String>, category: Option<String>, sort: Option<String>, limit: u32, offset: u32) -> Result<serde_json::Value, String> {
    let c = SkillStoreClient::new(None);
    let s = c.get_skills(q.as_deref(), category.as_deref(), None, sort.as_deref(), limit, offset).await.map_err(|e| e.to_string())?;
    Ok(serde_json::json!({"skills": s}))
}

#[tauri::command]
pub async fn skill_store_search_skills(_state: tauri::State<'_, AppState>, query: String) -> Result<serde_json::Value, String> {
    let c = SkillStoreClient::new(None);
    let s = c.search_skills(&query).await.map_err(|e| e.to_string())?;
    Ok(serde_json::json!({"skills": s}))
}

#[tauri::command]
pub async fn skill_store_get_skill_detail(_state: tauri::State<'_, AppState>, id_or_slug: String) -> Result<serde_json::Value, String> {
    let c = SkillStoreClient::new(None);
    let d = c.get_skill_detail(&id_or_slug).await.map_err(|e| e.to_string())?;
    Ok(serde_json::to_value(&d).unwrap_or_default())
}

#[tauri::command]
pub async fn skill_store_get_popular_skills(_state: tauri::State<'_, AppState>, limit: u32) -> Result<serde_json::Value, String> {
    let c = SkillStoreClient::new(None);
    let s = c.get_popular_skills(limit).await.map_err(|e| e.to_string())?;
    Ok(serde_json::json!({"skills": s}))
}

#[tauri::command]
pub async fn skill_store_get_rankings(_state: tauri::State<'_, AppState>, ranking_type: String) -> Result<serde_json::Value, String> {
    let c = SkillStoreClient::new(None);
    let r = c.get_rankings(&ranking_type).await.map_err(|e| e.to_string())?;
    Ok(serde_json::json!({"rankings": r}))
}

#[tauri::command]
pub async fn skill_store_get_workflows(_state: tauri::State<'_, AppState>, page: u32, limit: u32, category: Option<String>, q: Option<String>, sort: Option<String>) -> Result<serde_json::Value, String> {
    let c = SkillStoreClient::new(None);
    let w = c.get_workflows(page, limit, category.as_deref(), None, q.as_deref(), sort.as_deref()).await.map_err(|e| e.to_string())?;
    Ok(serde_json::json!({"workflows": w}))
}

// ============================================================
// Agent
// ============================================================

#[tauri::command]
pub async fn agent_start(_state: tauri::State<'_, AppState>, hermes_path: String) -> Result<u16, String> {
    let key = load_cred("hermes-desktop", "gfw_api_key").unwrap_or_default();
    let jwt = load_cred("hermes-desktop", "gfw_jwt");
    let b = AGENT.read().await;
    b.start(&hermes_path, &key, jwt.as_deref()).await
}

#[tauri::command]
pub async fn agent_stop(_state: tauri::State<'_, AppState>) -> Result<(), String> {
    AGENT.read().await.stop().await
}

#[tauri::command]
pub async fn agent_send_message(_state: tauri::State<'_, AppState>, content: String, model: Option<String>) -> Result<(), String> {
    AGENT.read().await.send_message(&content, model.as_deref()).await
}

#[tauri::command]
pub async fn agent_cancel(_state: tauri::State<'_, AppState>, msg_id: String) -> Result<(), String> {
    AGENT.read().await.cancel(&msg_id).await
}

// ============================================================
// Config
// ============================================================

#[tauri::command]
pub async fn config_get(state: tauri::State<'_, AppState>, key: String) -> Result<serde_json::Value, String> {
    let c = state.config.read().await;
    Ok(match key.as_str() {
        "gfw.default_model" => serde_json::json!(c.gfw.default_model),
        "agent.streaming" => serde_json::json!(c.agent.streaming),
        _ => serde_json::Value::Null,
    })
}

#[tauri::command]
pub async fn config_set(state: tauri::State<'_, AppState>, key: String, value: serde_json::Value) -> Result<(), String> {
    let mut c = state.config.write().await;
    match key.as_str() {
        "gfw.default_model" => { if let Some(v) = value.as_str() { c.gfw.default_model = v.to_string(); } }
        "agent.streaming" => { if let Some(v) = value.as_bool() { c.agent.streaming = v; } }
        _ => {}
    }
    c.save().map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn config_get_all(state: tauri::State<'_, AppState>) -> Result<serde_json::Value, String> {
    let c = state.config.read().await;
    serde_json::to_value(&*c).map_err(|e| e.to_string())
}
