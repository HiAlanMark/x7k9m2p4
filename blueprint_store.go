package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"sync"
)

// ── Blueprint Store ────────────────────────────────────────────────────
//
// File-based store for blueprints, runs, and inbox items.
// All data lives under the store directory derived from hermesState.SourceDir.
//
//   Store dir:  {SourceDir}/blueprints
//   Blueprints: {store}/data/blueprints/{id}.json
//   Runs:       {store}/data/blueprints/runs/{id}.json
//   Inbox:      {store}/data/blueprints/inbox.json

var (
	blueprintStoreMu sync.RWMutex
	blueprintStoreDir string // set by initBlueprintStore
)

// blueprintDir returns the root of the blueprint data tree.
func blueprintDir() string {
	return filepath.Join(blueprintStoreDir, "data", "blueprints")
}

// runsDir returns the directory holding run files.
func runsDir() string {
	return filepath.Join(blueprintDir(), "runs")
}

// inboxPath returns the path to the single inbox array file.
func inboxPath() string {
	return filepath.Join(blueprintDir(), "inbox.json")
}

// blueprintPath returns the file path for a single blueprint.
func blueprintPath(id string) string {
	return filepath.Join(blueprintDir(), id+".json")
}

// runPath returns the file path for a single run.
func runPath(id string) string {
	return filepath.Join(runsDir(), id+".json")
}

// initBlueprintStore sets up the store directory and ensures all required
// subdirectories exist. Must be called once at startup after hermesState is
// populated.
func initBlueprintStore() {
	blueprintStoreDir = hermesState.SourceDir + "/blueprints"
	dirs := []string{
		blueprintDir(),
		runsDir(),
	}
	for _, d := range dirs {
		if err := os.MkdirAll(d, 0755); err != nil {
			log.Printf("[blueprint_store] failed to create directory %s: %v", d, err)
		}
	}
	// Ensure the inbox file exists (empty array if missing).
	if _, err := os.Stat(inboxPath()); os.IsNotExist(err) {
		if err := os.WriteFile(inboxPath(), []byte("[]"), 0644); err != nil {
			log.Printf("[blueprint_store] failed to create inbox file: %v", err)
		}
	}
}

// ── Blueprints ─────────────────────────────────────────────────────────

// listBlueprints returns all saved blueprint definitions.
func listBlueprints() ([]BlueprintDefinition, error) {
	blueprintStoreMu.RLock()
	defer blueprintStoreMu.RUnlock()

	dir := blueprintDir()
	entries, err := os.ReadDir(dir)
	if err != nil {
		if os.IsNotExist(err) {
			return nil, nil
		}
		return nil, fmt.Errorf("list blueprints: %w", err)
	}

	var result []BlueprintDefinition
	for _, e := range entries {
		if e.IsDir() || !strings.HasSuffix(e.Name(), ".json") {
			continue
		}
		// Skip non-blueprint files (inbox.json lives here too).
		if e.Name() == "inbox.json" {
			continue
		}
		data, err := os.ReadFile(filepath.Join(dir, e.Name()))
		if err != nil {
			continue
		}
		var bp BlueprintDefinition
		if err := json.Unmarshal(data, &bp); err != nil {
			continue
		}
		result = append(result, bp)
	}
	return result, nil
}

// getBlueprint reads a single blueprint definition by id.
func getBlueprint(id string) (BlueprintDefinition, error) {
	blueprintStoreMu.RLock()
	defer blueprintStoreMu.RUnlock()

	p := blueprintPath(id)
	data, err := os.ReadFile(p)
	if err != nil {
		if os.IsNotExist(err) {
			return BlueprintDefinition{}, fmt.Errorf("blueprint %s not found", id)
		}
		return BlueprintDefinition{}, fmt.Errorf("get blueprint %s: %w", id, err)
	}
	var bp BlueprintDefinition
	if err := json.Unmarshal(data, &bp); err != nil {
		return BlueprintDefinition{}, fmt.Errorf("decode blueprint %s: %w", id, err)
	}
	return bp, nil
}

// saveBlueprint writes a blueprint definition to disk.
func saveBlueprint(bp BlueprintDefinition) error {
	blueprintStoreMu.Lock()
	defer blueprintStoreMu.Unlock()

	if bp.ID == "" {
		return fmt.Errorf("blueprint id is required")
	}
	if err := os.MkdirAll(blueprintDir(), 0755); err != nil {
		return fmt.Errorf("ensure blueprint dir: %w", err)
	}
	data, err := json.MarshalIndent(bp, "", "  ")
	if err != nil {
		return fmt.Errorf("encode blueprint %s: %w", bp.ID, err)
	}
	p := blueprintPath(bp.ID)
	if err := os.WriteFile(p, data, 0644); err != nil {
		return fmt.Errorf("write blueprint %s: %w", bp.ID, err)
	}
	return nil
}

// deleteBlueprint removes a blueprint definition from disk.
func deleteBlueprint(id string) error {
	blueprintStoreMu.Lock()
	defer blueprintStoreMu.Unlock()

	p := blueprintPath(id)
	if err := os.Remove(p); err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("delete blueprint %s: %w", id, err)
	}
	return nil
}

// ── Runs ───────────────────────────────────────────────────────────────

// listRuns returns all runs for a given blueprintID. If blueprintID is empty,
// it returns all runs across all blueprints.
func listRuns(blueprintID string) ([]BlueprintRun, error) {
	blueprintStoreMu.RLock()
	defer blueprintStoreMu.RUnlock()

	dir := runsDir()
	entries, err := os.ReadDir(dir)
	if err != nil {
		if os.IsNotExist(err) {
			return nil, nil
		}
		return nil, fmt.Errorf("list runs: %w", err)
	}

	var result []BlueprintRun
	for _, e := range entries {
		if e.IsDir() || !strings.HasSuffix(e.Name(), ".json") {
			continue
		}
		data, err := os.ReadFile(filepath.Join(dir, e.Name()))
		if err != nil {
			continue
		}
		var run BlueprintRun
		if err := json.Unmarshal(data, &run); err != nil {
			continue
		}
		if blueprintID == "" || run.BlueprintID == blueprintID {
			result = append(result, run)
		}
	}
	return result, nil
}

// getRun reads a single run by id.
func getRun(runID string) (BlueprintRun, error) {
	blueprintStoreMu.RLock()
	defer blueprintStoreMu.RUnlock()

	p := runPath(runID)
	data, err := os.ReadFile(p)
	if err != nil {
		if os.IsNotExist(err) {
			return BlueprintRun{}, fmt.Errorf("run %s not found", runID)
		}
		return BlueprintRun{}, fmt.Errorf("get run %s: %w", runID, err)
	}
	var run BlueprintRun
	if err := json.Unmarshal(data, &run); err != nil {
		return BlueprintRun{}, fmt.Errorf("decode run %s: %w", runID, err)
	}
	return run, nil
}

// saveRun writes a run to disk.
func saveRun(run BlueprintRun) error {
	blueprintStoreMu.Lock()
	defer blueprintStoreMu.Unlock()

	if run.ID == "" {
		return fmt.Errorf("run id is required")
	}
	if err := os.MkdirAll(runsDir(), 0755); err != nil {
		return fmt.Errorf("ensure runs dir: %w", err)
	}
	data, err := json.MarshalIndent(run, "", "  ")
	if err != nil {
		return fmt.Errorf("encode run %s: %w", run.ID, err)
	}
	p := runPath(run.ID)
	if err := os.WriteFile(p, data, 0644); err != nil {
		return fmt.Errorf("write run %s: %w", run.ID, err)
	}
	return nil
}

// ── Inbox ──────────────────────────────────────────────────────────────
// The inbox is stored as a single JSON array file (inbox.json).

// readInbox is an internal helper that reads the full inbox array.
// Caller must hold at least a read lock.
func readInbox() ([]InboxItem, error) {
	p := inboxPath()
	data, err := os.ReadFile(p)
	if err != nil {
		if os.IsNotExist(err) {
			return []InboxItem{}, nil
		}
		return nil, fmt.Errorf("read inbox: %w", err)
	}
	var items []InboxItem
	if err := json.Unmarshal(data, &items); err != nil {
		return nil, fmt.Errorf("decode inbox: %w", err)
	}
	return items, nil
}

// writeInbox is an internal helper that writes the full inbox array.
// Caller must hold a write lock.
func writeInbox(items []InboxItem) error {
	if err := os.MkdirAll(blueprintDir(), 0755); err != nil {
		return fmt.Errorf("ensure inbox dir: %w", err)
	}
	data, err := json.MarshalIndent(items, "", "  ")
	if err != nil {
		return fmt.Errorf("encode inbox: %w", err)
	}
	if err := os.WriteFile(inboxPath(), data, 0644); err != nil {
		return fmt.Errorf("write inbox: %w", err)
	}
	return nil
}

// listInbox returns all inbox items.
func listInbox() ([]InboxItem, error) {
	blueprintStoreMu.RLock()
	defer blueprintStoreMu.RUnlock()

	return readInbox()
}

// getInboxItem returns a single inbox item by id.
func getInboxItem(id string) (InboxItem, error) {
	blueprintStoreMu.RLock()
	defer blueprintStoreMu.RUnlock()

	items, err := readInbox()
	if err != nil {
		return InboxItem{}, err
	}
	for _, item := range items {
		if item.ID == id {
			return item, nil
		}
	}
	return InboxItem{}, fmt.Errorf("inbox item %s not found", id)
}

// saveInboxItem adds or updates an inbox item. If an item with the same ID
// already exists, it is replaced; otherwise the item is appended.
func saveInboxItem(item InboxItem) error {
	blueprintStoreMu.Lock()
	defer blueprintStoreMu.Unlock()

	items, err := readInbox()
	if err != nil {
		return err
	}
	replaced := false
	for i, existing := range items {
		if existing.ID == item.ID {
			items[i] = item
			replaced = true
			break
		}
	}
	if !replaced {
		items = append(items, item)
	}
	return writeInbox(items)
}

// deleteInboxItem removes an inbox item by id.
func deleteInboxItem(id string) error {
	blueprintStoreMu.Lock()
	defer blueprintStoreMu.Unlock()

	items, err := readInbox()
	if err != nil {
		return err
	}
	filtered := make([]InboxItem, 0, len(items))
	found := false
	for _, item := range items {
		if item.ID == id {
			found = true
			continue
		}
		filtered = append(filtered, item)
	}
	if !found {
		return fmt.Errorf("inbox item %s not found", id)
	}
	return writeInbox(filtered)
}
