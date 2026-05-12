use std::process::Stdio;
use crate::gfw_types::BackendMessage;
use tokio::sync::RwLock;
use std::sync::Arc;

pub struct AgentBridge {
    running: Arc<RwLock<bool>>,
}

impl AgentBridge {
    pub fn new() -> Self {
        Self { running: Arc::new(RwLock::new(false)) }
    }

    /// 查找 Go Agent 二进制文件
    fn find_agent_binary() -> Option<String> {
        let exe_dir = std::env::current_exe().ok()
            .and_then(|e| e.parent().map(|p| p.to_path_buf()));

        let candidates = vec![
            // 开发模式: 项目目录下
            exe_dir.as_ref().map(|p| p.join("../agent-go/hixns-agent").to_string_lossy().to_string()),
            // Tauri sidecar: 同目录
            exe_dir.as_ref().map(|p| p.join("hixns-agent").to_string_lossy().to_string()),
            // macOS app bundle
            std::env::current_exe().ok().and_then(|exe| {
                exe.parent().and_then(|p| p.parent()).map(|p| p.join("Resources/hixns-agent").to_string_lossy().to_string())
            }),
            // 系统路径
            Some("/usr/local/bin/hixns-agent".to_string()),
        ];

        for path in candidates.into_iter().flatten() {
            if std::path::Path::new(&path).exists() {
                return Some(path);
            }
        }
        None
    }

    pub async fn start(&self, _hermes_path: &str) -> Result<u16, String> {
        let mut running = self.running.write().await;
        if *running {
            return Ok(9800);
        }

        let agent_bin = Self::find_agent_binary()
            .ok_or("Hi!XNS Agent binary not found. Build with: cd agent-go && go build -o hixns-agent")?;

        let mut cmd = tokio::process::Command::new(&agent_bin);
        cmd.arg("--port").arg("9800")
           .arg("--host").arg("127.0.0.1")
           .stdout(Stdio::piped()).stderr(Stdio::piped());

        cmd.spawn().map_err(|e| format!("Failed to start agent: {}. Binary: {}", e, agent_bin))?;

        *running = true;
        Ok(9800)
    }

    pub async fn stop(&self) {
        let mut running = self.running.write().await;
        *running = false;
    }

    pub async fn is_running(&self) -> bool {
        *self.running.read().await
    }

    pub async fn send_message(&self, _message: &str, _model: &str) -> Result<BackendMessage, String> {
        Err("Use HTTP API at port 9800 instead".to_string())
    }
}
