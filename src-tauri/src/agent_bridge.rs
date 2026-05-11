use std::sync::Arc;
use tokio::sync::{mpsc, RwLock};
use tokio::process::{Command, Child};
use std::process::Stdio;
use tokio_tungstenite::connect_async;
use futures_util::{SinkExt, StreamExt};
use tokio_tungstenite::tungstenite::Message;
use crate::gfw_types::{BackendMessage, GfwConfigUpdate};

pub struct AgentBridge {
    state: Arc<RwLock<AgentState>>,
    tx: Arc<RwLock<Option<mpsc::UnboundedSender<Message>>>>,
}

struct AgentState {
    process: Option<Child>,
    port: Option<u16>,
    is_running: bool,
}

impl AgentBridge {
    pub fn new() -> Self {
        Self {
            state: Arc::new(RwLock::new(AgentState {
                process: None,
                port: None,
                is_running: false,
            })),
            tx: Arc::new(RwLock::new(None)),
        }
    }

    pub async fn start(&self, hermes_path: &str, api_key: &str, jwt: Option<&str>) -> Result<u16, String> {
        let mut state = self.state.write().await;
        if state.is_running {
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

        if let Some(jwt_val) = jwt {
            cmd.env("GFW_JWT", jwt_val);
        }

        let mut child = cmd.spawn().map_err(|e| format!("Failed to start agent: {}", e))?;

        if let Some(stdout) = child.stdout.take() {
            use tokio::io::AsyncBufReadExt;
            let mut reader = tokio::io::BufReader::new(stdout);
            let mut line = String::new();

            let read_result = tokio::time::timeout(
                std::time::Duration::from_secs(10),
                reader.read_line(&mut line)
            ).await;

            if let Ok(Ok(_)) = read_result {
                if let Some(port_str) = line.strip_prefix("HERMES_DESKTOP_PORT:") {
                    if let Ok(port) = port_str.trim().parse::<u16>() {
                        state.process = Some(child);
                        state.port = Some(port);
                        state.is_running = true;
                        drop(state);
                        return Ok(port);
                    }
                }
            }
        }

        let _ = child.kill().await;
        Err("Failed to get agent port".to_string())
    }

    pub async fn send_message(&self, content: &str, model: Option<&str>) -> Result<(), String> {
        let tx_guard = self.tx.read().await;
        let tx = tx_guard.as_ref().ok_or("Agent not connected")?;

        let msg = BackendMessage::Chat {
            id: uuid::Uuid::new_v4().to_string(),
            content: content.to_string(),
            session_id: None,
            model: model.map(|s| s.to_string()),
            attachments: vec![],
        };

        let json = serde_json::to_string(&msg).map_err(|e| e.to_string())?;
        tx.send(Message::Text(json.into())).map_err(|e| e.to_string())
    }

    pub async fn cancel(&self, msg_id: &str) -> Result<(), String> {
        let tx_guard = self.tx.read().await;
        let tx = tx_guard.as_ref().ok_or("Agent not connected")?;

        let msg = BackendMessage::Cancel { id: msg_id.to_string() };
        let json = serde_json::to_string(&msg).map_err(|e| e.to_string())?;
        tx.send(Message::Text(json.into())).map_err(|e| e.to_string())
    }

    pub async fn stop(&self) -> Result<(), String> {
        let mut state = self.state.write().await;
        *self.tx.write().await = None;
        if let Some(ref mut child) = state.process {
            let _ = child.kill().await;
        }
        state.process = None;
        state.port = None;
        state.is_running = false;
        Ok(())
    }
}
