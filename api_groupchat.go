package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"sync"
	"time"
)

type GroupChatMeta struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	CreatedAt  string `json:"created_at"`
	UpdatedAt  string `json:"updated_at"`
	AgentCount int    `json:"agent_count"`
}

type GroupChatAgent struct {
	ID           string `json:"id"`
	GroupID      string `json:"group_id"`
	Name         string `json:"name"`
	Model        string `json:"model"`
	Provider     string `json:"provider"`
	SystemPrompt string `json:"system_prompt"`
	Color        string `json:"color"`
	CreatedAt    string `json:"created_at"`
}

type GroupChatMessage struct {
	ID        string  `json:"id"`
	GroupID   string  `json:"group_id"`
	AgentID   *string `json:"agent_id"`
	Role      string  `json:"role"`
	Content   string  `json:"content"`
	Timestamp string  `json:"timestamp"`
	Mentions  string  `json:"mentions"`
}

type GroupChatFull struct {
	ID        string             `json:"id"`
	Name      string             `json:"name"`
	CreatedAt string             `json:"created_at"`
	UpdatedAt string             `json:"updated_at"`
	Agents    []GroupChatAgent   `json:"agents"`
	Messages  []GroupChatMessage `json:"messages"`
}

var groupChatMu sync.RWMutex

func groupChatsRootDir() string {
	return filepath.Join(hermesState.SourceDir, "group_chats")
}

func groupChatsDir() string { return filepath.Join(groupChatsRootDir(), "groups") }
func groupAgentsDir(groupID string) string {
	return filepath.Join(groupChatsRootDir(), "agents", safeGroupID(groupID))
}
func groupMessagesDir() string { return filepath.Join(groupChatsRootDir(), "messages") }
func groupPath(groupID string) string {
	return filepath.Join(groupChatsDir(), safeGroupID(groupID)+".json")
}
func groupMessagesPath(groupID string) string {
	return filepath.Join(groupMessagesDir(), safeGroupID(groupID)+".json")
}

func safeGroupID(id string) string {
	id = strings.TrimSpace(id)
	id = strings.ReplaceAll(id, "/", "_")
	id = strings.ReplaceAll(id, "\\", "_")
	return id
}

func initGroupChatStore() {
	for _, d := range []string{groupChatsDir(), filepath.Join(groupChatsRootDir(), "agents"), groupMessagesDir()} {
		if err := os.MkdirAll(d, 0755); err != nil {
			log.Printf("[groupchat] failed to create %s: %v", d, err)
		}
	}
}

func readGroupMeta(groupID string) (*GroupChatMeta, error) {
	data, err := os.ReadFile(groupPath(groupID))
	if err != nil {
		return nil, err
	}
	var meta GroupChatMeta
	if err := json.Unmarshal(data, &meta); err != nil {
		return nil, err
	}
	return &meta, nil
}

func writeGroupMeta(meta GroupChatMeta) error {
	if err := os.MkdirAll(groupChatsDir(), 0755); err != nil {
		return err
	}
	data, err := json.MarshalIndent(meta, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(groupPath(meta.ID), data, 0644)
}

func listGroupMetas() ([]GroupChatMeta, error) {
	groupChatMu.RLock()
	defer groupChatMu.RUnlock()
	entries, err := os.ReadDir(groupChatsDir())
	if err != nil {
		if os.IsNotExist(err) {
			return []GroupChatMeta{}, nil
		}
		return nil, err
	}
	groups := []GroupChatMeta{}
	for _, e := range entries {
		if e.IsDir() || filepath.Ext(e.Name()) != ".json" {
			continue
		}
		data, err := os.ReadFile(filepath.Join(groupChatsDir(), e.Name()))
		if err != nil {
			continue
		}
		var g GroupChatMeta
		if err := json.Unmarshal(data, &g); err == nil {
			groups = append(groups, g)
		}
	}
	sort.Slice(groups, func(i, j int) bool { return groups[i].UpdatedAt > groups[j].UpdatedAt })
	return groups, nil
}

func readGroupAgents(groupID string) ([]GroupChatAgent, error) {
	entries, err := os.ReadDir(groupAgentsDir(groupID))
	if err != nil {
		if os.IsNotExist(err) {
			return []GroupChatAgent{}, nil
		}
		return nil, err
	}
	agents := []GroupChatAgent{}
	for _, e := range entries {
		if e.IsDir() || filepath.Ext(e.Name()) != ".json" {
			continue
		}
		data, err := os.ReadFile(filepath.Join(groupAgentsDir(groupID), e.Name()))
		if err != nil {
			continue
		}
		var a GroupChatAgent
		if err := json.Unmarshal(data, &a); err == nil {
			agents = append(agents, a)
		}
	}
	sort.Slice(agents, func(i, j int) bool { return agents[i].CreatedAt < agents[j].CreatedAt })
	return agents, nil
}

func writeGroupAgent(agent GroupChatAgent) error {
	dir := groupAgentsDir(agent.GroupID)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}
	data, err := json.MarshalIndent(agent, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(filepath.Join(dir, safeGroupID(agent.ID)+".json"), data, 0644)
}

func readGroupMessages(groupID string) ([]GroupChatMessage, error) {
	data, err := os.ReadFile(groupMessagesPath(groupID))
	if err != nil {
		if os.IsNotExist(err) {
			return []GroupChatMessage{}, nil
		}
		return nil, err
	}
	var messages []GroupChatMessage
	if len(bytes.TrimSpace(data)) == 0 {
		return []GroupChatMessage{}, nil
	}
	if err := json.Unmarshal(data, &messages); err != nil {
		return nil, err
	}
	return messages, nil
}

func writeGroupMessages(groupID string, messages []GroupChatMessage) error {
	if err := os.MkdirAll(groupMessagesDir(), 0755); err != nil {
		return err
	}
	data, err := json.MarshalIndent(messages, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(groupMessagesPath(groupID), data, 0644)
}

func appendGroupMessages(groupID string, newMessages ...GroupChatMessage) error {
	groupChatMu.Lock()
	defer groupChatMu.Unlock()
	messages, _ := readGroupMessages(groupID)
	messages = append(messages, newMessages...)
	if err := writeGroupMessages(groupID, messages); err != nil {
		return err
	}
	meta, err := readGroupMeta(groupID)
	if err == nil {
		meta.UpdatedAt = time.Now().UTC().Format(time.RFC3339)
		_ = writeGroupMeta(*meta)
	}
	return nil
}

func getGroupFull(groupID string) (*GroupChatFull, error) {
	meta, err := readGroupMeta(groupID)
	if err != nil {
		return nil, err
	}
	agents, err := readGroupAgents(groupID)
	if err != nil {
		return nil, err
	}
	messages, err := readGroupMessages(groupID)
	if err != nil {
		return nil, err
	}
	return &GroupChatFull{ID: meta.ID, Name: meta.Name, CreatedAt: meta.CreatedAt, UpdatedAt: meta.UpdatedAt, Agents: agents, Messages: messages}, nil
}

func handleGroupChats(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(204)
		return
	}
	initGroupChatStore()
	switch r.Method {
	case "GET":
		groups, err := listGroupMetas()
		if err != nil {
			jsonError(w, err.Error(), 500)
			return
		}
		jsonResponse(w, map[string]any{"groups": groups})
	case "POST":
		var body struct {
			Name   string `json:"name"`
			Agents []struct {
				Name         string `json:"name"`
				Model        string `json:"model"`
				Provider     string `json:"provider"`
				SystemPrompt string `json:"system_prompt"`
				Color        string `json:"color"`
			} `json:"agents"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			jsonError(w, "invalid body", 400)
			return
		}
		body.Name = strings.TrimSpace(body.Name)
		if body.Name == "" {
			jsonError(w, "group name is required", 400)
			return
		}
		now := time.Now().UTC().Format(time.RFC3339)
		groupID := fmt.Sprintf("group-%d", time.Now().UnixNano())
		meta := GroupChatMeta{ID: groupID, Name: body.Name, CreatedAt: now, UpdatedAt: now, AgentCount: len(body.Agents)}
		groupChatMu.Lock()
		if err := writeGroupMeta(meta); err != nil {
			groupChatMu.Unlock()
			jsonError(w, err.Error(), 500)
			return
		}
		_ = os.MkdirAll(groupAgentsDir(groupID), 0755)
		_ = writeGroupMessages(groupID, []GroupChatMessage{})
		createdAgents := []GroupChatAgent{}
		for i, a := range body.Agents {
			if strings.TrimSpace(a.Name) == "" {
				continue
			}
			color := strings.TrimSpace(a.Color)
			if color == "" {
				color = defaultGroupAgentColor(i)
			}
			agent := GroupChatAgent{ID: fmt.Sprintf("agent-%d-%d", time.Now().UnixNano(), i), GroupID: groupID, Name: strings.TrimSpace(a.Name), Model: strings.TrimSpace(a.Model), Provider: strings.TrimSpace(a.Provider), SystemPrompt: strings.TrimSpace(a.SystemPrompt), Color: color, CreatedAt: now}
			if agent.SystemPrompt == "" {
				agent.SystemPrompt = "你是" + agent.Name + "，请用中文简洁、专业地参与团队讨论。"
			}
			if err := writeGroupAgent(agent); err != nil {
				groupChatMu.Unlock()
				jsonError(w, err.Error(), 500)
				return
			}
			createdAgents = append(createdAgents, agent)
		}
		meta.AgentCount = len(createdAgents)
		_ = writeGroupMeta(meta)
		groupChatMu.Unlock()
		jsonResponse(w, map[string]any{"group": GroupChatFull{ID: meta.ID, Name: meta.Name, CreatedAt: meta.CreatedAt, UpdatedAt: meta.UpdatedAt, Agents: createdAgents, Messages: []GroupChatMessage{}}})
	default:
		jsonError(w, "method not allowed", 405)
	}
}

func handleGroupChatRouter(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(204)
		return
	}
	initGroupChatStore()
	path := strings.TrimPrefix(r.URL.Path, "/v1/agent/group-chats/")
	parts := strings.Split(strings.Trim(path, "/"), "/")
	if len(parts) == 0 || parts[0] == "" {
		jsonError(w, "missing group id", 400)
		return
	}
	groupID := parts[0]
	if len(parts) == 1 {
		switch r.Method {
		case "GET":
			g, err := getGroupFull(groupID)
			if err != nil {
				jsonError(w, "group not found", 404)
				return
			}
			jsonResponse(w, map[string]any{"group": g})
		case "DELETE":
			groupChatMu.Lock()
			_ = os.Remove(groupPath(groupID))
			_ = os.RemoveAll(groupAgentsDir(groupID))
			_ = os.Remove(groupMessagesPath(groupID))
			groupChatMu.Unlock()
			jsonResponse(w, map[string]any{"deleted": groupID})
		default:
			jsonError(w, "method not allowed", 405)
		}
		return
	}
	if parts[1] == "agents" {
		handleGroupChatAgents(w, r, groupID, parts)
		return
	}
	if parts[1] == "messages" {
		handleGroupChatMessages(w, r, groupID)
		return
	}
	jsonError(w, "not found", 404)
}

func handleGroupChatAgents(w http.ResponseWriter, r *http.Request, groupID string, parts []string) {
	if _, err := readGroupMeta(groupID); err != nil {
		jsonError(w, "group not found", 404)
		return
	}
	if len(parts) == 2 && r.Method == "POST" {
		var body struct {
			Name         string `json:"name"`
			Model        string `json:"model"`
			Provider     string `json:"provider"`
			SystemPrompt string `json:"system_prompt"`
			Color        string `json:"color"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			jsonError(w, "invalid body", 400)
			return
		}
		if strings.TrimSpace(body.Name) == "" {
			jsonError(w, "agent name is required", 400)
			return
		}
		now := time.Now().UTC().Format(time.RFC3339)
		agent := GroupChatAgent{ID: fmt.Sprintf("agent-%d", time.Now().UnixNano()), GroupID: groupID, Name: strings.TrimSpace(body.Name), Model: strings.TrimSpace(body.Model), Provider: strings.TrimSpace(body.Provider), SystemPrompt: strings.TrimSpace(body.SystemPrompt), Color: strings.TrimSpace(body.Color), CreatedAt: now}
		if agent.Color == "" {
			agent.Color = defaultGroupAgentColor(0)
		}
		if agent.SystemPrompt == "" {
			agent.SystemPrompt = "你是" + agent.Name + "，请用中文简洁、专业地参与团队讨论。"
		}
		groupChatMu.Lock()
		if err := writeGroupAgent(agent); err != nil {
			groupChatMu.Unlock()
			jsonError(w, err.Error(), 500)
			return
		}
		agents, _ := readGroupAgents(groupID)
		if meta, err := readGroupMeta(groupID); err == nil {
			meta.AgentCount = len(agents)
			meta.UpdatedAt = now
			_ = writeGroupMeta(*meta)
		}
		groupChatMu.Unlock()
		jsonResponse(w, map[string]any{"agent": agent})
		return
	}
	if len(parts) == 3 && r.Method == "DELETE" {
		agentID := parts[2]
		groupChatMu.Lock()
		_ = os.Remove(filepath.Join(groupAgentsDir(groupID), safeGroupID(agentID)+".json"))
		agents, _ := readGroupAgents(groupID)
		if meta, err := readGroupMeta(groupID); err == nil {
			meta.AgentCount = len(agents)
			meta.UpdatedAt = time.Now().UTC().Format(time.RFC3339)
			_ = writeGroupMeta(*meta)
		}
		groupChatMu.Unlock()
		jsonResponse(w, map[string]any{"removed": agentID})
		return
	}
	jsonError(w, "method not allowed", 405)
}

func handleGroupChatMessages(w http.ResponseWriter, r *http.Request, groupID string) {
	if _, err := readGroupMeta(groupID); err != nil {
		jsonError(w, "group not found", 404)
		return
	}
	switch r.Method {
	case "GET":
		messages, err := readGroupMessages(groupID)
		if err != nil {
			jsonError(w, err.Error(), 500)
			return
		}
		limit := parseIntQuery(r, "limit", 50)
		offset := parseIntQuery(r, "offset", 0)
		if offset < 0 {
			offset = 0
		}
		if limit <= 0 {
			limit = 50
		}
		total := len(messages)
		if offset > total {
			offset = total
		}
		end := offset + limit
		if end > total {
			end = total
		}
		jsonResponse(w, map[string]any{"messages": messages[offset:end], "total": total, "limit": limit, "offset": offset})
	case "POST":
		handleGroupChatSend(w, r, groupID)
	default:
		jsonError(w, "method not allowed", 405)
	}
}

func handleGroupChatSend(w http.ResponseWriter, r *http.Request, groupID string) {
	var body struct {
		Content  string   `json:"content"`
		Mentions []string `json:"mentions"`
		APIBase  string   `json:"api_base"`
		APIKey   string   `json:"api_key"`
		Model    string   `json:"model"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		jsonError(w, "invalid body", 400)
		return
	}
	body.Content = strings.TrimSpace(body.Content)
	if body.Content == "" {
		jsonError(w, "content is required", 400)
		return
	}
	if strings.TrimSpace(body.APIBase) == "" || strings.TrimSpace(body.APIKey) == "" || strings.TrimSpace(body.Model) == "" {
		jsonError(w, "需要 api_base, api_key, model", 400)
		return
	}
	agents, err := readGroupAgents(groupID)
	if err != nil {
		jsonError(w, err.Error(), 500)
		return
	}
	selected := filterMentionedAgents(agents, body.Mentions)
	if len(selected) == 0 {
		selected = agents
	}
	if len(selected) == 0 {
		jsonError(w, "group has no agents", 400)
		return
	}
	now := time.Now().UTC().Format(time.RFC3339)
	mentionsJSON, _ := json.Marshal(body.Mentions)
	userMsg := GroupChatMessage{ID: fmt.Sprintf("msg-%d", time.Now().UnixNano()), GroupID: groupID, Role: "user", Content: body.Content, Timestamp: now, Mentions: string(mentionsJSON)}
	_ = appendGroupMessages(groupID, userMsg)
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	flusher, _ := w.(http.Flusher)
	for _, agent := range selected {
		content, err := runGroupAgentCompletion(agent, groupID, body.Content, body.APIBase, body.APIKey, fallbackString(agent.Model, body.Model))
		if err != nil {
			writeSSE(w, flusher, map[string]any{"type": "error", "agent_id": agent.ID, "message": err.Error()})
			continue
		}
		agentID := agent.ID
		msg := GroupChatMessage{ID: fmt.Sprintf("msg-%d", time.Now().UnixNano()), GroupID: groupID, AgentID: &agentID, Role: "assistant", Content: content, Timestamp: time.Now().UTC().Format(time.RFC3339), Mentions: ""}
		_ = appendGroupMessages(groupID, msg)
		writeSSE(w, flusher, map[string]any{"type": "agent_response", "agent_id": agent.ID, "content": content})
	}
	fmt.Fprint(w, "data: [DONE]\n\n")
	if flusher != nil {
		flusher.Flush()
	}
}

func runGroupAgentCompletion(agent GroupChatAgent, groupID, userContent, apiBase, apiKey, model string) (string, error) {
	history, _ := readGroupMessages(groupID)
	messages := []map[string]any{{"role": "system", "content": buildGroupAgentSystemPrompt(agent)}}
	start := 0
	if len(history) > 12 {
		start = len(history) - 12
	}
	for _, m := range history[start:] {
		role := m.Role
		if role != "assistant" && role != "user" {
			role = "user"
		}
		content := m.Content
		if m.AgentID != nil && *m.AgentID != agent.ID {
			content = fmt.Sprintf("另一位 Agent 的回复：%s", content)
		}
		messages = append(messages, map[string]any{"role": role, "content": content})
	}
	messages = append(messages, map[string]any{"role": "user", "content": userContent})
	payload := map[string]any{"model": model, "messages": messages, "stream": false}
	body, _ := json.Marshal(payload)
	client := &http.Client{Timeout: 90 * time.Second}
	req, err := http.NewRequest("POST", strings.TrimRight(apiBase, "/")+"/chat/completions", bytes.NewReader(body))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	respBody, _ := io.ReadAll(resp.Body)
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return "", fmt.Errorf("API 错误 (%d): %s", resp.StatusCode, truncate(string(respBody), 400))
	}
	var parsed struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}
	if err := json.Unmarshal(respBody, &parsed); err != nil {
		return "", err
	}
	if len(parsed.Choices) == 0 {
		return "", fmt.Errorf("模型没有返回内容")
	}
	content := strings.TrimSpace(parsed.Choices[0].Message.Content)
	if content == "" {
		return "", fmt.Errorf("模型返回空内容")
	}
	return content, nil
}

func buildGroupAgentSystemPrompt(agent GroupChatAgent) string {
	prompt := strings.TrimSpace(agent.SystemPrompt)
	if prompt == "" {
		prompt = "你是" + agent.Name + "，请用中文简洁、专业地参与团队讨论。"
	}
	return prompt + "\n\n你正在 Hi!XNS 多 Agent 群组聊天中。请保持你的角色立场，直接回复用户或被 @ 的任务；如果上下文里有其他 Agent 的回复，请在必要时协作或补充。"
}

func filterMentionedAgents(agents []GroupChatAgent, mentions []string) []GroupChatAgent {
	if len(mentions) == 0 {
		return nil
	}
	wanted := map[string]bool{}
	for _, id := range mentions {
		wanted[id] = true
	}
	selected := []GroupChatAgent{}
	for _, a := range agents {
		if wanted[a.ID] {
			selected = append(selected, a)
		}
	}
	return selected
}

func defaultGroupAgentColor(i int) string {
	colors := []string{"#5ac8fa", "#a78bfa", "#34d399", "#f59e0b", "#f472b6"}
	return colors[i%len(colors)]
}

func fallbackString(v, fallback string) string {
	if strings.TrimSpace(v) != "" {
		return strings.TrimSpace(v)
	}
	return strings.TrimSpace(fallback)
}

func writeSSE(w http.ResponseWriter, flusher http.Flusher, data map[string]any) {
	b, _ := json.Marshal(data)
	fmt.Fprintf(w, "data: %s\n\n", b)
	if flusher != nil {
		flusher.Flush()
	}
}

func parseIntQuery(r *http.Request, key string, def int) int {
	v := strings.TrimSpace(r.URL.Query().Get(key))
	if v == "" {
		return def
	}
	var n int
	if _, err := fmt.Sscanf(v, "%d", &n); err != nil {
		return def
	}
	return n
}
