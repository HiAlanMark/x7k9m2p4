// Hi!XNS Agent Server — Go 后端
// 单二进制，可作为 Tauri sidecar 运行
// HTTP/SSE 服务，内置工具执行 + LLM Agent Loop
package main

import (
	"archive/zip"
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
				"properties": map[string]any{"path": map[string]any{"type": "string", "description": "目录路径，默认当前目录"}},
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
			"parameters":  map[string]any{"type": "object", "properties": map[string]any{}},
		},
	},
}

const systemPrompt = `你是 Hi!XNS Agent，一个运行在用户电脑上的 AI 助手。

# 可用工具

你可以调用以下工具来完成任务。调用工具时，使用如下格式（必须严格遵守）：

<tool_call>
{"name": "工具名", "arguments": {"参数名": "参数值"}}
</tool_call>

可以一次调用多个工具，每个工具调用都需要用 <tool_call></tool_call> 包裹。

## run_terminal
执行本地终端 shell 命令。
参数: command (string, 必填), workdir (string, 可选), timeout (integer, 可选, 默认30)

## read_file
读取本地文件内容。
参数: path (string, 必填), offset (integer, 起始行号从1开始), limit (integer, 最大行数)

## write_file
写入内容到本地文件，完全覆盖。
参数: path (string, 必填), content (string, 必填)

## list_directory
列出目录下的文件和子目录。
参数: path (string, 默认当前目录)

## search_files
在文件内容中搜索匹配文本。
参数: pattern (string, 必填, 正则), path (string, 搜索目录), file_glob (string, 如 *.py)

## system_info
获取当前系统信息：操作系统、CPU、内存等。
参数: 无

# 规则
- 你运行在用户的本地机器上，可以直接操作文件系统和执行命令
- 回答时使用中文
- 对于需要操作的任务，先调用工具获取信息再回答
- 工具调用的结果会以 <tool_result> 标签返回给你
- 你可以根据工具结果继续调用工具或直接回答用户`

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

// isPromptBasedModel 判断是否需要 prompt-based tool calling
// DashScope/Qwen 系列用 <tool_call> XML 标签，其他用原生 function calling
func isPromptBasedModel(model, apiBase string) bool {
	lower := strings.ToLower(model)
	base := strings.ToLower(apiBase)
	if strings.Contains(base, "dashscope") {
		return true
	}
	if strings.HasPrefix(lower, "qwen") {
		return true
	}
	return false
}

// isDangerousCommand 检查命令是否需要用户审批
func isDangerousCommand(cmd string) bool {
	lower := strings.ToLower(cmd)
	dangerous := []string{
		"rm -rf", "rm -r /", "mkfs", "dd if=", "chmod -R 777",
		"shutdown", "reboot", "init 0", "init 6",
		"git reset --hard", "git push --force", "git push -f",
		"> /dev/", "kill -9", "killall", "pkill",
		"docker rm", "docker rmi", "docker system prune",
		"DROP TABLE", "DROP DATABASE", "TRUNCATE",
		"format ", "fdisk", "parted",
		"curl | sh", "curl | bash", "wget | sh",
		"npm publish", "pip install --", "sudo ",
	}
	for _, d := range dangerous {
		if strings.Contains(lower, strings.ToLower(d)) {
			return true
		}
	}
	return false
}

func agentLoop(sse *sseWriter, messages []map[string]any, apiBase, apiKey, model string) {
	maxIter := 15
	client := &http.Client{Timeout: 120 * time.Second}
	toolCallRe := regexp.MustCompile(`(?s)<tool_call>\s*(\{.*?\})\s*</tool_call>`)
	totalPrompt := 0
	totalCompletion := 0

	// 判断是否使用 prompt-based tool calling
	// DashScope/Qwen 系列用 prompt-based，其他用原生 function calling
	usePromptTools := isPromptBasedModel(model, apiBase)
	log.Printf("[agentLoop] model=%s usePromptTools=%v", model, usePromptTools)

	for iter := 0; iter < maxIter; iter++ {
		log.Printf("[agentLoop] 开始第 %d 轮，消息数: %d", iter, len(messages))
		sse.send(map[string]any{"type": "status", "iteration": iter + 1, "max_iterations": maxIter, "message": fmt.Sprintf("第 %d 轮推理中...", iter+1)})

		body := map[string]any{
			"model":          model,
			"messages":       messages,
			"stream":         true,
			"stream_options": map[string]any{"include_usage": true},
		}
		// 原生 function calling: 传 tools 参数
		if !usePromptTools {
			body["tools"] = toolDefs
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

		// 流式读取完整内容
		var fullContent strings.Builder
		// 原生 function calling: 累积 tool_calls
		var nativeToolCalls []struct {
			ID   string
			Name string
			Args string
		}
		scanner := bufio.NewScanner(resp.Body)
		scanner.Buffer(make([]byte, 0, 64*1024), 1024*1024)
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

			if usage, ok := parsed["usage"].(map[string]any); ok {
				pt := int(floatVal(usage, "prompt_tokens", 0))
				ct := int(floatVal(usage, "completion_tokens", 0))
				totalPrompt += pt
				totalCompletion += ct
			}

			if len(choices) == 0 {
				continue
			}
			choice, _ := choices[0].(map[string]any)
			delta, _ := choice["delta"].(map[string]any)

			if c, ok := delta["content"].(string); ok && c != "" {
				fullContent.WriteString(c)
				sse.send(map[string]any{"type": "text_delta", "content": c})
			}

			// 原生 function calling: 解析 delta.tool_calls
			if tcs, ok := delta["tool_calls"].([]any); ok && !usePromptTools {
				for _, tcRaw := range tcs {
					tc, _ := tcRaw.(map[string]any)
					idx := int(floatVal(tc, "index", 0))
					fn, _ := tc["function"].(map[string]any)

					// 扩展 slice
					for len(nativeToolCalls) <= idx {
						nativeToolCalls = append(nativeToolCalls, struct{ ID, Name, Args string }{})
					}

					if id, ok := tc["id"].(string); ok && id != "" {
						nativeToolCalls[idx].ID = id
					}
					if name, ok := fn["name"].(string); ok && name != "" {
						nativeToolCalls[idx].Name = name
					}
					if args, ok := fn["arguments"].(string); ok {
						nativeToolCalls[idx].Args += args
					}
				}
			}
		}
		resp.Body.Close()

		text := fullContent.String()

		// === 原生 function calling 模式 ===
		if !usePromptTools && len(nativeToolCalls) > 0 {
			log.Printf("[agentLoop] iter=%d 原生 function calling: %d 个工具调用", iter, len(nativeToolCalls))

			// 先推送文本
			if text != "" {
				sse.send(map[string]any{"type": "text", "content": text})
			}

			// 构造 assistant 消息（含 tool_calls）
			var apiToolCalls []map[string]any
			var toolResults strings.Builder
			for i, ntc := range nativeToolCalls {
				if ntc.Name == "" {
					continue
				}
				tcID := ntc.ID
				if tcID == "" {
					tcID = fmt.Sprintf("call_%d_%d", iter, i)
				}

				// 解析参数
				var args map[string]any
				if err := json.Unmarshal([]byte(ntc.Args), &args); err != nil {
					args = map[string]any{}
				}

				apiToolCalls = append(apiToolCalls, map[string]any{
					"id": tcID, "type": "function",
					"function": map[string]any{"name": ntc.Name, "arguments": ntc.Args},
				})

				sse.send(map[string]any{"type": "tool_call", "id": tcID, "tool": ntc.Name, "args": args, "status": "running"})

				// 危险命令检测
				if ntc.Name == "run_terminal" {
					if cmd, ok := args["command"].(string); ok && isDangerousCommand(cmd) {
						sse.send(map[string]any{
							"type": "approval_request", "id": tcID, "tool": ntc.Name,
							"command": cmd, "reason": "此命令可能修改系统状态，需要您的确认",
						})
					}
				}

				t0 := time.Now()
				result := executeTool(ntc.Name, args)
				duration := time.Since(t0).Seconds()

				sse.send(map[string]any{"type": "tool_result", "id": tcID, "tool": ntc.Name, "result": truncate(result, 5000), "duration": duration, "status": "completed"})

				toolResults.WriteString(fmt.Sprintf("\n<tool_result>\n工具: %s\n结果: %s\n</tool_result>\n", ntc.Name, truncate(result, 3500)))

				// 追加 tool 消息到对话
				messages = append(messages, map[string]any{
					"role": "assistant", "content": text,
					"tool_calls": apiToolCalls,
				})
				messages = append(messages, map[string]any{
					"role": "tool", "tool_call_id": tcID, "content": truncate(result, 3500),
				})
			}
			// 清空以进入下一轮
			continue
		}

		// === Prompt-based tool calling 模式 ===
		matches := toolCallRe.FindAllStringSubmatch(text, -1)

		if len(matches) == 0 {
			// 没有工具调用 — 直接推送文本并结束
			log.Printf("[agentLoop] iter=%d 无工具调用，推送文本 (%d 字符)", iter, len(text))
			sse.send(map[string]any{"type": "text", "content": text})
			messages = append(messages, map[string]any{"role": "assistant", "content": text})
			sse.send(map[string]any{"type": "usage", "prompt_tokens": totalPrompt, "completion_tokens": totalCompletion, "total_tokens": totalPrompt + totalCompletion})
			sse.send(map[string]any{"type": "done", "content": text})
			return
		}

		// 有工具调用 — 先推送工具调用之前的文本
		log.Printf("[agentLoop] iter=%d 检测到 %d 个工具调用", iter, len(matches))
		firstIdx := strings.Index(text, "<tool_call>")
		if firstIdx > 0 {
			prefix := strings.TrimSpace(text[:firstIdx])
			if prefix != "" {
				sse.send(map[string]any{"type": "text", "content": prefix})
			}
		}

		// 执行每个工具调用
		var toolResults strings.Builder
		for i, match := range matches {
			if len(match) < 2 {
				continue
			}
			var tc struct {
				Name string         `json:"name"`
				Args map[string]any `json:"arguments"`
			}
			if err := json.Unmarshal([]byte(match[1]), &tc); err != nil {
				continue
			}
			if tc.Args == nil {
				tc.Args = map[string]any{}
			}

			tcID := fmt.Sprintf("tc_%d_%d", iter, i)

			sse.send(map[string]any{"type": "tool_call", "id": tcID, "tool": tc.Name, "args": tc.Args, "status": "running"})

			// 检查是否为危险命令（需要审批）
			if tc.Name == "run_terminal" {
				if cmd, ok := tc.Args["command"].(string); ok && isDangerousCommand(cmd) {
					sse.send(map[string]any{
						"type": "approval_request", "id": tcID, "tool": tc.Name,
						"command": cmd, "reason": "此命令可能修改系统状态，需要您的确认",
					})
					// 注意：当前版本自动批准，未来可通过 WebSocket 等待用户响应
				}
			}

			t0 := time.Now()
			result := executeTool(tc.Name, tc.Args)
			duration := time.Since(t0).Seconds()

			sse.send(map[string]any{"type": "tool_result", "id": tcID, "tool": tc.Name, "result": truncate(result, 5000), "duration": duration, "status": "completed"})

			toolResults.WriteString(fmt.Sprintf("\n<tool_result>\n工具: %s\n结果: %s\n</tool_result>\n", tc.Name, truncate(result, 3500)))
		}

		// 把 assistant 消息和工具结果追加到消息列表
		// 注意：不要把原始 <tool_call> 标签放到 assistant 消息里
		// 用干净的描述替代，避免模型在第二轮困惑
		var cleanAssistant strings.Builder
		if firstIdx > 0 {
			cleanAssistant.WriteString(strings.TrimSpace(text[:firstIdx]))
			cleanAssistant.WriteString("\n\n")
		}
		cleanAssistant.WriteString("[已调用工具并获取结果]")
		messages = append(messages, map[string]any{"role": "assistant", "content": cleanAssistant.String()})
		messages = append(messages, map[string]any{"role": "user", "content": "以下是工具调用的结果，请根据结果用中文详细回答用户的问题：" + toolResults.String()})
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
		"hermes":   hermesState,
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

// ============================================================
// Skill Install Handler
// ============================================================

func handleInstallSkill(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(204)
		return
	}

	var body struct {
		Slug     string `json:"slug"`
		Category string `json:"category"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error":"无效的 JSON"}`, 400)
		return
	}
	if body.Slug == "" {
		http.Error(w, `{"error":"slug 不能为空"}`, 400)
		return
	}

	log.Printf("[install-skill] 开始安装: %s (分类: %s)", body.Slug, body.Category)

	// 1. 下载 ZIP
	downloadURL := fmt.Sprintf("https://api.2x.com.cn/api/v1/skills/%s/download-file", body.Slug)
	client := &http.Client{
		Timeout: 30 * time.Second,
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			return nil // follow redirects
		},
	}

	resp, err := client.Get(downloadURL)
	if err != nil {
		w.WriteHeader(500)
		json.NewEncoder(w).Encode(map[string]any{"error": "下载失败: " + err.Error()})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		w.WriteHeader(resp.StatusCode)
		json.NewEncoder(w).Encode(map[string]any{"error": fmt.Sprintf("下载失败 (%d)", resp.StatusCode)})
		return
	}

	zipData, err := io.ReadAll(resp.Body)
	if err != nil {
		w.WriteHeader(500)
		json.NewEncoder(w).Encode(map[string]any{"error": "读取下载内容失败"})
		return
	}

	log.Printf("[install-skill] 已下载 %d 字节", len(zipData))

	// 2. 解析 ZIP，提取 _meta.json 和 SKILL.md frontmatter 确定分类
	zipReader, err := newZipReader(zipData)
	if err != nil {
		w.WriteHeader(500)
		json.NewEncoder(w).Encode(map[string]any{"error": "ZIP 文件无效"})
		return
	}

	// 确定安装目录
	category := body.Category
	if category == "" {
		category = "community" // 默认分类
	}
	// 清理分类名（去除中文空格等，转小写英文）
	category = sanitizeCategory(category)

	skillsDir := filepath.Join(getHome(), ".hermes", "skills", category)
	installDir := filepath.Join(skillsDir, body.Slug)

	// 3. 创建目录并解压
	os.MkdirAll(installDir, 0755)

	fileCount := 0
	for _, f := range zipReader.File {
		if f.FileInfo().IsDir() {
			os.MkdirAll(filepath.Join(installDir, f.Name), 0755)
			continue
		}

		// 安全检查：防止路径穿越
		destPath := filepath.Join(installDir, f.Name)
		if !strings.HasPrefix(destPath, installDir) {
			continue
		}

		os.MkdirAll(filepath.Dir(destPath), 0755)
		rc, err := f.Open()
		if err != nil {
			continue
		}
		data, err := io.ReadAll(rc)
		rc.Close()
		if err != nil {
			continue
		}
		os.WriteFile(destPath, data, 0644)
		fileCount++
	}

	log.Printf("[install-skill] 已安装到 %s (%d 个文件)", installDir, fileCount)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"success":  true,
		"slug":     body.Slug,
		"path":     installDir,
		"files":    fileCount,
		"category": category,
	})
}

func newZipReader(data []byte) (*zip.Reader, error) {
	return zip.NewReader(bytes.NewReader(data), int64(len(data)))
}

func sanitizeCategory(cat string) string {
	// 常见中文分类映射到英文目录名
	catMap := map[string]string{
		"AI 智能": "ai", "ai 智能": "ai", "AI智能": "ai",
		"效率提升": "productivity", "效率": "productivity",
		"开发工具": "devtools", "开发": "devtools",
		"浏览器自动化": "browser-automation",
		"安全合规": "security", "安全": "security",
		"知识管理": "knowledge", "知识": "knowledge",
		"通讯协作": "communication", "通讯": "communication",
		"数据分析": "data", "数据": "data",
		"内容创作": "creative", "创意": "creative",
		"搜索研究": "research", "研究": "research",
	}
	if mapped, ok := catMap[cat]; ok {
		return mapped
	}
	// 如果已经是英文就直接用
	clean := strings.ToLower(strings.TrimSpace(cat))
	clean = strings.ReplaceAll(clean, " ", "-")
	if clean == "" {
		return "community"
	}
	return clean
}

// ============================================================
// Skill List & Uninstall Handlers
// ============================================================

func handleListSkills(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(204)
		return
	}

	skillsRoot := filepath.Join(getHome(), ".hermes", "skills")
	var installed []map[string]any

	// 递归扫描所有 SKILL.md
	filepath.Walk(skillsRoot, func(path string, info os.FileInfo, err error) error {
		if err != nil || info.IsDir() || info.Name() != "SKILL.md" {
			return nil
		}

		skillDir := filepath.Dir(path)
		slug := filepath.Base(skillDir)
		category := filepath.Base(filepath.Dir(skillDir))
		// 如果 category == "skills" 说明是顶级技能
		if category == "skills" {
			category = ""
		}

		entry := map[string]any{
			"slug":     slug,
			"category": category,
			"path":     skillDir,
		}

		// 解析 SKILL.md frontmatter
		if data, err := os.ReadFile(path); err == nil {
			content := string(data)
			if strings.HasPrefix(content, "---\n") {
				if end := strings.Index(content[4:], "\n---"); end > 0 {
					fm := content[4 : 4+end]
					for _, line := range strings.Split(fm, "\n") {
						parts := strings.SplitN(line, ":", 2)
						if len(parts) != 2 {
							continue
						}
						key := strings.TrimSpace(parts[0])
						val := strings.TrimSpace(parts[1])
						val = strings.Trim(val, "\"'")
						switch key {
						case "name":
							entry["name"] = val
						case "description":
							entry["description"] = val
						case "version":
							entry["version"] = val
						case "author":
							entry["author"] = val
						}
					}
				}
			}
		}

		// 如果没有 name，用 slug
		if _, ok := entry["name"]; !ok {
			entry["name"] = slug
		}

		// 解析 _meta.json（2x 商店安装的技能有此文件）
		metaPath := filepath.Join(skillDir, "_meta.json")
		if data, err := os.ReadFile(metaPath); err == nil {
			var meta map[string]any
			if json.Unmarshal(data, &meta) == nil {
				entry["source"] = "2x"
				if v, ok := meta["version"].(string); ok && entry["version"] == nil {
					entry["version"] = v
				}
			}
		} else {
			entry["source"] = "builtin"
		}

		// 目录大小（文件数）
		fileCount := 0
		filepath.Walk(skillDir, func(_ string, fi os.FileInfo, _ error) error {
			if fi != nil && !fi.IsDir() {
				fileCount++
			}
			return nil
		})
		entry["files"] = fileCount

		installed = append(installed, entry)
		return nil
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"skills": installed,
		"total":  len(installed),
		"path":   skillsRoot,
	})
}

func handleUninstallSkill(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(204)
		return
	}

	var body struct {
		Slug     string `json:"slug"`
		Category string `json:"category"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error":"无效的 JSON"}`, 400)
		return
	}
	if body.Slug == "" {
		http.Error(w, `{"error":"slug 不能为空"}`, 400)
		return
	}

	skillsRoot := filepath.Join(getHome(), ".hermes", "skills")

	// 查找技能目录
	var targetDir string
	if body.Category != "" {
		// 直接定位
		targetDir = filepath.Join(skillsRoot, body.Category, body.Slug)
	} else {
		// 搜索所有分类
		filepath.Walk(skillsRoot, func(path string, info os.FileInfo, err error) error {
			if err != nil || !info.IsDir() || info.Name() != body.Slug {
				return nil
			}
			// 确认包含 SKILL.md
			if _, e := os.Stat(filepath.Join(path, "SKILL.md")); e == nil {
				targetDir = path
				return filepath.SkipAll
			}
			return nil
		})
	}

	if targetDir == "" {
		w.WriteHeader(404)
		json.NewEncoder(w).Encode(map[string]any{"error": fmt.Sprintf("技能 %s 未找到", body.Slug)})
		return
	}

	// 安全检查
	if !strings.HasPrefix(targetDir, skillsRoot) {
		w.WriteHeader(400)
		json.NewEncoder(w).Encode(map[string]any{"error": "路径不安全"})
		return
	}

	log.Printf("[uninstall-skill] 卸载: %s (%s)", body.Slug, targetDir)

	if err := os.RemoveAll(targetDir); err != nil {
		w.WriteHeader(500)
		json.NewEncoder(w).Encode(map[string]any{"error": "卸载失败: " + err.Error()})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"success": true,
		"slug":    body.Slug,
		"path":    targetDir,
	})
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
// Hermes Agent 集成 — 作为 Hi!XNS 的内部组件
// ============================================================

type hermesInfo struct {
	Available bool   `json:"available"`
	Path      string `json:"path,omitempty"`
	Version   string `json:"version,omitempty"`
	SourceDir string `json:"source_dir,omitempty"`
	SkillsDir string `json:"skills_dir"`
	Source    string `json:"source"` // "bundled" | "system" | "user" | ""
}

func detectHermes() hermesInfo {
	info := hermesInfo{
		SkillsDir: filepath.Join(getHome(), ".hermes", "skills"),
	}

	// 查找 hermes — 优先应用内嵌，然后系统安装
	hermesPath := ""

	// 1. 应用内嵌: 可执行文件同目录下的 bundled/hermes-agent/
	exeDir := ""
	if exe, err := os.Executable(); err == nil {
		exeDir = filepath.Dir(exe)
	}
	bundledPaths := []string{}
	if exeDir != "" {
		bundledPaths = append(bundledPaths,
			filepath.Join(exeDir, "bundled", "hermes-agent"),            // 同目录
			filepath.Join(exeDir, "..", "bundled", "hermes-agent"),       // 开发模式
			filepath.Join(exeDir, "..", "Resources", "hermes-agent"),     // macOS bundle
		)
	}
	// 项目目录（开发时）
	if cwd, err := os.Getwd(); err == nil {
		bundledPaths = append(bundledPaths, filepath.Join(cwd, "bundled", "hermes-agent"))
	}

	for _, bp := range bundledPaths {
		if _, err := os.Stat(filepath.Join(bp, "run_agent.py")); err == nil {
			info.SourceDir = bp
			// 使用内嵌的 venv 中的 hermes
			venvHermes := filepath.Join(bp, "venv", "bin", "hermes")
			if runtime.GOOS == "windows" {
				venvHermes = filepath.Join(bp, "venv", "Scripts", "hermes.exe")
			}
			if _, err := os.Stat(venvHermes); err == nil {
				hermesPath = venvHermes
			} else {
				// 尝试 run-hermes.sh
				runScript := filepath.Join(bp, "run-hermes.sh")
				if _, err := os.Stat(runScript); err == nil {
					hermesPath = runScript
				}
			}
			break
		}
	}

	// 2. 系统安装
	if hermesPath == "" {
		systemCandidates := []string{
			filepath.Join(getHome(), ".hermes", "bin", "hermes"),
			"/usr/local/bin/hermes",
		}
		if p, err := exec.LookPath("hermes"); err == nil {
			hermesPath = p
		} else {
			for _, c := range systemCandidates {
				if _, err := os.Stat(c); err == nil {
					hermesPath = c
					break
				}
			}
		}
	}

	if hermesPath == "" {
		return info
	}

	info.Available = true
	info.Path = hermesPath

	// 获取版本
	if out, err := exec.Command(hermesPath, "--version").Output(); err == nil {
		lines := strings.Split(strings.TrimSpace(string(out)), "\n")
		if len(lines) > 0 {
			info.Version = lines[0]
		}
	}

	// 如果还没找到源码目录，从系统路径检测
	if info.SourceDir == "" {
		sourceCandidates := []string{
			"/usr/local/lib/hermes-agent",
			filepath.Join(getHome(), ".hermes", "hermes-agent"),
		}
		for _, d := range sourceCandidates {
			if _, err := os.Stat(filepath.Join(d, "run_agent.py")); err == nil {
				info.SourceDir = d
				break
			}
		}
	}

	// 判断来源
	if strings.Contains(info.Path, "bundled") {
		info.Source = "bundled"
		info.Version += " (内嵌)"
	} else if strings.Contains(info.Path, ".hermes") {
		info.Source = "user"
		info.Version += " (用户安装)"
	} else {
		info.Source = "system"
		info.Version += " (系统安装)"
	}

	return info
}

// 全局 Hermes 信息（启动时检测一次）
var hermesState hermesInfo

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
	mux.HandleFunc("/v1/agent/install-skill", handleInstallSkill)
	mux.HandleFunc("/v1/agent/skills", handleListSkills)
	mux.HandleFunc("/v1/agent/uninstall-skill", handleUninstallSkill)

	addr := host + ":" + port

	// 检测 Hermes Agent
	hermesState = detectHermes()
	if hermesState.Available {
		log.Printf("[Hi!XNS] Hermes Agent 已集成: %s", hermesState.Version)
		log.Printf("[Hi!XNS] Hermes 路径: %s", hermesState.Path)
		if hermesState.SourceDir != "" {
			log.Printf("[Hi!XNS] Hermes 源码: %s", hermesState.SourceDir)
		}
	} else {
		log.Printf("[Hi!XNS] Hermes Agent 未检测到，使用内置工具")
	}
	log.Printf("[Hi!XNS] 技能目录: %s", hermesState.SkillsDir)

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
