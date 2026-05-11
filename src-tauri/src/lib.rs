pub mod gfw_client;
pub mod gfw_types;
pub mod skill_store;
pub mod agent_bridge;
pub mod config;
pub mod commands;

use std::sync::Arc;
use tokio::sync::RwLock;
use gfw_client::GfwClient;
use config::AppConfig;

pub struct AppState {
    pub config: Arc<RwLock<AppConfig>>,
    pub gfw_client: Arc<GfwClient>,
}
