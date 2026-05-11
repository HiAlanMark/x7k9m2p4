use tokio::process::Command;
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

    pub async fn start(&self, hermes_path: &str, api_key: &str, jwt: Option<&str>) -> Result<u16, String> {
        if *self.running.read().await {
            return Err("Agent already running".into());
        }

        let mut cmd = Command::new("python3");
        cmd.arg(format!("{}/hermes_cli/desktop_server.py", hermes_path))
            .arg("--port").arg("0").arg("--host").arg("127.0.0.1")
            .env("GFW_API_KEY", api_key).env("PYTHONUNBUFFERED", "1")
            .stdout(Stdio::piped()).stderr(Stdio::piped());
        if let Some(j) = jwt { cmd.env("GFW_JWT", j); }

        let mut child = cmd.spawn().map_err(|e| format!("spawn: {}", e))?;
        let stdout = child.stdout.take().ok_or("no stdout")?;

        use tokio::io::AsyncBufReadExt;
        let mut reader = tokio::io::BufReader::new(stdout);
        let mut line = String::new();

        match tokio::time::timeout(std::time::Duration::from_secs(15), reader.read_line(&mut line)).await {
            Ok(Ok(_)) => {
                if let Some(s) = line.strip_prefix("HERMES_DESKTOP_PORT:") {
                    if let Ok(port) = s.trim().parse::<u16>() {
                        *self.running.write().await = true;
                        return Ok(port);
                    }
                }
            }
            _ => {}
        }
        let _ = child.kill().await;
        Err("Failed to read port".into())
    }

    pub async fn send_message(&self, content: &str, model: Option<&str>) -> Result<(), String> {
        let _msg = BackendMessage::Chat {
            id: uuid::Uuid::new_v4().to_string(),
            content: content.to_string(),
            session_id: None,
            model: model.map(|s| s.to_string()),
            attachments: vec![],
        };
        // TODO: send via WebSocket when connected
        Ok(())
    }

    pub async fn cancel(&self, _msg_id: &str) -> Result<(), String> {
        Ok(())
    }

    pub async fn stop(&self) -> Result<(), String> {
        *self.running.write().await = false;
        Ok(())
    }
}
