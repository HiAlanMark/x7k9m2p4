package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"sync"
	"time"
)

// ============================================================
// Dynamic Tool Discovery — 从 ~/.hermes/skills/ 加载工具 schema
// ============================================================

var (
	discoveredTools     []map[string]any
	discoveredToolsTime time.Time
	discoveredToolsMu   sync.RWMutex
)

// getToolDefs returns the merged tool definitions (builtin + discovered from skills)
func getToolDefs() []map[string]any {
	discoveredToolsMu.RLock()
	if discoveredTools != nil && time.Since(discoveredToolsTime) < 5*time.Minute {
		defer discoveredToolsMu.RUnlock()
		return append(toolDefs, discoveredTools...)
	}
	discoveredToolsMu.RUnlock()

	// Reload discovered tools
	tools := discoverSkillTools()
	discoveredToolsMu.Lock()
	discoveredTools = tools
	discoveredToolsTime = time.Now()
	discoveredToolsMu.Unlock()

	return append(toolDefs, discoveredTools...)
}

// discoverSkillTools scans ~/.hermes/skills/ for SKILL.md frontmatter
// and extracts tools referenced in trigger patterns
func discoverSkillTools() []map[string]any {
	skillsRoot := filepath.Join(getHome(), ".hermes", "skills")
	var tools []map[string]any

	categories, err := os.ReadDir(skillsRoot)
	if err != nil {
		return nil
	}

	for _, cat := range categories {
		if !cat.IsDir() {
			continue
		}
		skillDir := filepath.Join(skillsRoot, cat.Name())
		skills, err := os.ReadDir(skillDir)
		if err != nil {
			continue
		}
		for _, s := range skills {
			if !s.IsDir() {
				continue
			}
			skillMD := filepath.Join(skillDir, s.Name(), "SKILL.md")
			fm := parseFrontmatter(skillMD)
			if fm == nil {
				continue
			}
			// Only add skills that have tool-like triggers
			name, _ := fm["name"].(string)
			desc, _ := fm["description"].(string)
			if name == "" {
				name = s.Name()
			}
			if desc == "" {
				continue // skip skills without description
			}
			tools = append(tools, map[string]any{
				"type": "function",
				"function": map[string]any{
					"name":        "use_skill_" + name,
					"description": fmt.Sprintf("[Skill] %s — 加载技能 '%s' 的完整指令到对话上下文", desc, name),
					"parameters": map[string]any{
						"type": "object",
						"properties": map[string]any{
							"query": map[string]any{
								"type":        "string",
								"description": fmt.Sprintf("要传给技能 %s 的具体问题或任务描述", name),
							},
						},
						"required": []string{"query"},
					},
				},
			})
		}
	}

	return tools
}

// parseFrontmatter extracts YAML frontmatter from a SKILL.md file
func parseFrontmatter(path string) map[string]any {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil
	}
	content := string(data)
	if !strings.HasPrefix(content, "---") {
		return nil
	}
	end := strings.Index(content[3:], "---")
	if end < 0 {
		return nil
	}
	fmStr := strings.TrimSpace(content[3 : end+3])

	// Simple YAML-like parsing for key: value pairs
	result := make(map[string]any)
	lines := strings.Split(fmStr, "\n")
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		idx := strings.Index(line, ":")
		if idx < 0 {
			continue
		}
		key := strings.TrimSpace(line[:idx])
		val := strings.TrimSpace(line[idx+1:])
		// Strip quotes
		if (strings.HasPrefix(val, `"`) && strings.HasSuffix(val, `"`)) ||
			(strings.HasPrefix(val, "'") && strings.HasSuffix(val, "'")) {
			val = val[1 : len(val)-1]
		}
		result[key] = val
	}
	return result
}

// executeSkillTool handles use_skill_* tool calls
func executeSkillTool(skillName string, args map[string]any) string {
	// Remove the "use_skill_" prefix
	name := strings.TrimPrefix(skillName, "use_skill_")
	query, _ := args["query"].(string)

	skillsRoot := filepath.Join(getHome(), ".hermes", "skills")
	var skillPath string

	// Search for the skill across all categories
	categories, err := os.ReadDir(skillsRoot)
	if err != nil {
		return jsonStr(map[string]any{"error": "技能目录不存在"})
	}
	for _, cat := range categories {
		candidate := filepath.Join(skillsRoot, cat.Name(), name, "SKILL.md")
		if _, err := os.Stat(candidate); err == nil {
			skillPath = candidate
			break
		}
	}
	if skillPath == "" {
		return jsonStr(map[string]any{"error": fmt.Sprintf("未找到技能: %s", name)})
	}

	data, err := os.ReadFile(skillPath)
	if err != nil {
		return jsonStr(map[string]any{"error": fmt.Sprintf("读取技能失败: %v", err)})
	}

	content := string(data)
	// Truncate to 4000 chars for context window
	if len(content) > 4000 {
		content = content[:4000] + "\n\n... [技能内容已截断]"
	}

	result := fmt.Sprintf("已加载技能: %s\n\n%s\n\n用户问题: %s", name, content, query)
	return jsonStr(map[string]any{"skill": name, "content": result, "loaded": true})
}

// ============================================================
// Extended Built-in Tools (新增工具)
// ============================================================

// toolWebSearch performs a web search via SearXNG or DuckDuckGo API
func toolWebSearch(args map[string]any) string {
	query := strVal(args, "query")
	if query == "" {
		return jsonStr(map[string]any{"error": "缺少 query 参数"})
	}
	limit := intVal(args, "limit", 5)
	if limit <= 0 || limit > 20 {
		limit = 5
	}

	// Try SearXNG first (local instance), then DuckDuckGo HTML
	results := trySearXNG(query, limit)
	if results == nil {
		results = tryDuckDuckGo(query, limit)
	}
	if results == nil {
		return jsonStr(map[string]any{"error": "搜索服务不可用", "query": query})
	}

	return jsonStr(map[string]any{"query": query, "results": results, "count": len(results)})
}

func trySearXNG(query string, limit int) []map[string]any {
	// Try common SearXNG endpoints
	endpoints := []string{
		"http://localhost:8888/search",
		"http://localhost:8080/search",
	}
	for _, endpoint := range endpoints {
		url := fmt.Sprintf("%s?q=%s&format=json&limit=%d", endpoint, queryEscape(query), limit)
		client := &http.Client{Timeout: 10 * time.Second}
		resp, err := client.Get(url)
		if err != nil {
			continue
		}
		defer resp.Body.Close()
		if resp.StatusCode != 200 {
			continue
		}
		var data map[string]any
		if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
			continue
		}
		items, _ := data["results"].([]any)
		var results []map[string]any
		for i, item := range items {
			if i >= limit {
				break
			}
			m, _ := item.(map[string]any)
			title, _ := m["title"].(string)
			url, _ := m["url"].(string)
			snippet, _ := m["content"].(string)
			results = append(results, map[string]any{
				"title":   title,
				"url":     url,
				"snippet": snippet,
			})
		}
		return results
	}
	return nil
}

func tryDuckDuckGo(query string, limit int) []map[string]any {
	url := fmt.Sprintf("https://html.duckduckgo.com/html/?q=%s", queryEscape(query))
	client := &http.Client{Timeout: 10 * time.Second}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36")
	resp, err := client.Do(req)
	if err != nil {
		return nil
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil
	}

	// Parse HTML results (simplified regex extraction)
	var results []map[string]any
	titleRe := regexp.MustCompile(`<a[^>]*class="result__a"[^>]*>(.*?)</a>`)
	urlRe := regexp.MustCompile(`<a[^>]*class="result__url"[^>]*>(.*?)</a>`)
	snippetRe := regexp.MustCompile(`<a[^>]*class="result__snippet"[^>]*>(.*?)</a>`)

	titles := titleRe.FindAllStringSubmatch(string(body), limit)
	urls := urlRe.FindAllStringSubmatch(string(body), limit)
	snippets := snippetRe.FindAllStringSubmatch(string(body), limit)

	for i := 0; i < len(titles) && i < limit; i++ {
		title := stripHTMLTags(titles[i][1])
		link := ""
		if i < len(urls) {
			link = stripHTMLTags(urls[i][1])
		}
		snippet := ""
		if i < len(snippets) {
			snippet = stripHTMLTags(snippets[i][1])
		}
		results = append(results, map[string]any{
			"title":   title,
			"url":     link,
			"snippet": snippet,
		})
	}
	return results
}

// toolPatchFile performs targeted find-and-replace in a file
func toolPatchFile(args map[string]any) string {
	path := expandPath(strVal(args, "path"))
	oldStr := strVal(args, "old_string")
	newStr := strVal(args, "new_string")
	replaceAll, _ := args["replace_all"].(bool)

	if path == "" {
		return jsonStr(map[string]any{"error": "缺少 path 参数"})
	}
	if oldStr == "" {
		return jsonStr(map[string]any{"error": "缺少 old_string 参数"})
	}

	data, err := os.ReadFile(path)
	if err != nil {
		return jsonStr(map[string]any{"error": fmt.Sprintf("读取文件失败: %v", err)})
	}

	content := string(data)
	count := strings.Count(content, oldStr)
	if count == 0 {
		return jsonStr(map[string]any{"error": "未找到匹配内容", "path": path})
	}

	if count > 1 && !replaceAll {
		return jsonStr(map[string]any{
			"error":       fmt.Sprintf("找到 %d 处匹配，需要 replace_all=true 或提供更精确的匹配", count),
			"match_count": count,
			"path":        path,
		})
	}

	if replaceAll {
		content = strings.ReplaceAll(content, oldStr, newStr)
	} else {
		content = strings.Replace(content, oldStr, newStr, 1)
	}

	if err := os.WriteFile(path, []byte(content), 0644); err != nil {
		return jsonStr(map[string]any{"error": fmt.Sprintf("写入文件失败: %v", err)})
	}

	replaced := count
	if replaceAll {
		// already replaced all
	} else {
		replaced = 1
	}

	return jsonStr(map[string]any{
		"success":  true,
		"path":     path,
		"replaced": replaced,
	})
}

// toolWebFetch fetches content from a URL
func toolWebFetch(args map[string]any) string {
	url := strVal(args, "url")
	if url == "" {
		return jsonStr(map[string]any{"error": "缺少 url 参数"})
	}
	maxLen := intVal(args, "max_length", 5000)

	client := &http.Client{Timeout: 15 * time.Second}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return jsonStr(map[string]any{"error": fmt.Sprintf("请求构造失败: %v", err)})
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36")

	resp, err := client.Do(req)
	if err != nil {
		return jsonStr(map[string]any{"error": fmt.Sprintf("请求失败: %v", err)})
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return jsonStr(map[string]any{"error": fmt.Sprintf("HTTP %d", resp.StatusCode), "url": url})
	}

	body, err := io.ReadAll(io.LimitReader(resp.Body, int64(maxLen*2)))
	if err != nil {
		return jsonStr(map[string]any{"error": fmt.Sprintf("读取失败: %v", err)})
	}

	content := string(body)
	// Strip HTML tags if content type is HTML
	ct := resp.Header.Get("Content-Type")
	if strings.Contains(ct, "text/html") {
		content = stripHTMLTags(content)
	}

	if len(content) > maxLen {
		content = content[:maxLen] + "\n\n... [内容已截断]"
	}

	return jsonStr(map[string]any{
		"url":        url,
		"content":    content,
		"status":     resp.StatusCode,
		"content_type": ct,
	})
}

// toolMoveFile moves or renames a file/directory
func toolMoveFile(args map[string]any) string {
	src := expandPath(strVal(args, "source"))
	dst := expandPath(strVal(args, "destination"))
	if src == "" || dst == "" {
		return jsonStr(map[string]any{"error": "缺少 source 或 destination 参数"})
	}

	if _, err := os.Stat(src); err != nil {
		return jsonStr(map[string]any{"error": fmt.Sprintf("源路径不存在: %s", src)})
	}

	// Create destination directory if needed
	dstDir := filepath.Dir(dst)
	if dstDir != "" && dstDir != "." {
		os.MkdirAll(dstDir, 0755)
	}

	if err := os.Rename(src, dst); err != nil {
		// Cross-device move: copy then delete
		if err := copyAll(src, dst); err != nil {
			return jsonStr(map[string]any{"error": fmt.Sprintf("移动失败: %v", err)})
		}
		os.RemoveAll(src)
	}

	return jsonStr(map[string]any{"success": true, "source": src, "destination": dst})
}

// toolDeletePath deletes a file or directory
func toolDeletePath(args map[string]any) string {
	path := expandPath(strVal(args, "path"))
	if path == "" {
		return jsonStr(map[string]any{"error": "缺少 path 参数"})
	}
	// Safety check: prevent deleting root or home
	if path == "/" || path == getHome() {
		return jsonStr(map[string]any{"error": "不允许删除根目录或用户主目录"})
	}

	info, err := os.Stat(path)
	if err != nil {
		return jsonStr(map[string]any{"error": fmt.Sprintf("路径不存在: %s", path)})
	}

	if info.IsDir() {
		err = os.RemoveAll(path)
	} else {
		err = os.Remove(path)
	}
	if err != nil {
		return jsonStr(map[string]any{"error": fmt.Sprintf("删除失败: %v", err)})
	}

	return jsonStr(map[string]any{"success": true, "deleted": path, "was_dir": info.IsDir()})
}

// ============================================================
// Extended executeTool — handles all tool types
// ============================================================

func executeToolExtended(name string, args map[string]any) string {
	// Built-in tools (original)
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
	// New built-in tools
	case "web_search":
		return toolWebSearch(args)
	case "web_fetch":
		return toolWebFetch(args)
	case "patch_file":
		return toolPatchFile(args)
	case "move_file":
		return toolMoveFile(args)
	case "delete_path":
		return toolDeletePath(args)
	// Skill tools
	default:
		if strings.HasPrefix(name, "use_skill_") {
			return executeSkillTool(name, args)
		}
		return jsonStr(map[string]any{"error": "未知工具: " + name})
	}
}

// ============================================================
// Utility functions
// ============================================================

func queryEscape(s string) string {
	var buf strings.Builder
	for _, c := range s {
		if c == ' ' {
			buf.WriteString("+")
		} else if shouldEscape(c) {
			fmt.Fprintf(&buf, "%%%02X", c)
		} else {
			buf.WriteRune(c)
		}
	}
	return buf.String()
}

func shouldEscape(c rune) bool {
	return !((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') ||
		c == '-' || c == '_' || c == '.' || c == '~' || c == '+')
}

func stripHTMLTags(s string) string {
	re := regexp.MustCompile(`<[^>]*>`)
	s = re.ReplaceAllString(s, "")
	// Decode common HTML entities
	s = strings.ReplaceAll(s, "&amp;", "&")
	s = strings.ReplaceAll(s, "&lt;", "<")
	s = strings.ReplaceAll(s, "&gt;", ">")
	s = strings.ReplaceAll(s, "&quot;", `"`)
	s = strings.ReplaceAll(s, "&#39;", "'")
	s = strings.ReplaceAll(s, "&nbsp;", " ")
	return strings.TrimSpace(s)
}

func copyAll(src, dst string) error {
	info, err := os.Stat(src)
	if err != nil {
		return err
	}
	if info.IsDir() {
		return copyDirRecursive(src, dst)
	}
	return copyFileSimple(src, dst)
}

func copyDirRecursive(src, dst string) error {
	if err := os.MkdirAll(dst, 0755); err != nil {
		return err
	}
	entries, err := os.ReadDir(src)
	if err != nil {
		return err
	}
	for _, entry := range entries {
		srcPath := filepath.Join(src, entry.Name())
		dstPath := filepath.Join(dst, entry.Name())
		if entry.IsDir() {
			if err := copyDirRecursive(srcPath, dstPath); err != nil {
				return err
			}
		} else {
			if err := copyFileSimple(srcPath, dstPath); err != nil {
				return err
			}
		}
	}
	return nil
}

func copyFileSimple(src, dst string) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()

	if err := os.MkdirAll(filepath.Dir(dst), 0755); err != nil {
		return err
	}

	out, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, in)
	return err
}

// Additional tool definitions for new tools
var extendedToolDefs = []map[string]any{
	{
		"type": "function",
		"function": map[string]any{
			"name":        "web_search",
			"description": "搜索互联网获取信息。返回相关网页的标题、链接和摘要。",
			"parameters": map[string]any{
				"type": "object",
				"properties": map[string]any{
					"query": map[string]any{"type": "string", "description": "搜索关键词"},
					"limit": map[string]any{"type": "integer", "description": "返回结果数量，默认5"},
				},
				"required": []string{"query"},
			},
		},
	},
	{
		"type": "function",
		"function": map[string]any{
			"name":        "web_fetch",
			"description": "获取指定 URL 的网页内容。支持 HTML（自动提取文本）和纯文本。",
			"parameters": map[string]any{
				"type": "object",
				"properties": map[string]any{
					"url":        map[string]any{"type": "string", "description": "要获取的 URL"},
					"max_length": map[string]any{"type": "integer", "description": "最大内容长度，默认5000字符"},
				},
				"required": []string{"url"},
			},
		},
	},
	{
		"type": "function",
		"function": map[string]any{
			"name":        "patch_file",
			"description": "精确替换文件中的文本片段。适合对代码进行小范围精确修改，不会影响文件其他部分。",
			"parameters": map[string]any{
				"type": "object",
				"properties": map[string]any{
					"path":        map[string]any{"type": "string", "description": "文件路径"},
					"old_string":  map[string]any{"type": "string", "description": "要替换的原始文本（必须精确匹配）"},
					"new_string":  map[string]any{"type": "string", "description": "替换后的新文本"},
					"replace_all": map[string]any{"type": "boolean", "description": "是否替换所有匹配（默认只替换第一处）"},
				},
				"required": []string{"path", "old_string", "new_string"},
			},
		},
	},
	{
		"type": "function",
		"function": map[string]any{
			"name":        "move_file",
			"description": "移动或重命名文件/目录。自动创建目标目录。跨文件系统时自动复制+删除。",
			"parameters": map[string]any{
				"type": "object",
				"properties": map[string]any{
					"source":      map[string]any{"type": "string", "description": "源路径"},
					"destination": map[string]any{"type": "string", "description": "目标路径"},
				},
				"required": []string{"source", "destination"},
			},
		},
	},
	{
		"type": "function",
		"function": map[string]any{
			"name":        "delete_path",
			"description": "删除文件或目录。目录会递归删除。禁止删除根目录或用户主目录。",
			"parameters": map[string]any{
				"type": "object",
				"properties": map[string]any{
					"path": map[string]any{"type": "string", "description": "要删除的路径"},
				},
				"required": []string{"path"},
			},
		},
	},
}

// init merges extended tool defs into toolDefs
func init() {
	toolDefs = append(toolDefs, extendedToolDefs...)
}

// updateSystemPrompt generates a dynamic system prompt that includes available tools
func buildSystemPrompt(tools []map[string]any) string {
	var sb strings.Builder
	sb.WriteString(systemPrompt)

	// Add skill tools description
	skillTools := 0
	for _, t := range tools {
		fn, _ := t["function"].(map[string]any)
		name, _ := fn["name"].(string)
		if strings.HasPrefix(name, "use_skill_") {
			desc, _ := fn["description"].(string)
			skillName := strings.TrimPrefix(name, "use_skill_")
			sb.WriteString(fmt.Sprintf("\n## use_skill_%s\n%s\n参数: query (string, 必填) — 传给技能的问题或任务描述\n", skillName, desc))
			skillTools++
		}
	}
	if skillTools > 0 {
		sb.WriteString(fmt.Sprintf("\n# 技能说明\n当前已加载 %d 个技能。调用 use_skill_* 工具可将技能指令注入对话上下文。\n", skillTools))
	}

	return sb.String()
}

// Context for terminal timeout override (unused but kept for compatibility)
var _ = context.Background
