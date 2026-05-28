package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"sync"
	"time"
)

// ── Chat Session Store ─────────────────────────────────────────────────
//
// File-based store for chat sessions.
//   Sessions dir: {SourceDir}/chats/sessions/{id}.json
//   Messages dir: {SourceDir}/chats/messages/{session_id}/{msg_id}.json
//
// Each session file stores session metadata (id, title, created_at, updated_at).
// Messages are stored individually in a subdirectory for the session to avoid
// rewriting a large array on every message.

var (
	chatStoreMu sync.RWMutex
	chatStoreDir string // set by initChatStore
)

func chatsDir() string {
	return filepath.Join(hermesState.SourceDir, "chats")
}

func sessionsDir() string {
	return filepath.Join(chatsDir(), "sessions")
}

func messagesDir(sessionID string) string {
	return filepath.Join(chatsDir(), "messages", sessionID)
}

func sessionPath(id string) string {
	return filepath.Join(sessionsDir(), id+".json")
}

func messagePath(sessionID string) string {
	return filepath.Join(chatsDir(), "messages", sessionID, "messages.json")
}

// ChatSessionMeta stores session metadata (without full messages).
type ChatSessionMeta struct {
	ID        string `json:"id"`
	Title     string `json:"title"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
	MessageCount int `json:"message_count"`
}

// initChatStore sets up the chat store directory.
func initChatStore() {
	if hermesState.SourceDir == "" {
		log.Printf("[chat_store] SourceDir is empty, skipping init")
		return
	}
	dirs := []string{sessionsDir(), filepath.Join(chatsDir(), "messages")}
	for _, d := range dirs {
		if err := os.MkdirAll(d, 0755); err != nil {
			log.Printf("[chat_store] failed to create directory %s: %v", d, err)
		}
	}
}

// listChatSessions returns all session metadata, sorted by updated_at desc.
func listChatSessions() ([]ChatSessionMeta, error) {
	chatStoreMu.RLock()
	defer chatStoreMu.RUnlock()

	entries, err := os.ReadDir(sessionsDir())
	if err != nil {
		if os.IsNotExist(err) {
			return []ChatSessionMeta{}, nil
		}
		return nil, fmt.Errorf("read sessions dir: %w", err)
	}

	var metas []ChatSessionMeta
	for _, e := range entries {
		if e.IsDir() || filepath.Ext(e.Name()) != ".json" {
			continue
		}
		data, err := os.ReadFile(filepath.Join(sessionsDir(), e.Name()))
		if err != nil {
			log.Printf("[chat_store] failed to read session %s: %v", e.Name(), err)
			continue
		}
		var meta ChatSessionMeta
		if err := json.Unmarshal(data, &meta); err != nil {
			log.Printf("[chat_store] failed to parse session %s: %v", e.Name(), err)
			continue
		}
		metas = append(metas, meta)
	}

	// Sort by updated_at descending (most recent first).
	sort.Slice(metas, func(i, j int) bool {
		return metas[i].UpdatedAt > metas[j].UpdatedAt
	})
	return metas, nil
}

// createChatSession creates a new session with the given title.
func createChatSession(title string) (*ChatSessionMeta, error) {
	chatStoreMu.Lock()
	defer chatStoreMu.Unlock()

	now := time.Now().UTC().Format(time.RFC3339)
	id := fmt.Sprintf("chat-%d-%d", time.Now().UnixNano(), time.Now().UnixMilli()%10000)
	if id == "" {
		id = "chat-" + now
	}

	meta := ChatSessionMeta{
		ID:    id,
		Title: title,
		CreatedAt: now,
		UpdatedAt: now,
		MessageCount: 0,
	}

	data, err := json.MarshalIndent(meta, "", "  ")
	if err != nil {
		return nil, fmt.Errorf("marshal session: %w", err)
	}

	if err := os.WriteFile(sessionPath(id), data, 0644); err != nil {
		return nil, fmt.Errorf("write session: %w", err)
	}

	// Create messages directory and empty messages file.
	msgDir := messagesDir(id)
	if err := os.MkdirAll(msgDir, 0755); err != nil {
		return nil, fmt.Errorf("create messages dir: %w", err)
	}
	if err := os.WriteFile(messagePath(id), []byte("[]"), 0644); err != nil {
		return nil, fmt.Errorf("create messages file: %w", err)
	}

	return &meta, nil
}

// getChatSessionMessages returns all messages for a session.
func getChatSessionMessages(sessionID string) ([]map[string]any, error) {
	chatStoreMu.RLock()
	defer chatStoreMu.RUnlock()

	path := messagePath(sessionID)
	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return []map[string]any{}, nil
		}
		return nil, fmt.Errorf("read messages: %w", err)
	}

	var messages []map[string]any
	if err := json.Unmarshal(data, &messages); err != nil {
		return nil, fmt.Errorf("parse messages: %w", err)
	}
	return messages, nil
}

// appendChatMessages appends messages to a session.
func appendChatMessages(sessionID string, newMessages []map[string]any) error {
	chatStoreMu.Lock()
	defer chatStoreMu.Unlock()

	path := messagePath(sessionID)

	// Read existing messages.
	existing := []map[string]any{}
	if data, err := os.ReadFile(path); err == nil {
		_ = json.Unmarshal(data, &existing)
	}

	// Append new messages.
	existing = append(existing, newMessages...)

	// Write back.
	data, err := json.MarshalIndent(existing, "", "  ")
	if err != nil {
		return fmt.Errorf("marshal messages: %w", err)
	}

	if err := os.WriteFile(path, data, 0644); err != nil {
		return fmt.Errorf("write messages: %w", err)
	}

	// Update session metadata.
	metaPath := sessionPath(sessionID)
	if metaData, err := os.ReadFile(metaPath); err == nil {
		var meta ChatSessionMeta
		if err := json.Unmarshal(metaData, &meta); err == nil {
			meta.UpdatedAt = time.Now().UTC().Format(time.RFC3339)
			meta.MessageCount = len(existing)
			if data, err := json.MarshalIndent(meta, "", "  "); err == nil {
				os.WriteFile(metaPath, data, 0644)
			}
		}
	}

	return nil
}

// renameChatSession updates the title of a session.
func renameChatSession(sessionID string, title string) error {
	chatStoreMu.Lock()
	defer chatStoreMu.Unlock()

	metaPath := sessionPath(sessionID)
	data, err := os.ReadFile(metaPath)
	if err != nil {
		return fmt.Errorf("read session: %w", err)
	}

	var meta ChatSessionMeta
	if err := json.Unmarshal(data, &meta); err != nil {
		return fmt.Errorf("parse session: %w", err)
	}

	meta.Title = title
	meta.UpdatedAt = time.Now().UTC().Format(time.RFC3339)

	data, err = json.MarshalIndent(meta, "", "  ")
	if err != nil {
		return fmt.Errorf("marshal session: %w", err)
	}

	return os.WriteFile(metaPath, data, 0644)
}

// deleteChatSession removes a session and its messages.
func deleteChatSession(sessionID string) error {
	chatStoreMu.Lock()
	defer chatStoreMu.Unlock()

	// Delete session metadata file.
	if err := os.Remove(sessionPath(sessionID)); err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("delete session: %w", err)
	}

	// Delete messages directory.
	msgDir := messagesDir(sessionID)
	if err := os.RemoveAll(msgDir); err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("delete messages: %w", err)
	}

	return nil
}

// saveChatSessionMessages replaces all messages for a session (used for bulk save).
func saveChatSessionMessages(sessionID string, messages []map[string]any) error {
	chatStoreMu.Lock()
	defer chatStoreMu.Unlock()

	path := messagePath(sessionID)

	data, err := json.MarshalIndent(messages, "", "  ")
	if err != nil {
		return fmt.Errorf("marshal messages: %w", err)
	}

	if err := os.WriteFile(path, data, 0644); err != nil {
		return fmt.Errorf("write messages: %w", err)
	}

	// Update session metadata.
	metaPath := sessionPath(sessionID)
	if metaData, err := os.ReadFile(metaPath); err == nil {
		var meta ChatSessionMeta
		if err := json.Unmarshal(metaData, &meta); err == nil {
			meta.UpdatedAt = time.Now().UTC().Format(time.RFC3339)
			meta.MessageCount = len(messages)
			if data, err := json.MarshalIndent(meta, "", "  "); err == nil {
				os.WriteFile(metaPath, data, 0644)
			}
		}
	}

	return nil
}
