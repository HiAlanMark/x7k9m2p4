use std::process::{Child, Stdio};
use std::sync::Arc;
use tokio::sync::{mpsc, RwLock};
use tokio::process::Command;
use tokio_tungstenite::connect_async;
use futures_util::{SinkExt, StreamExt};
use tokio_tungstenite::tungstenite::Message;
use crate::gfw_types::{FrontendMessage, BackendMessage, GfwConfigUpdate};

pub struct AgentBridge {
    state: Arc<RwLock<AgentState>>,
    tx: Arc<RwLock<Option<mpsc::UnboundedSender<Message>>>>,
}

struct AgentState {
    process: Option<Child>,
    port: Option<u16>,
    is_running: bool,
    hermes_path: Option<String>,
}

impl AgentBridge {
    pub fn new() -> Self {
        Self {
            state: Arc::new(RwLock::new(AgentState {
                process: None,
                port: None,
                is_running: false,
                hermes_path: None,
            })),
            tx: Arc::new(RwLock::new(None)),
        }
    }

    /// 启动 Hermes Agent 子进程
    pub async fn start(&self, hermes_path: &str, api_key: &str, jwt: Option<&str>) -> Result<u16, String> {
        let mut state = self.state.write().await;

        if state.is_running {
            return Err("Agent is already running".to_string());
        }

        // 构建环境变量
        let mut cmd = Command::new("python");
        cmd.arg(format!("{}/hermes_cli/desktop_server.py", hermes_path))
            .arg("--port")
            .arg("0")
            .arg("--host")
            .arg("127.0.0.1")
            .env("GFW_API_KEY", api_key)
            .env("PYTHONUNBUFFERED", "1")
            .stdout(Stdio::piped())
            .stderr(Stdio::piped());

        if let Some(jwt_val) = jwt {
            cmd.env("GFW_JWT", jwt_val);
        }

        let mut child = cmd.spawn().map_err(|e| format!("Failed to start agent: {}", e))?;

        // 读取端口号
        if let Some(mut stdout) = child.stdout.take() {
            use tokio::io::AsyncBufReadExt;
            let mut reader = tokio::io::BufReader::new(stdout);
            let mut line = String::new();

            // 读取第一行获取端口
            let read_result = tokio::time::timeout(
                std::time::Duration::from_secs(10),
                reader.read_line(&mut line)
            ).await;

            match read_result {
                Ok(Ok(_)) => {
                    if let Some(port_str) = line.strip_prefix("HERMES_DESKTOP_PORT:") {
                        if let Ok(port) = port_str.trim().parse::<u16>() {
                            state.process = Some(child);
                            state.port = Some(port);
                            state.is_running = true;
                            state.hermes_path = Some(hermes_path.to_string());

                            drop(state);

                            // 启动 WebSocket 连接
                            self.connect_to_agent(port).await?;

                            return Ok(port);
                        }
                    }
                }
                _ => {}
            }
        }

        // 如果读取失败，尝试 kill 子进程
        let _ = child.kill();
        Err("Failed to get agent port from startup output".to_string())
    }

    /// 连接到 Agent 的 WebSocket
    async fn connect_to_agent(&self, port: u16) -> Result<(), String> {
        let url = format!("ws://127.0.0.1:{}/ws", port);

        let (ws_stream, _) = connect_async(&url)
            .await
            .map_err(|e| format!("Failed to connect to agent: {}", e))?;

        let (mut write, mut read) = ws_stream.split();

        // 创建消息通道
        let (tx, mut rx) = mpsc::unbounded_channel::<Message>();
        *self.tx.write().await = Some(tx);

        // 启动接收任务
        let state_clone = self.state.clone();
        tokio::spawn(async move {
            while let Some(msg) = read.next().await {
                match msg {
                    Ok(Message::Text(text)) => {
                        // 解析为 FrontendMessage 并转发给前端
                        // 实际实现中会通过 Tauri event 发送给前端
                        log::info!("Agent message: {}", text);
                    }
                    Ok(Message::Close(_)) => {
                        log::info!("Agent WebSocket closed");
                        let mut s = state_clone.write().await;
                        s.is_running = false;
                        break;
                    }
                    Err(e) => {
                        log::error!("WebSocket error: {}", e);
                        break;
                    }
                    _ => {}
                }
            }
        });

        // 启动发送任务
        tokio::spawn(async move {
            while let Some(msg) = rx.recv().await {
                if let Err(e) = write.send(msg).await {
                    log::error!("Failed to send message to agent: {}", e);
                    break;
                }
            }
        });

        Ok(())
    }

    /// 发送消息到 Agent
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
        tx.send(Message::Text(json)).map_err(|e| e.to_string())
    }

    /// 取消当前请求
    pub async fn cancel(&self, msg_id: &str) -> Result<(), String> {
        let tx_guard = self.tx.read().await;
        let tx = tx_guard.as_ref().ok_or("Agent not connected")?;

        let msg = BackendMessage::Cancel {
            id: msg_id.to_string(),
        };

        let json = serde_json::to_string(&msg).map_err(|e| e.to_string())?;
        tx.send(Message::Text(json)).map_err(|e| e.to_string())
    }

    /// 更新配置
    pub async fn update_config(
        &self,
        gfw: Option<GfwConfigUpdate>,
        gfw_jwt: Option<String>,
    ) -> Result<(), String> {
        let tx_guard = self.tx.read().await;
        let tx = tx_guard.as_ref().ok_or("Agent not connected")?;

        let msg = BackendMessage::ConfigUpdate {
            gfw,
            gfw_jwt,
        };

        let json = serde_json::to_string(&msg).map_err(|e| e.to_string())?;
        tx.send(Message::Text(json)).map_err(|e| e.to_string())
    }

    /// 停止 Agent
    pub async fn stop(&self) -> Result<(), String> {
        let mut state = self.state.write().await;

        // 关闭 WebSocket 连接
        *self.tx.write().await = None;

        // 终止子进程
        if let Some(ref mut child) = state.process {
            let _ = child.kill().await;
        }

        state.process = None;
        state.port = None;
        state.is_running = false;

        Ok(())
    }

    pub async fn is_running(&self) -> bool {
        self.state.read().await.is_running
    }

    pub async fn get_port(&self) -> Option<u16> {
        self.state.read().await.port
    }
}
