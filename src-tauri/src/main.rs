#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod gfw_client;
mod gfw_types;
mod skill_store;
mod agent_bridge;
mod config;
mod commands;

use std::sync::Arc;
use gfw_client::GfwClient;
use config::AppConfig;
use parking_lot::RwLock;

pub struct AppState {
    pub config: Arc<RwLock<AppConfig>>,
    pub gfw_client: Arc<GfwClient>,
}

fn main() {
    let config = Arc::new(RwLock::new(AppConfig::load()));
    let gfw_client = Arc::new(GfwClient::new());

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(AppState {
            config,
            gfw_client,
        })
        .invoke_handler(tauri::generate_handler![
            // gfw.net
            commands::gfw_login,
            commands::gfw_refresh_token,
            commands::gfw_get_user_info,
            commands::gfw_get_balance,
            commands::gfw_list_models,
            commands::gfw_list_api_keys,
            commands::gfw_create_api_key,
            commands::gfw_get_full_key,
            commands::gfw_get_daily_usage,
            commands::gfw_get_recharge_packages,
            commands::gfw_create_recharge_order,
            commands::gfw_list_sr_providers,
            // 2x.com.cn Skill 商店
            commands::skill_store_send_email_code,
            commands::skill_store_email_login,
            commands::skill_store_phone_login,
            commands::skill_store_get_profile,
            commands::skill_store_get_popular_skills,
            commands::skill_store_get_skills,
            commands::skill_store_search_skills,
            commands::skill_store_get_skill_detail,
            commands::skill_store_toggle_favorite,
            commands::skill_store_get_download_url,
            commands::skill_store_get_reviews,
            commands::skill_store_get_rankings,
            commands::skill_store_get_workflows,
            commands::skill_store_get_workflow_categories,
            commands::skill_store_get_my_skills,
            commands::skill_store_get_favorites,
            commands::skill_store_get_downloads,
            // Agent
            commands::agent_start,
            commands::agent_stop,
            commands::agent_send_message,
            commands::agent_cancel,
            // 配置
            commands::config_get,
            commands::config_set,
            commands::config_get_all,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
