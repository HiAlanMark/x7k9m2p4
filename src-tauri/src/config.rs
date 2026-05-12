use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::fs;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    pub gfw: GfwConfig,
    pub skill_store: SkillStoreConfig,
    pub agent: AgentConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GfwConfig {
    pub management_base_url: String,
    pub ai_base_url: String,
    pub sr_base_url: String,
    pub default_model: String,
    pub api_key_id: Option<u64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SkillStoreConfig {
    pub base_url: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentConfig {
    pub context_length: u64,
    pub max_iterations: u32,
    pub streaming: bool,
    pub timeout_secs: u64,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            gfw: GfwConfig {
                management_base_url: "https://api.gfw.net/api/v1".to_string(),
                ai_base_url: "https://api.gfw.net/v1".to_string(),
                sr_base_url: "https://api.gfw.net/sr/v1".to_string(),
                default_model: "gpt-4o-mini".to_string(),
                api_key_id: None,
            },
            skill_store: SkillStoreConfig {
                base_url: "https://api.2x.com.cn/api/v1".to_string(),
            },
            agent: AgentConfig {
                context_length: 128000,
                max_iterations: 90,
                streaming: true,
                timeout_secs: 30,
            },
        }
    }
}

impl AppConfig {
    pub fn load() -> Self {
        let config_path = Self::config_path();
        if config_path.exists() {
            if let Ok(content) = fs::read_to_string(&config_path) {
                if let Ok(config) = serde_json::from_str(&content) {
                    return config;
                }
            }
        }
        Self::default()
    }

    pub fn save(&self) -> Result<(), std::io::Error> {
        let config_path = Self::config_path();
        if let Some(parent) = config_path.parent() {
            fs::create_dir_all(parent)?;
        }
        let content = serde_json::to_string_pretty(self)
            .map_err(|e| std::io::Error::new(std::io::ErrorKind::Other, e))?;
        fs::write(&config_path, content)?;
        Ok(())
    }

    fn config_path() -> PathBuf {
        let base = dirs::config_dir()
            .unwrap_or_else(|| PathBuf::from("."));
        base.join("hixns").join("config.json")
    }
}
