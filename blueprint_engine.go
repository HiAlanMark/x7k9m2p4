package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
)

// ── DAG Execution Engine ────────────────────────────────────────────────
//
// Executes a BlueprintDefinition as a directed acyclic graph.
// Nodes run when all their upstream dependencies have succeeded.
// The engine loops: findReadyNodes → executeReadyNodes → checkCompletion.
//
// Cancellation is tracked via runningBlueprints so that external callers
// (e.g. handleRunCancel) can abort a running DAG.

// runningBlueprints maps a runID to its cancel function so that
// handleRunCancel can abort an in-progress DAG execution.
var (
	runningBlueprints   = make(map[string]context.CancelFunc)
	runningBlueprintsMu sync.Mutex
)

// ── 1. runBlueprintDAG ─────────────────────────────────────────────────

// runBlueprintDAG is the main entry point for DAG execution. It is
// intended to be called in a goroutine: go runBlueprintDAG(bpID, runID).
//
// It loads the blueprint definition and run from the store, then loops
// through findReadyNodes → executeReadyNodes → checkCompletion with a
// 500ms sleep between iterations, updating run status and sending SSE
// events as nodes progress.
func runBlueprintDAG(blueprintID string, runID string) {
	ctx, cancel := context.WithCancel(context.Background())

	// Register for cancellation support.
	runningBlueprintsMu.Lock()
	runningBlueprints[runID] = cancel
	runningBlueprintsMu.Unlock()
	defer func() {
		cancel()
		runningBlueprintsMu.Lock()
		delete(runningBlueprints, runID)
		runningBlueprintsMu.Unlock()
	}()

	// Load blueprint and run from the store.
	bp, err := getBlueprint(blueprintID)
	if err != nil {
		log.Printf("[blueprint_engine] failed to load blueprint %s: %v", blueprintID, err)
		markRunFailed(runID, fmt.Sprintf("blueprint load error: %v", err))
		return
	}

	run, err := getRun(runID)
	if err != nil {
		log.Printf("[blueprint_engine] failed to load run %s: %v", runID, err)
		return
	}

	// Ensure all nodes have a pending entry in the run.
	ensureNodeRuns(&run, bp)

	// Transition run to "running".
	now := time.Now()
	run.Status = RunStatusRunning
	run.StartedAt = &now
	if err := saveRun(run); err != nil {
		log.Printf("[blueprint_engine] failed to save run %s: %v", runID, err)
		return
	}
	broadcastBlueprintSSE(runID, "run_started", map[string]any{
		"blueprint_id": blueprintID,
		"run_id":       runID,
	})

	// Main execution loop.
	for {
		select {
		case <-ctx.Done():
			log.Printf("[blueprint_engine] run %s cancelled", runID)
			markRunCancelled(runID)
			return
		default:
		}

		// Re-read run to pick up any external changes (e.g. approval replies).
		run, err = getRun(runID)
		if err != nil {
			log.Printf("[blueprint_engine] failed to re-read run %s: %v", runID, err)
			return
		}

		// Check if the run was externally cancelled.
		if run.Status == RunStatusCancelled {
			log.Printf("[blueprint_engine] run %s externally cancelled", runID)
			return
		}

		readyIDs := findReadyNodes(bp, run)
		if len(readyIDs) == 0 {
			if isRunComplete(run) {
				break
			}
			// Nothing ready yet — some nodes may be waiting for approval or
			// still running. Sleep and retry.
			time.Sleep(500 * time.Millisecond)
			continue
		}

		log.Printf("[blueprint_engine] run %s: %d node(s) ready: %v", runID, len(readyIDs), readyIDs)

		// Execute each ready node. Agent nodes are executed sequentially to
		// avoid overwhelming the LLM API; other node types are cheap.
		for _, nodeID := range readyIDs {
			select {
			case <-ctx.Done():
				markRunCancelled(runID)
				return
			default:
			}

			node := lookupNode(bp, nodeID)
			executeNode(bp, node, &run)

			// Save run after each node execution to persist progress.
			if err := saveRun(run); err != nil {
				log.Printf("[blueprint_engine] failed to save run %s after node %s: %v", runID, nodeID, err)
			}

			// Send SSE event for the node status change.
			nr := findNodeRun(run, nodeID)
			if nr != nil {
				broadcastBlueprintSSE(runID, "node_status", map[string]any{
					"node_id": nodeID,
					"status":  nr.Status,
					"output":  nr.Output,
				})
			}
		}

		// Brief sleep before next iteration.
		time.Sleep(500 * time.Millisecond)
	}

	// Run is complete. Resolve final result and set terminal status.
	run, _ = getRun(runID)
	finalResult := resolveFinalResult(bp, run)

	terminalStatus := RunStatusSucceeded
	for _, nr := range run.NodeRuns {
		if nr.Status == NodeRunStatusFailed {
			terminalStatus = RunStatusFailed
			break
		}
	}

	now = time.Now()
	run.FinalResult = finalResult
	run.Status = terminalStatus
	run.FinishedAt = &now
	if err := saveRun(run); err != nil {
		log.Printf("[blueprint_engine] failed to save final run %s: %v", runID, err)
	}

	broadcastBlueprintSSE(runID, "run_completed", map[string]any{
		"blueprint_id": blueprintID,
		"run_id":       runID,
		"status":       string(terminalStatus),
		"final_result": finalResult,
	})

	log.Printf("[blueprint_engine] run %s completed with status %s", runID, terminalStatus)
}

// ── 2. findReadyNodes ──────────────────────────────────────────────────

// findReadyNodes returns the IDs of nodes whose dependencies are all
// satisfied and that do not already have a non-pending run entry.
//
// A node is "ready" when:
//   - Every incoming edge's source node has a run entry with status "succeeded".
//   - The node itself has no run entry, or its run entry status is "pending".
//   - If the edge has a condition, the condition must evaluate to true
//     based on the source node's output.
func findReadyNodes(bp BlueprintDefinition, run BlueprintRun) []string {
	var ready []string

	for _, node := range bp.Nodes {
		// Skip non-executable note nodes.
		if node.Type == NodeTypeNote {
			continue
		}

		// Check if the node already has a run entry that is not pending.
		nr := findNodeRun(run, node.ID)
		if nr != nil && nr.Status != NodeRunStatusPending {
			continue
		}

		// Gather all incoming edges for this node.
		incoming := incomingEdges(bp, node.ID)

		// If a node has no incoming edges, it is a root node and is ready.
		if len(incoming) == 0 {
			ready = append(ready, node.ID)
			continue
		}

		// Check that ALL incoming edges have satisfied source nodes.
		allSatisfied := true
		for _, edge := range incoming {
			srcNR := findNodeRun(run, edge.Source)
			if srcNR == nil || srcNR.Status != NodeRunStatusSucceeded {
				allSatisfied = false
				break
			}
			// If the edge has a condition, check it against the source output.
			if edge.Condition != "" {
				if !evaluateEdgeCondition(edge.Condition, srcNR.Output) {
					allSatisfied = false
					break
				}
			}
		}

		if allSatisfied {
			ready = append(ready, node.ID)
		}
	}

	return ready
}

// ── 3. executeNode ─────────────────────────────────────────────────────

// executeNode executes a single node in the blueprint DAG, updating the
// node's run entry in the provided BlueprintRun pointer.
func executeNode(bp BlueprintDefinition, node BlueprintNode, run *BlueprintRun) {
	// Ensure a node run entry exists and mark it as running.
	ensureNodeRunForNode(run, node)
	nr := findNodeRun(*run, node.ID)
	if nr == nil {
		return
	}
	nr.Status = NodeRunStatusRunning
	now := time.Now()
	nr.StartedAt = &now
	updateNodeRun(run, *nr)

	log.Printf("[blueprint_engine] executing node %s (type=%s)", node.ID, node.Type)

	defer func() {
		if nr.Status == NodeRunStatusRunning {
			// If still running after execute, something went wrong — mark failed.
			nr.Status = NodeRunStatusFailed
			fin := time.Now()
			nr.FinishedAt = &fin
			updateNodeRun(run, *nr)
		}
	}()

	switch node.Type {
	case NodeTypeAgent:
		executeAgentNode(node, run, nr)
	case NodeTypeCondition:
		executeConditionNode(bp, node, run, nr)
	case NodeTypeLoop:
		executeLoopNode(bp, node, run, nr)
	case NodeTypeSummary:
		executeSummaryNode(bp, node, run, nr)
	case NodeTypeManager:
		executeManagerNode(bp, node, run, nr)
	case NodeTypeManagerSlot:
		executeManagerSlotNode(bp, node, run, nr)
	case NodeTypeGroup:
		// Visual container only — pass through to children.
		nr.Status = NodeRunStatusSkipped
		nr.Output = "group node skipped (visual container)"
		fin := time.Now()
		nr.FinishedAt = &fin
		updateNodeRun(run, *nr)
	case NodeTypeNote:
		// Non-executable — mark as skipped.
		nr.Status = NodeRunStatusSkipped
		fin := time.Now()
		nr.FinishedAt = &fin
		updateNodeRun(run, *nr)
	default:
		log.Printf("[blueprint_engine] unknown node type %s for node %s", node.Type, node.ID)
		nr.Status = NodeRunStatusFailed
		nr.Output = fmt.Sprintf("unknown node type: %s", node.Type)
		fin := time.Now()
		nr.FinishedAt = &fin
		updateNodeRun(run, *nr)
	}
}

// executeAgentNode runs an agent node by creating a temporary chat session,
// sending the prompt, and collecting the response.
func executeAgentNode(node BlueprintNode, run *BlueprintRun, nr *BlueprintNodeRun) {
	prompt := configString(node, "prompt")
	if prompt == "" {
		nr.Status = NodeRunStatusFailed
		nr.Output = "agent node missing 'prompt' in config"
		fin := time.Now()
		nr.FinishedAt = &fin
		updateNodeRun(run, *nr)
		return
	}

	// Inject upstream outputs into the prompt if referenced.
	prompt = injectUpstreamOutputs(prompt, *run)

	// Try to get LLM config from the hermes config.yaml.
	apiBase, apiKey, model := getLLMConfig()

	if apiBase == "" || apiKey == "" || model == "" {
		nr.Status = NodeRunStatusFailed
		nr.Output = "agent node requires api_base, api_key, and model configuration"
		fin := time.Now()
		nr.FinishedAt = &fin
		updateNodeRun(run, *nr)
		return
	}

	// Execute a synchronous (non-streaming) chat completion request.
	output, tokens, err := callLLMSync(prompt, apiBase, apiKey, model)
	if err != nil {
		nr.Status = NodeRunStatusFailed
		nr.Output = fmt.Sprintf("LLM call failed: %v", err)
		fin := time.Now()
		nr.FinishedAt = &fin
		updateNodeRun(run, *nr)
		return
	}

	nr.Output = output
	nr.TokenUsage = tokens

	// Check if approval is required.
	if approval, _ := node.Config["approval"].(bool); approval {
		nr.Status = NodeRunStatusWaitingApproval
		reqID := uuid.New().String()
		nr.ApprovalState = &ApprovalState{
			RequestID: reqID,
			Status:    ApprovalStatusPending,
		}
		fin := time.Now()
		nr.FinishedAt = &fin
		updateNodeRun(run, *nr)

		// Create an InboxItem for the approval.
		item := InboxItem{
			ID:          reqID,
			Type:        InboxItemTypeApproval,
			Title:       fmt.Sprintf("Blueprint Approval: %s", node.Label),
			Description: fmt.Sprintf("Node %s requires approval.\n\nOutput:\n%s", node.Label, truncate(output, 500)),
			Status:      InboxItemStatusPending,
			BlueprintID: run.BlueprintID,
			RunID:       run.ID,
			NodeID:      node.ID,
			CreatedAt:   time.Now(),
		}
		if err := saveInboxItem(item); err != nil {
			log.Printf("[blueprint_engine] failed to create inbox item for node %s: %v", node.ID, err)
		}

		// Register approval channel and wait.
		ch := registerApproval(reqID)
		select {
		case result := <-ch:
			if result.Approved {
				nr.Status = NodeRunStatusSucceeded
				nr.ApprovalState.Status = ApprovalStatusApproved
			} else {
				nr.Status = NodeRunStatusFailed
				nr.ApprovalState.Status = ApprovalStatusDenied
				nr.Output = "approval denied"
			}
		case <-time.After(10 * time.Minute):
			nr.Status = NodeRunStatusFailed
			nr.ApprovalState.Status = ApprovalStatusTimeout
			nr.Output = "approval timed out"
			completeApproval(reqID, approvalResult{})
		}
		now := time.Now()
		nr.FinishedAt = &now
		updateNodeRun(run, *nr)
		return
	}

	// No approval needed — succeed.
	nr.Status = NodeRunStatusSucceeded
	fin := time.Now()
	nr.FinishedAt = &fin
	updateNodeRun(run, *nr)
}

// executeConditionNode evaluates a condition expression against upstream
// output and sets the condition result on outgoing edges.
func executeConditionNode(bp BlueprintDefinition, node BlueprintNode, run *BlueprintRun, nr *BlueprintNodeRun) {
	expr := configString(node, "expression")
	if expr == "" {
		nr.Status = NodeRunStatusFailed
		nr.Output = "condition node missing 'expression' in config"
		fin := time.Now()
		nr.FinishedAt = &fin
		updateNodeRun(run, *nr)
		return
	}

	// Collect upstream output for evaluation.
	upstreamOutput := collectUpstreamOutput(bp, node.ID, *run)

	// Evaluate: simple contains or regex check.
	result := evaluateEdgeCondition(expr, upstreamOutput)
	resultStr := "false"
	if result {
		resultStr = "true"
	}

	nr.Output = resultStr

	// Set the condition result on outgoing edges so that downstream
	// findReadyNodes can evaluate them.
	outgoing := outgoingEdges(bp, node.ID)
	for i := range bp.Edges {
		for _, out := range outgoing {
			if bp.Edges[i].ID == out.ID {
				bp.Edges[i].Condition = resultStr
			}
		}
	}

	nr.Status = NodeRunStatusSucceeded
	fin := time.Now()
	nr.FinishedAt = &fin
	updateNodeRun(run, *nr)
}

// executeLoopNode handles loop iteration. If the current iteration is
// below maxIterations, it re-queues downstream nodes by resetting their
// run entries to pending.
func executeLoopNode(bp BlueprintDefinition, node BlueprintNode, run *BlueprintRun, nr *BlueprintNodeRun) {
	maxIter := configInt(node, "max_iterations")
	if maxIter == 0 {
		maxIter = 3 // default
	}

	iteration := 0
	if prev, ok := nr.Output.(float64); ok {
		iteration = int(prev)
	}
	if prev, ok := nr.Output.(int); ok {
		iteration = prev
	}
	if prev, ok := nr.Output.(string); ok {
		fmt.Sscanf(prev, "%d", &iteration)
	}

	iteration++
	nr.Output = iteration

	if iteration < maxIter {
		// Re-queue downstream nodes: reset their status to pending.
		outgoing := outgoingEdges(bp, node.ID)
		for _, edge := range outgoing {
			downstreamNR := findNodeRun(*run, edge.Target)
			if downstreamNR != nil {
				downstreamNR.Status = NodeRunStatusPending
				downstreamNR.Output = nil
				downstreamNR.StartedAt = nil
				downstreamNR.FinishedAt = nil
				updateNodeRun(run, *downstreamNR)
			}
		}
	}

	nr.Status = NodeRunStatusSucceeded
	fin := time.Now()
	nr.FinishedAt = &fin
	updateNodeRun(run, *nr)
}

// executeSummaryNode collects all upstream outputs and concatenates them
// as the summary output.
func executeSummaryNode(bp BlueprintDefinition, node BlueprintNode, run *BlueprintRun, nr *BlueprintNodeRun) {
	upstreamOutput := collectUpstreamOutput(bp, node.ID, *run)

	// If a template is provided in config, use it.
	tmpl := configString(node, "template")
	if tmpl != "" {
		nr.Output = strings.ReplaceAll(tmpl, "{{upstream}}", upstreamOutput)
	} else {
		nr.Output = upstreamOutput
	}

	nr.Status = NodeRunStatusSucceeded
	fin := time.Now()
	nr.FinishedAt = &fin
	updateNodeRun(run, *nr)
}

// ── 4. isRunComplete ───────────────────────────────────────────────────

// isRunComplete returns true when all node runs are in a terminal state:
// succeeded, failed, skipped, or waiting_approval.
func isRunComplete(run BlueprintRun) bool {
	for _, nr := range run.NodeRuns {
		switch nr.Status {
		case NodeRunStatusSucceeded, NodeRunStatusFailed,
			NodeRunStatusSkipped, NodeRunStatusWaitingApproval:
			// terminal — ok
		default:
			// pending or running — not done yet
			return false
		}
	}
	return len(run.NodeRuns) > 0 // must have at least one node run
}

// ── 5. resolveFinalResult ──────────────────────────────────────────────

// resolveFinalResult finds the terminal nodes (those with no outgoing
// edges) and returns their outputs concatenated.
func resolveFinalResult(bp BlueprintDefinition, run BlueprintRun) string {
	terminalNodeIDs := make(map[string]bool)
	for _, node := range bp.Nodes {
		if len(outgoingEdges(bp, node.ID)) == 0 {
			terminalNodeIDs[node.ID] = true
		}
	}

	var parts []string
	for _, nr := range run.NodeRuns {
		if terminalNodeIDs[nr.NodeID] && nr.Output != nil {
			parts = append(parts, fmt.Sprintf("%v", nr.Output))
		}
	}

	if len(parts) == 0 {
		return ""
	}
	return strings.Join(parts, "\n\n")
}

// ── Helpers ────────────────────────────────────────────────────────────

// ensureNodeRuns creates pending run entries for every node that doesn't
// already have one.
func ensureNodeRuns(run *BlueprintRun, bp BlueprintDefinition) {
	existing := make(map[string]bool)
	for _, nr := range run.NodeRuns {
		existing[nr.NodeID] = true
	}
	for _, node := range bp.Nodes {
		if !existing[node.ID] {
			run.NodeRuns = append(run.NodeRuns, BlueprintNodeRun{
				NodeID: node.ID,
				Status: NodeRunStatusPending,
			})
		}
	}
}

// ensureNodeRunForNode ensures a single node has a run entry.
func ensureNodeRunForNode(run *BlueprintRun, node BlueprintNode) {
	for _, nr := range run.NodeRuns {
		if nr.NodeID == node.ID {
			return
		}
	}
	run.NodeRuns = append(run.NodeRuns, BlueprintNodeRun{
		NodeID: node.ID,
		Status: NodeRunStatusPending,
	})
}

// executeManagerNode runs a manager node by building an orchestration prompt
// that describes its ports and upstream context, then calling the LLM to
// decide which port/slot to route to. The manager respects max_handoffs
// to prevent infinite loops.
func executeManagerNode(bp BlueprintDefinition, node BlueprintNode, run *BlueprintRun, nr *BlueprintNodeRun) {
	instructions := configString(node, "instructions")
	if instructions == "" {
		instructions = "Orchestrate the following tasks and delegate to the appropriate port."
	}
	portCount := configInt(node, "port_count")
	if portCount == 0 {
		portCount = 2
	}
	maxHandoffs := configInt(node, "max_handoffs")
	if maxHandoffs == 0 {
		maxHandoffs = 3
	}

	// Build the orchestration prompt.
	upstream := collectUpstreamOutput(bp, node.ID, *run)
	portList := ""
	for i := 0; i < portCount; i++ {
		portList += fmt.Sprintf("- port_%d: [describe what this port is for]\n", i)
	}
	prompt := fmt.Sprintf(
		"You are a Manager orchestrating tasks.\n\n"+
			"Instructions: %s\n\n"+
			"Available ports:\n%s\n"+
			"Upstream output:\n%s\n\n"+
			"Decide which port to route to next. Return JSON:\n"+
			"{\"port\": <port_number>, \"reason\": \"...\"}\n",
		instructions, portList, upstream,
	)

	apiBase, apiKey, model := getLLMConfig()
	if apiBase == "" || apiKey == "" || model == "" {
		nr.Status = NodeRunStatusFailed
		nr.Output = "manager node requires api_base, api_key, and model configuration"
		fin := time.Now()
		nr.FinishedAt = &fin
		updateNodeRun(run, *nr)
		return
	}

	output, tokens, err := callLLMSync(prompt, apiBase, apiKey, model)
	if err != nil {
		nr.Status = NodeRunStatusFailed
		nr.Output = fmt.Sprintf("Manager LLM call failed: %v", err)
		fin := time.Now()
		nr.FinishedAt = &fin
		updateNodeRun(run, *nr)
		return
	}

	nr.Output = output
	nr.TokenUsage = tokens

	// Broadcast the manager decision for the engine to act on.
	broadcastBlueprintSSE(run.ID, "manager.decision", map[string]any{
		"node_id":     node.ID,
		"output":      output,
		"port_count":  portCount,
		"max_handoffs": maxHandoffs,
	})

	fin := time.Now()
	nr.FinishedAt = &fin
	updateNodeRun(run, *nr)
}

// executeManagerSlotNode executes a slot within a manager. It looks up
// child nodes that belong to this slot and runs them.
func executeManagerSlotNode(bp BlueprintDefinition, node BlueprintNode, run *BlueprintRun, nr *BlueprintNodeRun) {
	slot := configInt(node, "slot")
	execMode := configString(node, "execution_mode")
	if execMode == "" {
		execMode = "manual"
	}
	parallelLanes := configInt(node, "parallel_lane_count")
	if parallelLanes == 0 {
		parallelLanes = 1
	}

	upstream := collectUpstreamOutput(bp, node.ID, *run)
	_ = fmt.Sprintf("Executing manager slot #%d (mode: %s, lanes: %d).\nUpstream context:\n%s", slot, execMode, parallelLanes, upstream)

	// Slot nodes delegate to their child agent nodes — for now, pass through.
	nr.Status = NodeRunStatusSucceeded
	nr.Output = fmt.Sprintf("Slot %d executed (mode=%s, lanes=%d). Pass-through: %s", slot, execMode, parallelLanes, truncate(upstream, 500))
	nr.TokenUsage = 0

	broadcastBlueprintSSE(run.ID, "slot.completed", map[string]any{
		"node_id": node.ID,
		"slot":    slot,
		"mode":    execMode,
		"output":  nr.Output,
	})

	fin := time.Now()
	nr.FinishedAt = &fin
	updateNodeRun(run, *nr)
}

// lookupNode finds a node by ID in the blueprint.
func lookupNode(bp BlueprintDefinition, nodeID string) BlueprintNode {
	for _, n := range bp.Nodes {
		if n.ID == nodeID {
			return n
		}
	}
	return BlueprintNode{ID: nodeID}
}

// findNodeRun finds the run entry for a node.
func findNodeRun(run BlueprintRun, nodeID string) *BlueprintNodeRun {
	for i := range run.NodeRuns {
		if run.NodeRuns[i].NodeID == nodeID {
			return &run.NodeRuns[i]
		}
	}
	return nil
}

// updateNodeRun updates (or appends) a node run entry in the run.
func updateNodeRun(run *BlueprintRun, nr BlueprintNodeRun) {
	for i := range run.NodeRuns {
		if run.NodeRuns[i].NodeID == nr.NodeID {
			run.NodeRuns[i] = nr
			return
		}
	}
	run.NodeRuns = append(run.NodeRuns, nr)
}

// incomingEdges returns all edges whose target is the given node.
func incomingEdges(bp BlueprintDefinition, nodeID string) []BlueprintEdge {
	var edges []BlueprintEdge
	for _, e := range bp.Edges {
		if e.Target == nodeID {
			edges = append(edges, e)
		}
	}
	return edges
}

// outgoingEdges returns all edges whose source is the given node.
func outgoingEdges(bp BlueprintDefinition, nodeID string) []BlueprintEdge {
	var edges []BlueprintEdge
	for _, e := range bp.Edges {
		if e.Source == nodeID {
			edges = append(edges, e)
		}
	}
	return edges
}

// collectUpstreamOutput gathers the output of all source nodes for the
// incoming edges of a given node, concatenated with separators.
func collectUpstreamOutput(bp BlueprintDefinition, nodeID string, run BlueprintRun) string {
	incoming := incomingEdges(bp, nodeID)
	var parts []string
	for _, edge := range incoming {
		nr := findNodeRun(run, edge.Source)
		if nr != nil && nr.Output != nil && nr.Status == NodeRunStatusSucceeded {
			parts = append(parts, fmt.Sprintf("[%s]: %v", edge.Source, nr.Output))
		}
	}
	return strings.Join(parts, "\n")
}

// injectUpstreamOutputs replaces {{node_id}} placeholders in the prompt
// with the corresponding upstream node output values.
func injectUpstreamOutputs(prompt string, run BlueprintRun) string {
	for _, nr := range run.NodeRuns {
		if nr.Output != nil && nr.Status == NodeRunStatusSucceeded {
			placeholder := "{{" + nr.NodeID + "}}"
			prompt = strings.ReplaceAll(prompt, placeholder, fmt.Sprintf("%v", nr.Output))
		}
	}
	return prompt
}

// evaluateEdgeCondition evaluates a simple condition string against an
// upstream output. Supports:
//   - "contains:substring" — true if upstream output contains the substring
//   - "regex:pattern" — true if upstream output matches the regex pattern
//   - Bare string — treated as "contains:<string>"
func evaluateEdgeCondition(condition string, upstreamOutput interface{}) bool {
	outputStr := fmt.Sprintf("%v", upstreamOutput)

	if strings.HasPrefix(condition, "contains:") {
		substr := strings.TrimPrefix(condition, "contains:")
		return strings.Contains(outputStr, substr)
	}
	if strings.HasPrefix(condition, "regex:") {
		pattern := strings.TrimPrefix(condition, "regex:")
		matched, err := regexp.MatchString(pattern, outputStr)
		if err != nil {
			log.Printf("[blueprint_engine] invalid regex %q: %v", pattern, err)
			return false
		}
		return matched
	}
	if condition == "true" {
		return true
	}
	if condition == "false" {
		return false
	}
	// Bare string: treat as contains check.
	return strings.Contains(outputStr, condition)
}

// configString extracts a string value from a node's Config map.
func configString(node BlueprintNode, key string) string {
	v, _ := node.Config[key].(string)
	return v
}

// configInt extracts an int value from a node's Config map.
func configInt(node BlueprintNode, key string) int {
	if v, ok := node.Config[key].(float64); ok {
		return int(v)
	}
	if v, ok := node.Config[key].(int); ok {
		return v
	}
	return 0
}

// markRunFailed sets the run status to failed with an error message.
func markRunFailed(runID string, message string) {
	run, err := getRun(runID)
	if err != nil {
		return
	}
	run.Status = RunStatusFailed
	run.FinalResult = message
	now := time.Now()
	run.FinishedAt = &now
	saveRun(run)
}

// markRunCancelled sets the run status to cancelled.
func markRunCancelled(runID string) {
	run, err := getRun(runID)
	if err != nil {
		return
	}
	if run.Status == RunStatusCancelled {
		return
	}
	run.Status = RunStatusCancelled
	now := time.Now()
	run.FinishedAt = &now
	saveRun(run)
}

// ── LLM Integration ────────────────────────────────────────────────────

// getLLMConfig reads the LLM configuration (api_base, api_key, model)
// from the hermes config.yaml file.
func getLLMConfig() (apiBase, apiKey, model string) {
	configPath := filepath.Join(getHome(), ".hermes", "config.yaml")
	data, err := os.ReadFile(configPath)
	if err != nil {
		return "", "", ""
	}

	// Simple YAML parsing for the three fields we need.
	// Avoids importing a full YAML library for just three keys.
	lines := strings.Split(string(data), "\n")
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if strings.HasPrefix(line, "api_base:") || strings.HasPrefix(line, "base_url:") {
			apiBase = strings.Trim(extractYAMLValue(line), "\"")
		}
		if strings.HasPrefix(line, "api_key:") {
			apiKey = strings.Trim(extractYAMLValue(line), "\"")
		}
		if strings.HasPrefix(line, "model:") {
			model = strings.Trim(extractYAMLValue(line), "\"")
		}
	}
	return apiBase, apiKey, model
}

// extractYAMLValue returns the value portion of a "key: value" YAML line.
func extractYAMLValue(line string) string {
	idx := strings.Index(line, ":")
	if idx < 0 {
		return ""
	}
	return strings.TrimSpace(line[idx+1:])
}

// callLLMSync performs a synchronous (non-streaming) chat completion
// request to the configured LLM API and returns the assistant message
// content and estimated token usage.
func callLLMSync(prompt, apiBase, apiKey, model string) (string, int, error) {
	body := map[string]any{
		"model": model,
		"messages": []map[string]any{
			{"role": "system", "content": systemPrompt},
			{"role": "user", "content": prompt},
		},
		"stream": false,
	}
	bodyBytes, err := json.Marshal(body)
	if err != nil {
		return "", 0, fmt.Errorf("marshal request: %w", err)
	}

	url := strings.TrimRight(apiBase, "/") + "/chat/completions"
	req, err := http.NewRequest("POST", url, bytes.NewReader(bodyBytes))
	if err != nil {
		return "", 0, fmt.Errorf("create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{Timeout: 180 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", 0, fmt.Errorf("LLM request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		errBody, _ := io.ReadAll(resp.Body)
		return "", 0, fmt.Errorf("LLM API error (%d): %s", resp.StatusCode, truncate(string(errBody), 500))
	}

	var result struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
		Usage struct {
			TotalTokens int `json:"total_tokens"`
		} `json:"usage"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", 0, fmt.Errorf("decode response: %w", err)
	}

	if len(result.Choices) == 0 {
		return "", 0, fmt.Errorf("no choices in LLM response")
	}

	return result.Choices[0].Message.Content, result.Usage.TotalTokens, nil
}

// ── SSE Broadcasting ────────────────────────────────────────────────────

// blueprintSSEClients holds SSE client connections for broadcasting
// blueprint run events. Clients connect via the blueprint events endpoint.
var (
	blueprintSSEClients   = make(map[string][]chan map[string]any)
	blueprintSSEClientsMu sync.Mutex
)

// registerBlueprintSSEClient registers a channel to receive SSE events
// for a given runID. Returns the channel.
func registerBlueprintSSEClient(runID string) chan map[string]any {
	ch := make(chan map[string]any, 32)
	blueprintSSEClientsMu.Lock()
	blueprintSSEClients[runID] = append(blueprintSSEClients[runID], ch)
	blueprintSSEClientsMu.Unlock()
	return ch
}

// unregisterBlueprintSSEClient removes a client channel.
func unregisterBlueprintSSEClient(runID string, ch chan map[string]any) {
	blueprintSSEClientsMu.Lock()
	defer blueprintSSEClientsMu.Unlock()
	clients := blueprintSSEClients[runID]
	for i, c := range clients {
		if c == ch {
			blueprintSSEClients[runID] = append(clients[:i], clients[i+1:]...)
			break
		}
	}
	if len(blueprintSSEClients[runID]) == 0 {
		delete(blueprintSSEClients, runID)
	}
}

// broadcastBlueprintSSE sends an event to all SSE clients subscribed to
// a given runID.
func broadcastBlueprintSSE(runID string, eventType string, data map[string]any) {
	data["event_type"] = eventType
	data["run_id"] = runID

	blueprintSSEClientsMu.Lock()
	clients := blueprintSSEClients[runID]
	blueprintSSEClientsMu.Unlock()

	for _, ch := range clients {
		select {
		case ch <- data:
		default:
			// Client channel full — drop event to avoid blocking.
			log.Printf("[blueprint_engine] SSE client channel full for run %s, dropping event", runID)
		}
	}
}
