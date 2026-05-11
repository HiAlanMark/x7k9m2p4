use std::sync::Arc;
use tokio::sync::{mpsc, RwLock};
use tokio::process::Command;
use std::process::Stdio;
use tokio_tungstenite::connect_async;
use futures_util::{SinkExt, StreamExt};
use crate::gfw_types::BackendMessage;

pub struct AgentBridge {
    port: Arc<RwLock<Option<u16>>>,
    running: Arc<RwLock<bool>>,
    tx: Arc<RwLock<Option<mpsc::UnboundedSender<String>>>>,
}

impl AgentBridge {
    pub fn new() -> Self {
        Self {
            port: Arc::new(RwLock::new(None)),
            running: Arc::new(RwLock::new(false)),
            tx: Arc::new(RwLock::new(None)),
        }
    }

    pub async fn start(&self, hermes_path: &str, api_key: &str, jwt: Option<&str>) -> Result<u16, String> {
        if *self.running.read().await {
            return Err("Agent is already running".to_string());
        }

        let mut cmd = Command::new("python3");
        cmd.arg(format!("{}/hermes_cli/desktop_server.py", hermes_path))
            .arg("--port").arg("0")
            .arg("--host").arg("127.0.0.1")
            .env("GFW_API_KEY", api_key)
            .env("PYTHONUNBUFFERED", "1")
            .stdout(Stdio::piped())
            .stderr(Stdio::piped());

        if let Some(j) = jwt {
            cmd.env("GFW_JWT", j);
        }

        let mut child = cmd.spawn().map_err(|e| format!("spawn failed: {}", e))?;

        let stdout = child.stdout.take().ok_or("no stdout")?;
        use tokio::io::AsyncBufReadExt;
        let mut reader = tokio::io::BufReader::new(stdout);
        let mut line = String::new();

        let result = tokio::time::timeout(
            std::time::Duration::from_secs(15),
            reader.read_line(&mut line),
        ).await;

        match result {
            Ok(Ok(_)) => {
                if let Some(port_str) = line.strip_prefix("HERMES_DESKTOP_PORT:") {
                    if let Ok(port) = port_str.trim().parse::<u16>() {
                        *self.port.write().await = Some(port);
                        *self.running.write().await = true;
                        return Ok(port);
                    }
                }
            }
            _ => {}
        }

        let _ = child.kill().await;
        Err("Failed to read agent port".to_string())
    }

    pub async fn send_message(&self, content: &str, model: Option<&str>) -> Result<(), String> {
        let msg = BackendMessage::Chat {
            id: uuid::Uuid::new_v4().to_string(),
            content: content.to_string(),
            session_id: None,
            model: model.map(|s| s.to_string()),
            attachments: vec![],
        };
        let json = serde_json::to_string(&msg).map_err(|e| e.to_string())?;

        let tx_guard = self.tx.read().await;
        if let Some(tx) = tx_guard.as_ref() {
            tx.send(json).map_err(|e| e.to_string())
        } else {
            Err("Agent not connected".to_string())
        }
    }

    pub async fn cancel(&self, msg_id: &str) -> Result<(), String> {
        let msg = BackendMessage::Cancel { id: msg_id.to_string() };
        let json = serde_json::to_string(&msg).map_err(|e| e.to_string())?;

        let tx_guard = self.tx.read().await;
        if let Some(tx) = tx_guard.as_ref() {
            tx.send(json).map_err(|e| e.to_string())
        } else {
            Err("Agent not connected".to_string())
        }
    }

    pub async fn stop(&self) -> Result<(), String> {
        *self.tx.write().await = None;
        *self.running.write().await = false;
        *self.port.write().await = None;
        Ok(())
    }
}
