package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
)

type InboxItemType string

const (
	InboxItemTypeApproval     InboxItemType = "approval"
	InboxItemTypeProposal     InboxItemType = "proposal"
	InboxItemTypeNotification InboxItemType = "notification"
)

type InboxItemStatus string

const (
	InboxItemStatusPending  InboxItemStatus = "pending"
	InboxItemStatusApproved InboxItemStatus = "approved"
	InboxItemStatusRejected InboxItemStatus = "rejected"
	InboxItemStatusRead     InboxItemStatus = "read"
	InboxItemStatusDone     InboxItemStatus = "done"
)

type InboxItem struct {
	ID              string          `json:"id"`
	Type            InboxItemType   `json:"type"`
	Title           string          `json:"title"`
	Description     string          `json:"description"`
	Status          InboxItemStatus `json:"status"`
	BlueprintID     string          `json:"blueprint_id,omitempty"`
	RunID           string          `json:"run_id,omitempty"`
	NodeID          string          `json:"node_id,omitempty"`
	Comment         string          `json:"comment,omitempty"`
	CreatedByRoleID string          `json:"created_by_role_id,omitempty"`
	TargetRoleID    string          `json:"target_role_id,omitempty"`
	Summary         string          `json:"summary,omitempty"`
	Preview         string          `json:"preview,omitempty"`
	DiffSummary     string          `json:"diff_summary,omitempty"`
	Schema          interface{}     `json:"schema,omitempty"`
	CreatedAt       time.Time       `json:"created_at"`
	ResolvedAt      *time.Time      `json:"resolved_at,omitempty"`
}

type AgentRun struct {
	ID          string      `json:"id"`
	Status      string      `json:"status"`
	Name        string      `json:"name,omitempty"`
	CreatedAt   time.Time   `json:"created_at"`
	FinishedAt  *time.Time  `json:"finished_at,omitempty"`
	FinalResult interface{} `json:"final_result,omitempty"`
}

var inboxStoreMu sync.RWMutex

func agentDataDir() string {
	base := hermesState.SourceDir
	if base == "" {
		if home, err := os.UserHomeDir(); err == nil {
			base = filepath.Join(home, ".hixns")
		} else {
			base = "."
		}
	}
	return filepath.Join(base, "data")
}

func inboxFilePath() string { return filepath.Join(agentDataDir(), "inbox.json") }

func ensureInboxStore() error {
	if err := os.MkdirAll(filepath.Dir(inboxFilePath()), 0755); err != nil {
		return err
	}
	if _, err := os.Stat(inboxFilePath()); os.IsNotExist(err) {
		return os.WriteFile(inboxFilePath(), []byte("[]"), 0644)
	}
	return nil
}

func readInboxItems() ([]InboxItem, error) {
	if err := ensureInboxStore(); err != nil { return nil, err }
	data, err := os.ReadFile(inboxFilePath())
	if err != nil { return nil, err }
	var items []InboxItem
	if len(strings.TrimSpace(string(data))) == 0 { return []InboxItem{}, nil }
	if err := json.Unmarshal(data, &items); err != nil { return nil, err }
	if items == nil { items = []InboxItem{} }
	return items, nil
}

func writeInboxItems(items []InboxItem) error {
	if err := ensureInboxStore(); err != nil { return err }
	data, err := json.MarshalIndent(items, "", "  ")
	if err != nil { return err }
	return os.WriteFile(inboxFilePath(), data, 0644)
}

func listInbox() ([]InboxItem, error) {
	inboxStoreMu.RLock(); defer inboxStoreMu.RUnlock()
	return readInboxItems()
}

func getInboxItem(id string) (InboxItem, error) {
	items, err := listInbox(); if err != nil { return InboxItem{}, err }
	for _, item := range items { if item.ID == id { return item, nil } }
	return InboxItem{}, fmt.Errorf("inbox item %s not found", id)
}

func saveInboxItem(item InboxItem) error {
	inboxStoreMu.Lock(); defer inboxStoreMu.Unlock()
	items, err := readInboxItems(); if err != nil { return err }
	for i, existing := range items { if existing.ID == item.ID { items[i] = item; return writeInboxItems(items) } }
	items = append(items, item)
	return writeInboxItems(items)
}

func handleRunsList(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" { w.WriteHeader(http.StatusNoContent); return }
	if r.Method != "GET" { http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed); return }
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode([]AgentRun{})
}

func handleInboxList(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" { w.WriteHeader(http.StatusNoContent); return }
	if r.Method != "GET" { http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed); return }
	items, err := listInbox(); if err != nil { http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 500); return }
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}

func handleInboxCreate(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" { w.WriteHeader(http.StatusNoContent); return }
	if r.Method != "POST" { http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed); return }
	var body InboxItem
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil { http.Error(w, `{"error":"invalid body"}`, 400); return }
	if body.Title == "" { http.Error(w, `{"error":"title is required"}`, 400); return }
	if body.ID == "" { body.ID = uuid.New().String() }
	if body.Type == "" { body.Type = InboxItemTypeNotification }
	if body.Status == "" { body.Status = InboxItemStatusPending }
	if body.CreatedAt.IsZero() { body.CreatedAt = time.Now() }
	if err := saveInboxItem(body); err != nil { http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 500); return }
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(body)
}

func handleInboxRouter(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" { w.WriteHeader(http.StatusNoContent); return }
	if r.Method != "POST" { http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed); return }
	path := strings.TrimPrefix(r.URL.Path, "/v1/agent/inbox/")
	parts := strings.SplitN(path, "/", 2)
	if len(parts) != 2 || parts[0] == "" { http.NotFound(w, r); return }
	item, err := getInboxItem(parts[0]); if err != nil { http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 404); return }
	now := time.Now()
	switch parts[1] {
	case "approve": item.Status = InboxItemStatusApproved; item.ResolvedAt = &now
	case "reject": item.Status = InboxItemStatusRejected; item.ResolvedAt = &now
	case "read": item.Status = InboxItemStatusRead; item.ResolvedAt = &now
	case "reply":
		var body struct{ Reply string `json:"reply"` }
		_ = json.NewDecoder(r.Body).Decode(&body)
		if body.Reply != "" { item.Comment = body.Reply }
		item.Status = InboxItemStatusPending
	default: http.NotFound(w, r); return
	}
	if err := saveInboxItem(item); err != nil { http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 500); return }
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(item)
}
