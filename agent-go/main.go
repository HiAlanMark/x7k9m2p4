// Hi!XNS Agent Server — Go 后端
// 单二进制，可作为 Tauri sidecar 运行
// HTTP/SSE 服务，内置工具执行 + LLM Agent Loop
package main

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"os/signal"
	"path/filepath"
	"regexp"
	"runtime"
	"strconv"
	"strings"
	"syscall"
	"time"
)

// ============================================================
// 工具定义
// ============================================================

var toolDefs = []map[string]any{
	{
		"type": "function",
		"function": map[string]any{
			"name":        "run_terminal",
			"description": "在本地终端执行 shell 命令。可以运行任何命令行工具、安装软件、编译代码、查看系统信息等。",
			"parameters": map[string]any{
				"type": "object",
				"properties": map[string]any{
					"command": map[string]any{"type": "string", "description": "要执行的 shell 命令"},
					"workdir": map[string]any{"type": "string", "description": "工作目录（可选）"},
					"timeout": map[string]any{"type": "integer", "description": "超时秒数，默认 30"},
				},
				"required": []string{"command"},
			},
		},
	},
	{
		"type": "function",
		"function": map[string]any{
			"name":        "read_file",
			"description": "读取本地文件内容。支持文本文件、代码文件、配置文件等。",
			"parameters": map[string]any{
				"type": "object",
				"properties": map[string]any{
					"path":   map[string]any{"type": "string", "description": "文件路径"},
					"offset": map[string]any{"type": "integer", "description": "起始行号（从 1 开始）"},
					"limit":  map[string]any{"type": "integer", "description": "最大读取行数"},
				},
				"required": []string{"path"},
			},
		},
	},
	{
		"type": "function",
		"function": map[string]any{
			"name":        "write_file",
			"description": "写入内容到本地文件。完全覆盖文件内容，自动创建目录。",
			"parameters": map[string]any{
				"type": "object",
				"properties": map[string]any{
					"path":    map[string]any{"type": "string", "description": "文件路径"},
					"content": map[string]any{"type": "string", "description": "要写入的完整内容"},
				},
				"required": []string{"path", "content"},
			},
		},
	},
	{
		"type": "function",
		"function": map[string]any{
			"name":        "list_directory",
			"description": "列出目录下的文件和子目录。",
			"parameters": map[string]any{
				"type":       "object",
				"properties": map[string]any{"path": map[string]any{"type": "string", "description": "目录路径"}},
				"required":   []string{},
			},
		},
	},
	{
		"type": "function",
		"function": map[string]any{
			"name":        "search_files",
			"description": "在文件内容中搜索匹配的文本（类似 grep）。",
			"parameters": map[string]any{
				"type": "object",
				"properties": map[string]any{
					"pattern":   map[string]any{"type": "string", "description": "搜索的正则表达式"},
					"path":      map[string]any{"type": "string", "description": "搜索目录"},
					"file_glob": map[string]any{"type": "string", "description": "文件名过滤，如 *.py"},
				},
				"required": []string{"pattern"},
			},
		},
	},
	{
		"type": "function",
		"function": map[string]any{
			"name":        "system_info",
			"description": "获取当前系统信息：操作系统、CPU、内存、磁盘、Go版本等。",
			"parameters":  map[string]any{"type": "object", "properties": map[string]any{}, "required": []string{}},
		},
	},
}

const systemPrompt = `你是 Hi!XNS Agent，一个运行在用户电脑上的 AI 助手。你可以：
- 执行终端命令（run_terminal）
- 读写文件（read_file / write_file）
- 列出目录（list_directory）
- 搜索文件内容（search_files）
- 获取系统信息（system_info）

你运行在用户的本地机器上，可以直接操作文件系统和执行命令。
回答时使用中文。对于需要操作的任务，先使用工具获取信息再回答。`

// ============================================================
// 工具执行
// ============================================================

func executeTool(name string, args map[string]any) string {
	switch name {
	case "run_terminal":
		return toolRunTerminal(args)
	case "read_file":
		return toolReadFile(args)
	case "write_file":
		return toolWriteFile(args)
	case "list_directory":
		return toolListDir(args)
	case "search_files":
		return toolSearchFiles(args)
	case "system_info":
		return toolSystemInfo()
	default:
		return jsonStr(map[string]any{"error": "未知工具: " + name})
	}
}

func toolRunTerminal(args map[string]any) string {
	command, _ := args["command"].(string)
	workdir, _ := args["workdir"].(string)
	timeoutF, ok := args["timeout"].(float64)
	timeout := 30
	if ok {
		timeout = int(timeoutF)
	}

	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(timeout)*time.Second)
	defer cancel()

	var cmd *exec.Cmd
	if runtime.GOOS == "windows" {
		cmd = exec.CommandContext(ctx, "cmd", "/C", command)
	} else {
		cmd = exec.CommandContext(ctx, "sh", "-c", command)
	}
	if workdir != "" {
		cmd.Dir = workdir
	}

	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	err := cmd.Run()

	output := stdout.String()
	if stderr.Len() > 0 {
		output += "\n[stderr]\n" + stderr.String()
	}
	// 截断
	if len(output) > 20000 {
		output = output[:10000] + fmt.Sprintf("\n\n... [截断，共 %d 字符] ...\n\n", len(output)) + output[len(output)-5000:]
	}

	exitCode := 0
	if err != nil {
		if ctx.Err() == context.DeadlineExceeded {
			return jsonStr(map[string]any{"error": fmt.Sprintf("命令超时（%ds）", timeout), "command": command})
		}
		if exitErr, ok := err.(*exec.ExitError); ok {
			exitCode = exitErr.ExitCode()
		} else {
			return jsonStr(map[string]any{"error": err.Error(), "command": command})
		}
	}

	return jsonStr(map[string]any{"exit_code": exitCode, "output": output})
}

func toolReadFile(args map[string]any) string {
	path := expandPath(strVal(args, "path"))
	offset := intVal(args, "offset", 1)
	limit := intVal(args, "limit", 200)
	if offset < 1 {
		offset = 1
	}
	if limit > 2000 {
		limit = 2000
	}

	data, err := os.ReadFile(path)
	if err != nil {
		return jsonStr(map[string]any{"error": fmt.Sprintf("文件不存在: %s", path)})
	}

	lines := strings.Split(string(data), "\n")
	total := len(lines)
	end := offset - 1 + limit
	if end > total {
		end = total
	}

	var content strings.Builder
	for i := offset - 1; i < end; i++ {
		content.WriteString(fmt.Sprintf("%d|%s\n", i+1, lines[i]))
	}

	return jsonStr(map[string]any{"content": content.String(), "total_lines": total, "path": path})
}

func toolWriteFile(args map[string]any) string {
	path := expandPath(strVal(args, "path"))
	content := strVal(args, "content")

	dir := filepath.Dir(path)
	if dir != "" && dir != "." {
		os.MkdirAll(dir, 0755)
	}

	err := os.WriteFile(path, []byte(content), 0644)
	if err != nil {
		return jsonStr(map[string]any{"error": err.Error()})
	}
	return jsonStr(map[string]any{"success": true, "path": path, "bytes": len(content)})
}

func toolListDir(args map[string]any) string {
	path := expandPath(strVal(args, "path"))
	if path == "" {
		path = "."
	}

	entries, err := os.ReadDir(path)
	if err != nil {
		return jsonStr(map[string]any{"error": fmt.Sprintf("目录不存在: %s", path)})
	}

	items := make([]map[string]any, 0, len(entries))
	for i, e := range entries {
		if i >= 200 {
			break
		}
		info, _ := e.Info()
		size := int64(0)
		if info != nil && !e.IsDir() {
			size = info.Size()
		}
		t := "file"
		if e.IsDir() {
			t = "dir"
		}
		items = append(items, map[string]any{"name": e.Name(), "type": t, "size": size})
	}
	return jsonStr(map[string]any{"path": path, "entries": items})
}

func toolSearchFiles(args map[string]any) string {
	pattern := strVal(args, "pattern")
	path := strVal(args, "path")
	fileGlob := strVal(args, "file_glob")
	if path == "" {
		path = "."
	}

	var cmd *exec.Cmd
	if fileGlob != "" {
		cmd = exec.Command("grep", "-rn", "--include="+fileGlob, pattern, path)
	} else {
		cmd = exec.Command("grep", "-rn", pattern, path)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	cmd = exec.CommandContext(ctx, cmd.Path, cmd.Args[1:]...)

	out, _ := cmd.Output()
	lines := strings.Split(strings.TrimSpace(string(out)), "\n")
	if len(lines) > 50 {
		lines = lines[:50]
	}
	matches := make([]string, 0)
	for _, l := range lines {
		if l != "" {
			matches = append(matches, l)
		}
	}
	return jsonStr(map[string]any{"matches": matches, "count": len(matches)})
}

func toolSystemInfo() string {
	info := map[string]any{
		"os":        runtime.GOOS + " " + runtime.GOARCH,
		"hostname":  getHostname(),
		"go":        runtime.Version(),
		"cpu_count": runtime.NumCPU(),
		"cwd":       getCwd(),
		"home":      getHome(),
	}

	// 内存
	var m runtime.MemStats
	runtime.ReadMemStats(&m)
	info["agent_mem_mb"] = m.Alloc / 1024 / 1024

	// 系统内存（Linux）
	if data, err := os.ReadFile("/proc/meminfo"); err == nil {
		for _, line := range strings.Split(string(data), "\n") {
			if strings.HasPrefix(line, "MemTotal:") {
				parts := strings.Fields(line)
				if len(parts) >= 2 {
					if kb, e := strconv.ParseInt(parts[1], 10, 64); e == nil {
						info["mem_total_gb"] = float64(kb) / 1024 / 1024
					}
				}
			}
			if strings.HasPrefix(line, "MemAvailable:") {
				parts := strings.Fields(line)
				if len(parts) >= 2 {
					if kb, e := strconv.ParseInt(parts[1], 10, 64); e == nil {
						info["mem_available_gb"] = float64(kb) / 1024 / 1024
					}
				}
			}
		}
	}

	// hostname 补充
	if out, err := exec.Command("uname", "-r").Output(); err == nil {
		info["kernel"] = strings.TrimSpace(string(out))
	}

	return jsonStr(info)
}

// ============================================================
// Agent Loop
// ============================================================

type sseWriter struct {
	w       http.ResponseWriter
	flusher http.Flusher
}

func (s *sseWriter) send(data map[string]any) {
	b, _ := json.Marshal(data)
	fmt.Fprintf(s.w, "data: %s\n\n", b)
	s.flusher.Flush()
}

func agentLoop(sse *sseWriter, messages []map[string]any, apiBase, apiKey, model string) {
	maxIter := 15
	client := &http.Client{Timeout: 120 * time.Second}

	for iter := 0; iter < maxIter; iter++ {
		body := map[string]any{
			"model":    model,
			"messages": messages,
			"tools":    toolDefs,
			"stream":   true,
		}
		bodyBytes, _ := json.Marshal(body)

		req, err := http.NewRequest("POST", apiBase+"/chat/completions", bytes.NewReader(bodyBytes))
		if err != nil {
			sse.send(map[string]any{"type": "error", "message": err.Error()})
			return
		}
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+apiKey)

		resp, err := client.Do(req)
		if err != nil {
			sse.send(map[string]any{"type": "error", "message": "请求失败: " + err.Error()})
			return
		}

		if resp.StatusCode != 200 {
			errBody, _ := io.ReadAll(resp.Body)
			resp.Body.Close()
			sse.send(map[string]any{"type": "error", "message": fmt.Sprintf("API 错误 (%d): %s", resp.StatusCode, truncate(string(errBody), 500))})
			return
		}

		// 解析 SSE 流
		var contentParts []string
		toolCalls := make(map[int]map[string]string) // index -> {id, name, arguments}

		scanner := bufio.NewScanner(resp.Body)
		for scanner.Scan() {
			line := scanner.Text()
			if !strings.HasPrefix(line, "data: ") {
				continue
			}
			data := strings.TrimSpace(line[6:])
			if data == "[DONE]" {
				break
			}

			var parsed map[string]any
			if err := json.Unmarshal([]byte(data), &parsed); err != nil {
				continue
			}

			choices, _ := parsed["choices"].([]any)
			if len(choices) == 0 {
				continue
			}
			choice, _ := choices[0].(map[string]any)
			delta, _ := choice["delta"].(map[string]any)

			// 文本
			if c, ok := delta["content"].(string); ok && c != "" {
				contentParts = append(contentParts, c)
				sse.send(map[string]any{"type": "text", "content": c})
			}

			// Tool calls
			if tcs, ok := delta["tool_calls"].([]any); ok {
				for _, tc := range tcs {
					tcMap, _ := tc.(map[string]any)
					idx := int(floatVal(tcMap, "index", 0))
					if _, exists := toolCalls[idx]; !exists {
						toolCalls[idx] = map[string]string{"id": "", "name": "", "arguments": ""}
					}
					if id, ok := tcMap["id"].(string); ok && id != "" {
						toolCalls[idx]["id"] = id
					}
					if fn, ok := tcMap["function"].(map[string]any); ok {
						if n, ok := fn["name"].(string); ok && n != "" {
							toolCalls[idx]["name"] = n
						}
						if a, ok := fn["arguments"].(string); ok {
							toolCalls[idx]["arguments"] += a
						}
					}
				}
			}

			// Usage
			if usage, ok := parsed["usage"].(map[string]any); ok {
				sse.send(map[string]any{"type": "usage", "prompt_tokens": usage["prompt_tokens"], "completion_tokens": usage["completion_tokens"], "total_tokens": usage["total_tokens"]})
			}
		}
		resp.Body.Close()

		fullContent := strings.Join(contentParts, "")

		// 没有 tool calls → 结束
		if len(toolCalls) == 0 {
			messages = append(messages, map[string]any{"role": "assistant", "content": fullContent})
			sse.send(map[string]any{"type": "done", "content": fullContent})
			return
		}

		// 有 tool calls → 执行
		tcList := make([]map[string]any, 0)
		for i := 0; i < len(toolCalls); i++ {
			tc := toolCalls[i]
			tcList = append(tcList, map[string]any{
				"id":   tc["id"],
				"type": "function",
				"function": map[string]any{
					"name":      tc["name"],
					"arguments": tc["arguments"],
				},
			})
		}

		assistantMsg := map[string]any{"role": "assistant", "tool_calls": tcList}
		if fullContent != "" {
			assistantMsg["content"] = fullContent
		}
		messages = append(messages, assistantMsg)

		for _, tc := range tcList {
			fn, _ := tc["function"].(map[string]any)
			toolName, _ := fn["name"].(string)
			argsStr, _ := fn["arguments"].(string)
			tcID, _ := tc["id"].(string)

			var toolArgs map[string]any
			json.Unmarshal([]byte(argsStr), &toolArgs)
			if toolArgs == nil {
				toolArgs = map[string]any{}
			}

			sse.send(map[string]any{"type": "tool_call", "id": tcID, "tool": toolName, "args": toolArgs, "status": "running"})

			t0 := time.Now()
			result := executeTool(toolName, toolArgs)
			duration := time.Since(t0).Seconds()

			sse.send(map[string]any{"type": "tool_result", "id": tcID, "tool": toolName, "result": truncate(result, 5000), "duration": duration, "status": "completed"})

			messages = append(messages, map[string]any{
				"role":         "tool",
				"tool_call_id": tcID,
				"content":      result,
			})
		}
	}

	sse.send(map[string]any{"type": "error", "message": fmt.Sprintf("Agent 已达最大迭代次数 (%d)", maxIter)})
}

// ============================================================
// HTTP Handlers
// ============================================================

func handleHealth(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	tools := make([]string, len(toolDefs))
	for i, t := range toolDefs {
		fn, _ := t["function"].(map[string]any)
		tools[i], _ = fn["name"].(string)
	}
	json.NewEncoder(w).Encode(map[string]any{
		"status":   "ok",
		"agent":    "Hi!XNS Agent",
		"version":  "0.1.0",
		"runtime":  "go",
		"tools":    tools,
		"platform": runtime.GOOS + " " + runtime.GOARCH,
	})
}

func handleChat(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(204)
		return
	}

	var body struct {
		Content  string           `json:"content"`
		Messages []map[string]any `json:"messages"`
		APIBase  string           `json:"api_base"`
		APIKey   string           `json:"api_key"`
		Model    string           `json:"model"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error":"无效的 JSON"}`, 400)
		return
	}
	if body.APIBase == "" || body.APIKey == "" || body.Model == "" {
		http.Error(w, `{"error":"需要 api_base, api_key, model"}`, 400)
		return
	}

	// SSE headers
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "不支持 SSE", 500)
		return
	}

	sse := &sseWriter{w: w, flusher: flusher}

	// 构建消息
	messages := []map[string]any{{"role": "system", "content": systemPrompt}}
	messages = append(messages, body.Messages...)
	if body.Content != "" {
		messages = append(messages, map[string]any{"role": "user", "content": body.Content})
	}

	agentLoop(sse, messages, body.APIBase, body.APIKey, body.Model)

	fmt.Fprint(w, "data: [DONE]\n\n")
	flusher.Flush()
}

func setCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

// ============================================================
// Helpers
// ============================================================

func jsonStr(v any) string {
	b, _ := json.Marshal(v)
	return string(b)
}

func strVal(m map[string]any, key string) string {
	v, _ := m[key].(string)
	return v
}

func intVal(m map[string]any, key string, def int) int {
	if v, ok := m[key].(float64); ok {
		return int(v)
	}
	return def
}

func floatVal(m map[string]any, key string, def float64) float64 {
	if v, ok := m[key].(float64); ok {
		return v
	}
	return def
}

func expandPath(p string) string {
	if strings.HasPrefix(p, "~/") {
		home, _ := os.UserHomeDir()
		return filepath.Join(home, p[2:])
	}
	return p
}

func truncate(s string, n int) string {
	if len(s) > n {
		return s[:n] + "..."
	}
	return s
}

func getHostname() string {
	h, _ := os.Hostname()
	return h
}

func getCwd() string {
	d, _ := os.Getwd()
	return d
}

func getHome() string {
	h, _ := os.UserHomeDir()
	return h
}

// ============================================================
// Hermes 子进程管理（可选）
// ============================================================

func findHermes() string {
	// 检测 hermes 命令是否可用
	if path, err := exec.LookPath("hermes"); err == nil {
		return path
	}
	// 检测常见安装路径
	candidates := []string{
		filepath.Join(getHome(), ".hermes", "bin", "hermes"),
		"/usr/local/bin/hermes",
	}
	for _, c := range candidates {
		if _, err := os.Stat(c); err == nil {
			return c
		}
	}
	return ""
}

// ============================================================
// Main
// ============================================================

func main() {
	port := "9800"
	host := "127.0.0.1"

	for i, arg := range os.Args {
		if arg == "--port" && i+1 < len(os.Args) {
			port = os.Args[i+1]
		}
		if arg == "--host" && i+1 < len(os.Args) {
			host = os.Args[i+1]
		}
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/v1/agent/health", handleHealth)
	mux.HandleFunc("/v1/agent/chat", handleChat)

	addr := host + ":" + port

	// 检测 Hermes
	hermesPath := findHermes()
	if hermesPath != "" {
		log.Printf("[Hi!XNS] 检测到 Hermes Agent: %s", hermesPath)
	}

	tools := make([]string, len(toolDefs))
	for i, t := range toolDefs {
		fn, _ := t["function"].(map[string]any)
		tools[i], _ = fn["name"].(string)
	}

	log.Printf("[Hi!XNS Agent] Go %s | %s %s", runtime.Version(), runtime.GOOS, runtime.GOARCH)
	log.Printf("[Hi!XNS Agent] 工具: %s", strings.Join(tools, ", "))
	log.Printf("[Hi!XNS Agent] 监听: http://%s", addr)

	server := &http.Server{Addr: addr, Handler: mux}

	// 优雅关闭
	go func() {
		sigCh := make(chan os.Signal, 1)
		signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
		<-sigCh
		log.Println("[Hi!XNS Agent] 正在关闭...")
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		server.Shutdown(ctx)
	}()

	if err := server.ListenAndServe(); err != http.ErrServerClosed {
		log.Fatalf("[Hi!XNS Agent] 启动失败: %v", err)
	}
	log.Println("[Hi!XNS Agent] 已关闭")
}

// Regex for search
var _ = regexp.Compile
