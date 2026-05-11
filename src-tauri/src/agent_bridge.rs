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

    /// 查找系统上的 Python 可执行文件
    fn find_python() -> Option<String> {
        // Windows: python, python3; macOS/Linux: python3, python
        let candidates = if cfg!(target_os = "windows") {
            vec!["python", "python3", "py"]
        } else {
            vec!["python3", "python"]
        };

        for cmd in candidates {
            if let Ok(output) = std::process::Command::new(cmd)
                .arg("--version")
                .stdout(Stdio::piped())
                .stderr(Stdio::piped())
                .output()
            {
                if output.status.success() {
                    return Some(cmd.to_string());
                }
            }
        }
        None
    }

    /// 查找 Hermes Agent 安装路径
    fn find_hermes_path() -> Option<String> {
        let candidates = vec![
            // 用户目录下
            dirs::home_dir().map(|h| h.join(".hermes").join("hermes-agent").to_string_lossy().to_string()),
            // 应用自带的 resources
            std::env::current_exe().ok().and_then(|exe| {
                exe.parent().map(|p| p.join("resources").join("hermes-agent").to_string_lossy().to_string())
            }),
            // macOS app bundle
            std::env::current_exe().ok().and_then(|exe| {
                exe.parent().and_then(|p| p.parent()).map(|p| p.join("Resources").join("hermes-agent").to_string_lossy().to_string())
            }),
            // Linux 系统安装
            Some("/usr/local/lib/hermes-agent".to_string()),
            Some("/usr/lib/hermes-agent".to_string()),
        ];

        for path in candidates.into_iter().flatten() {
            let desktop_server = std::path::Path::new(&path).join("hermes_cli").join("desktop_server.py");
            if desktop_server.exists() {
                return Some(path);
            }
        }
        None
    }

    pub async fn start(&self, hermes_path_hint: &str, api_key: &str, jwt: Option<&str>) -> Result<u16, String> {
        if *self.running.read().await {
            return Err("Agent already running".into());
        }

        // 查找 Python
        let python = Self::find_python()
            .ok_or("Python not found. Please install Python 3.11+ from https://python.org")?;

        // 查找 Hermes 路径
        let hermes_path = if !hermes_path_hint.is_empty() && std::path::Path::new(hermes_path_hint).join("hermes_cli").join("desktop_server.py").exists() {
            hermes_path_hint.to_string()
        } else {
            Self::find_hermes_path()
                .ok_or("Hermes Agent not found. Please install Hermes Agent first.")?
        };

        let script = format!("{}/hermes_cli/desktop_server.py", hermes_path);

        let mut cmd = tokio::process::Command::new(&python);
        cmd.arg(&script)
            .arg("--port").arg("0").arg("--host").arg("127.0.0.1")
            .env("GFW_API_KEY", api_key).env("PYTHONUNBUFFERED", "1")
            .stdout(Stdio::piped()).stderr(Stdio::piped());

        if let Some(j) = jwt { cmd.env("GFW_JWT", j); }

        // Windows: 隐藏 console 窗口
        #[cfg(target_os = "windows")]
        {
            use std::os::windows::process::CommandExt;
            cmd.creation_flags(0x08000000); // CREATE_NO_WINDOW
        }

        let mut child = cmd.spawn().map_err(|e| format!("Failed to start agent: {}. Python: {}, Script: {}", e, python, script))?;
        let stdout = child.stdout.take().ok_or("Failed to capture agent output")?;

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

        // 读取 stderr 获取错误信息
        if let Some(mut stderr) = child.stderr.take() {
            let mut err_buf = String::new();
            use tokio::io::AsyncReadExt;
            let _ = tokio::time::timeout(
                std::time::Duration::from_secs(2),
                stderr.read_to_string(&mut err_buf)
            ).await;
            if !err_buf.is_empty() {
                let _ = child.kill().await;
                return Err(format!("Agent startup failed: {}", err_buf.chars().take(500).collect::<String>()));
            }
        }

        let _ = child.kill().await;
        Err("Agent failed to start (no port received)".into())
    }

    pub async fn send_message(&self, content: &str, model: Option<&str>) -> Result<(), String> {
        let _msg = BackendMessage::Chat {
            id: uuid::Uuid::new_v4().to_string(),
            content: content.to_string(),
            session_id: None,
            model: model.map(|s| s.to_string()),
            attachments: vec![],
        };
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
