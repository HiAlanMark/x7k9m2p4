package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
)

// ── Blueprint HTTP Handlers ────────────────────────────────────────────
//
// All handlers follow the existing pattern: setCORS(w), OPTIONS preflight,
// json.NewDecoder for request bodies, json.NewEncoder for responses.

// handleBlueprintsList — GET /v1/agent/blueprints
func handleBlueprintsList(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" { w.WriteHeader(204); return }
	if r.Method != "GET" {
		http.Error(w, `{"error":"method not allowed"}`, 405)
		return
	}
	bps, err := listBlueprints()
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 500)
		return
	}
	if bps == nil {
		bps = []BlueprintDefinition{}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(bps)
}

// handleBlueprintsCreate — POST /v1/agent/blueprints
func handleBlueprintsCreate(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" { w.WriteHeader(204); return }
	if r.Method != "POST" {
		http.Error(w, `{"error":"method not allowed"}`, 405)
		return
	}
	var bp BlueprintDefinition
	if err := json.NewDecoder(r.Body).Decode(&bp); err != nil {
		http.Error(w, `{"error":"invalid body"}`, 400)
		return
	}
	bp.ID = uuid.New().String()
	now := time.Now()
	bp.CreatedAt = now
	bp.UpdatedAt = now
	if bp.Version == 0 {
		bp.Version = 1
	}
	if err := saveBlueprint(bp); err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(bp)
}

// handleBlueprintsGet — GET /v1/agent/blueprints/{id}
func handleBlueprintsGet(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" { w.WriteHeader(204); return }
	if r.Method != "GET" {
		http.Error(w, `{"error":"method not allowed"}`, 405)
		return
	}
	id := strings.TrimPrefix(r.URL.Path, "/v1/agent/blueprints/")
	if id == "" {
		http.Error(w, `{"error":"blueprint id is required"}`, 400)
		return
	}
	bp, err := getBlueprint(id)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 404)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(bp)
}

// handleBlueprintsUpdate — PUT /v1/agent/blueprints/{id}
func handleBlueprintsUpdate(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" { w.WriteHeader(204); return }
	if r.Method != "PUT" {
		http.Error(w, `{"error":"method not allowed"}`, 405)
		return
	}
	id := strings.TrimPrefix(r.URL.Path, "/v1/agent/blueprints/")
	if id == "" {
		http.Error(w, `{"error":"blueprint id is required"}`, 400)
		return
	}
	var bp BlueprintDefinition
	if err := json.NewDecoder(r.Body).Decode(&bp); err != nil {
		http.Error(w, `{"error":"invalid body"}`, 400)
		return
	}
	bp.ID = id
	bp.UpdatedAt = time.Now()
	if err := saveBlueprint(bp); err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(bp)
}

// handleBlueprintsDelete — DELETE /v1/agent/blueprints/{id}
func handleBlueprintsDelete(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" { w.WriteHeader(204); return }
	if r.Method != "DELETE" {
		http.Error(w, `{"error":"method not allowed"}`, 405)
		return
	}
	id := strings.TrimPrefix(r.URL.Path, "/v1/agent/blueprints/")
	if id == "" {
		http.Error(w, `{"error":"blueprint id is required"}`, 400)
		return
	}
	if err := deleteBlueprint(id); err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{"ok": true})
}

// handleBlueprintsExport — GET /v1/agent/blueprints/{id}/export
func handleBlueprintsExport(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" { w.WriteHeader(204); return }
	if r.Method != "GET" {
		http.Error(w, `{"error":"method not allowed"}`, 405)
		return
	}
	id := strings.TrimPrefix(r.URL.Path, "/v1/agent/blueprints/")
	id = strings.TrimSuffix(id, "/export")
	if id == "" {
		http.Error(w, `{"error":"blueprint id is required"}`, 400)
		return
	}
	bp, err := getBlueprint(id)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 404)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"schema":      "hixns.blueprint-package/v1",
		"blueprint":   bp,
		"exported_at": time.Now(),
	})
}

// handleBlueprintsImport — POST /v1/agent/blueprints/import
func handleBlueprintsImport(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" { w.WriteHeader(204); return }
	if r.Method != "POST" {
		http.Error(w, `{"error":"method not allowed"}`, 405)
		return
	}
	var payload struct {
		Schema    string              `json:"schema"`
		Blueprint BlueprintDefinition `json:"blueprint"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, `{"error":"invalid body"}`, 400)
		return
	}
	if payload.Schema != "hixns.blueprint-package/v1" {
		http.Error(w, `{"error":"unsupported schema"}`, 400)
		return
	}
	bp := payload.Blueprint
	if bp.ID == "" {
		bp.ID = uuid.New().String()
	}
	now := time.Now()
	bp.UpdatedAt = now
	if bp.CreatedAt.IsZero() {
		bp.CreatedAt = now
	}
	if bp.Version == 0 {
		bp.Version = 1
	}
	if err := saveBlueprint(bp); err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(bp)
}

// handleBlueprintsRuns — GET /v1/agent/blueprints/{id}/runs
func handleBlueprintsRuns(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" { w.WriteHeader(204); return }
	if r.Method != "GET" {
		http.Error(w, `{"error":"method not allowed"}`, 405)
		return
	}
	id := strings.TrimPrefix(r.URL.Path, "/v1/agent/blueprints/")
	id = strings.TrimSuffix(id, "/runs")
	if id == "" {
		http.Error(w, `{"error":"blueprint id is required"}`, 400)
		return
	}
	runs, err := listRuns(id)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 500)
		return
	}
	if runs == nil {
		runs = []BlueprintRun{}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(runs)
}

// handleBlueprintsRunCreate — POST /v1/agent/blueprints/{id}/runs
func handleBlueprintsRunCreate(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" { w.WriteHeader(204); return }
	if r.Method != "POST" {
		http.Error(w, `{"error":"method not allowed"}`, 405)
		return
	}
	bpID := strings.TrimPrefix(r.URL.Path, "/v1/agent/blueprints/")
	bpID = strings.TrimSuffix(bpID, "/runs")
	if bpID == "" {
		http.Error(w, `{"error":"blueprint id is required"}`, 400)
		return
	}
	// Verify blueprint exists
	if _, err := getBlueprint(bpID); err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 404)
		return
	}
	runID := uuid.New().String()
	now := time.Now()
	run := BlueprintRun{
		ID:          runID,
		BlueprintID: bpID,
		Status:      RunStatusQueued,
		NodeRuns:    []BlueprintNodeRun{},
		StartedAt:   &now,
	}
	if err := saveRun(run); err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 500)
		return
	}
	// Launch the DAG execution in a goroutine
	go runBlueprintDAG(bpID, runID)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(run)
}

// handleRunGet — GET /v1/agent/runs/{id}
func handleRunGet(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" { w.WriteHeader(204); return }
	if r.Method != "GET" {
		http.Error(w, `{"error":"method not allowed"}`, 405)
		return
	}
	id := strings.TrimPrefix(r.URL.Path, "/v1/agent/runs/")
	if id == "" {
		http.Error(w, `{"error":"run id is required"}`, 400)
		return
	}
	run, err := getRun(id)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 404)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(run)
}

// handleRunCancel — POST /v1/agent/runs/{id}/cancel
func handleRunCancel(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" { w.WriteHeader(204); return }
	if r.Method != "POST" {
		http.Error(w, `{"error":"method not allowed"}`, 405)
		return
	}
	id := strings.TrimPrefix(r.URL.Path, "/v1/agent/runs/")
	id = strings.TrimSuffix(id, "/cancel")
	if id == "" {
		http.Error(w, `{"error":"run id is required"}`, 400)
		return
	}
	run, err := getRun(id)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 404)
		return
	}
	// Trigger context cancellation for the running DAG goroutine.
	runningBlueprintsMu.Lock()
	if cancelFn, ok := runningBlueprints[id]; ok {
		cancelFn()
		delete(runningBlueprints, id)
	}
	runningBlueprintsMu.Unlock()

	run.Status = RunStatusCancelled
	now := time.Now()
	run.FinishedAt = &now
	if err := saveRun(run); err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(run)
}

// ── Inbox Handlers ─────────────────────────────────────────────────────

// handleInboxList — GET /v1/agent/inbox
func handleInboxList(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" { w.WriteHeader(204); return }
	if r.Method != "GET" {
		http.Error(w, `{"error":"method not allowed"}`, 405)
		return
	}
	items, err := listInbox()
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 500)
		return
	}
	if items == nil {
		items = []InboxItem{}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}

// handleInboxApprove — POST /v1/agent/inbox/{id}/approve
func handleInboxApprove(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" { w.WriteHeader(204); return }
	if r.Method != "POST" {
		http.Error(w, `{"error":"method not allowed"}`, 405)
		return
	}
	id := strings.TrimPrefix(r.URL.Path, "/v1/agent/inbox/")
	id = strings.TrimSuffix(id, "/approve")
	if id == "" {
		http.Error(w, `{"error":"inbox item id is required"}`, 400)
		return
	}
	item, err := getInboxItem(id)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 404)
		return
	}
	item.Status = InboxItemStatusApproved
	now := time.Now()
	item.ResolvedAt = &now
	if err := saveInboxItem(item); err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 500)
		return
	}
	// Complete the linked approval if this inbox item has a request ID
	if item.Type == InboxItemTypeApproval {
		completeApproval(item.ID, approvalResult{Approved: true})
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(item)
}

// handleInboxReject — POST /v1/agent/inbox/{id}/reject
func handleInboxReject(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" { w.WriteHeader(204); return }
	if r.Method != "POST" {
		http.Error(w, `{"error":"method not allowed"}`, 405)
		return
	}
	id := strings.TrimPrefix(r.URL.Path, "/v1/agent/inbox/")
	id = strings.TrimSuffix(id, "/reject")
	if id == "" {
		http.Error(w, `{"error":"inbox item id is required"}`, 400)
		return
	}
	item, err := getInboxItem(id)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 404)
		return
	}
	item.Status = InboxItemStatusRejected
	now := time.Now()
	item.ResolvedAt = &now
	if err := saveInboxItem(item); err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 500)
		return
	}
	// Complete the linked approval as denied if this inbox item has a request ID
	if item.Type == InboxItemTypeApproval {
		completeApproval(item.ID, approvalResult{Approved: false})
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(item)
}

// handleInboxReply — POST /v1/agent/inbox/{id}/reply
// Adds a reply string to the inbox item and re-executes the node (multi-turn approval).
func handleInboxReply(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" { w.WriteHeader(204); return }
	if r.Method != "POST" {
		http.Error(w, `{"error":"method not allowed"}`, 405)
		return
	}
	id := strings.TrimPrefix(r.URL.Path, "/v1/agent/inbox/")
	id = strings.TrimSuffix(id, "/reply")
	if id == "" {
		http.Error(w, `{"error":"inbox item id is required"}`, 400)
		return
	}
	var body struct {
		Reply string `json:"reply"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error":"invalid body"}`, 400)
		return
	}
	if body.Reply == "" {
		http.Error(w, `{"error":"reply is required"}`, 400)
		return
	}
	item, err := getInboxItem(id)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 404)
		return
	}
	// Re-read the run to update approval state
	run, runErr := getRun(item.RunID)
	if runErr != nil {
		// Run not found — just update the inbox item without re-execution
		item.Status = InboxItemStatusPending
		if err := saveInboxItem(item); err != nil {
			http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 500)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(item)
		return
	}
	// Find the matching node run and append the reply to its approval state
	for i, nr := range run.NodeRuns {
		if nr.NodeID == item.NodeID && nr.ApprovalState != nil {
			nr.ApprovalState.Replies = append(nr.ApprovalState.Replies, body.Reply)
			nr.Status = NodeRunStatusPending
			run.NodeRuns[i] = nr
			break
		}
	}
	if err := saveRun(run); err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 500)
		return
	}
	// Re-execute the node in a goroutine
	go runBlueprintDAG(item.BlueprintID, item.RunID)
	// Also update the approval channel so any waiting goroutine can proceed
	if item.Type == InboxItemTypeApproval {
		completeApproval(item.ID, approvalResult{Approved: true, Reason: body.Reply})
	}
	item.Status = InboxItemStatusPending
	if err := saveInboxItem(item); err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(item)
}

// handleInboxRead — POST /v1/agent/inbox/{id}/read
func handleInboxRead(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" { w.WriteHeader(204); return }
	if r.Method != "POST" {
		http.Error(w, `{"error":"method not allowed"}`, 405)
		return
	}
	id := strings.TrimPrefix(r.URL.Path, "/v1/agent/inbox/")
	id = strings.TrimSuffix(id, "/read")
	if id == "" {
		http.Error(w, `{"error":"inbox item id is required"}`, 400)
		return
	}
	item, err := getInboxItem(id)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 404)
		return
	}
	item.Status = InboxItemStatusRead
	now := time.Now()
	item.ResolvedAt = &now
	if err := saveInboxItem(item); err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(item)
}

// handleInboxCreate — POST /v1/agent/inbox/create
func handleInboxCreate(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" { w.WriteHeader(204); return }
	if r.Method != "POST" {
		http.Error(w, `{"error":"method not allowed"}`, 405)
		return
	}
	var body struct {
		Type        string `json:"type"`
		Title       string `json:"title"`
		Description string `json:"description"`
		BlueprintID string `json:"blueprint_id"`
		RunID       string `json:"run_id"`
		NodeID      string `json:"node_id"`
		Comment     string `json:"comment"`
		Summary     string `json:"summary"`
		Preview     string `json:"preview"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error":"invalid body"}`, 400)
		return
	}
	if body.Title == "" {
		http.Error(w, `{"error":"title is required"}`, 400)
		return
	}
	// Validate type
	validTypes := map[string]InboxItemType{
		"approval":     InboxItemTypeApproval,
		"proposal":     InboxItemTypeProposal,
		"notification": InboxItemTypeNotification,
	}
	itemType, ok := validTypes[body.Type]
	if !ok {
		itemType = InboxItemTypeNotification // default to notification
	}
	item := InboxItem{
		ID:          uuid.New().String(),
		Type:        itemType,
		Title:       body.Title,
		Description: body.Description,
		Status:      InboxItemStatusPending,
		BlueprintID: body.BlueprintID,
		RunID:       body.RunID,
		NodeID:      body.NodeID,
		Comment:     body.Comment,
		Summary:     body.Summary,
		Preview:     body.Preview,
		CreatedAt:   time.Now(),
	}
	if err := saveInboxItem(item); err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(item)
}

// ── 路由分发 ──

// handleBlueprintsRouter 分发 /v1/agent/blueprints/{id} 的 GET/PUT/DELETE
// 以及 /v1/agent/blueprints/{id}/export 和 /v1/agent/blueprints/{id}/runs
func handleBlueprintsRouter(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" { w.WriteHeader(204); return }

	path := strings.TrimPrefix(r.URL.Path, "/v1/agent/blueprints/")
	if path == "" {
		handleBlueprintsList(w, r)
		return
	}

	// /v1/agent/blueprints/import 已在 mux 单独注册
	parts := strings.SplitN(path, "/", 2)
	id := parts[0]

	if len(parts) == 1 {
		// /v1/agent/blueprints/{id}
		switch r.Method {
		case "GET":
			r.URL.Path = "/v1/agent/blueprints/" + id
			handleBlueprintsGet(w, r)
		case "PUT":
			handleBlueprintsUpdate(w, r)
		case "DELETE":
			handleBlueprintsDelete(w, r)
		default:
			json.NewEncoder(w).Encode(map[string]string{"error": "method not allowed"})
		}
		return
	}

	subPath := parts[1]
	switch subPath {
	case "export":
		handleBlueprintsExport(w, r)
	case "runs":
		if r.Method == "GET" {
			handleBlueprintsRuns(w, r)
		} else if r.Method == "POST" {
			handleBlueprintsRunCreate(w, r)
		}
	default:
		http.NotFound(w, r)
	}
}

// handleRunsRouter 分发 /v1/agent/runs/{id} 和 /v1/agent/runs/{id}/cancel
func handleRunsRouter(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" { w.WriteHeader(204); return }

	path := strings.TrimPrefix(r.URL.Path, "/v1/agent/runs/")
	// Empty path => list all runs
	if path == "" || path == "/" {
		handleRunsList(w, r)
		return
	}

	parts := strings.SplitN(path, "/", 2)
	id := parts[0]

	if len(parts) == 1 {
		handleRunGet(w, r)
		return
	}

	if parts[1] == "cancel" {
		handleRunCancel(w, r)
		return
	}
	http.NotFound(w, r)
}

// handleRunsList — GET /v1/agent/runs (list all runs)
func handleRunsList(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" { w.WriteHeader(204); return }
	if r.Method != "GET" {
		http.Error(w, `{"error":"method not allowed"}`, 405)
		return
	}
	runs, err := listRuns("")
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), 500)
		return
	}
	if runs == nil {
		runs = []BlueprintRun{}
	}

	// Enrich with blueprint names
	type RunWithBPName struct {
		BlueprintRun
		BlueprintName string `json:"blueprint_name,omitempty"`
	}
	result := make([]RunWithBPName, len(runs))
	for i, run := range runs {
		result[i] = RunWithBPName{BlueprintRun: run}
		bp, err := getBlueprint(run.BlueprintID)
		if err == nil {
			result[i].BlueprintName = bp.Name
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

// handleInboxRouter 分发 /v1/agent/inbox/{id}/approve|reject|reply|read
func handleInboxRouter(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" { w.WriteHeader(204); return }

	path := strings.TrimPrefix(r.URL.Path, "/v1/agent/inbox/")
	parts := strings.SplitN(path, "/", 2)
	if len(parts) < 2 {
		http.NotFound(w, r)
		return
	}
	_ = parts[0] // inbox item id
	action := parts[1]

	switch action {
	case "approve":
		handleInboxApprove(w, r)
	case "reject":
		handleInboxReject(w, r)
	case "reply":
		handleInboxReply(w, r)
	case "read":
		handleInboxRead(w, r)
	default:
		http.NotFound(w, r)
	}
}
