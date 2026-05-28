package main

import "time"

// ── Blueprint Definition ────────────────────────────────────────────────

// BlueprintDefinition represents a saved blueprint workflow (a DAG of nodes and edges).
type BlueprintDefinition struct {
	ID          string                 `json:"id"`
	Name        string                 `json:"name"`
	Description string                 `json:"description"`
	Nodes       []BlueprintNode        `json:"nodes"`
	Edges       []BlueprintEdge        `json:"edges"`
	Variables   map[string]interface{} `json:"variables"`
	Display     BlueprintDisplay       `json:"display"`
	CreatedAt   time.Time              `json:"created_at"`
	UpdatedAt   time.Time              `json:"updated_at"`
	Version     int                    `json:"version"`
}

// BlueprintDisplay holds viewport and other display-related settings.
type BlueprintDisplay struct {
	Viewport BlueprintViewport `json:"viewport"`
}

// BlueprintViewport represents the camera/zoom state for the visual editor.
type BlueprintViewport struct {
	X    float64 `json:"x"`
	Y    float64 `json:"y"`
	Zoom float64 `json:"zoom"`
}

// ── Node ────────────────────────────────────────────────────────────────

// NodeType enumerates the kinds of nodes that can appear in a blueprint.
type NodeType string

const (
	NodeTypeAgent       NodeType = "agent"
	NodeTypeManager     NodeType = "manager"
	NodeTypeManagerSlot NodeType = "manager_slot"
	NodeTypeGroup       NodeType = "group"
	NodeTypeCondition   NodeType = "condition"
	NodeTypeLoop        NodeType = "loop"
	NodeTypeSummary     NodeType = "summary"
	NodeTypeNote        NodeType = "note"
)

// ResultRole determines how a node's output is treated in the final result.
type ResultRole string

const (
	ResultRoleAuto   ResultRole = "auto"
	ResultRoleFinal  ResultRole = "final"
	ResultRoleIgnore ResultRole = "ignore"
)

// BlueprintNode is a single step in a blueprint DAG.
type BlueprintNode struct {
	ID         string                 `json:"id"`
	Type       NodeType               `json:"type"`
	Label      string                 `json:"label"`
	ParentID   string                 `json:"parent_id"`
	Disabled   bool                   `json:"disabled"`
	Position   BlueprintNodePosition  `json:"position"`
	Size       BlueprintNodeSize      `json:"size"`
	RuntimeID  string                 `json:"runtime_id"`
	ResultRole ResultRole             `json:"result_role"`
	Config     map[string]interface{} `json:"config"`
}

// BlueprintNodePosition stores the x/y coordinates for the visual editor.
type BlueprintNodePosition struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

// BlueprintNodeSize stores the width/height dimensions for the visual editor.
type BlueprintNodeSize struct {
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

// ── Node Config Structs ────────────────────────────────────────────────

// AgentApprovalConfig configures the approval gate on an agent node.
type AgentApprovalConfig struct {
	Enabled bool `json:"enabled"`
}

// AgentSendConfig configures the send/action behaviour on an agent node.
type AgentSendConfig struct {
	Enabled      bool   `json:"enabled"`
	ChannelID    string `json:"channel_id"`
	Target       string `json:"target"`
	BodyTemplate string `json:"body_template"`
}

// AgentConfig holds the typed configuration for an agent node.
type AgentConfig struct {
	RuntimeID         string              `json:"runtime_id"`
	AgentName         string              `json:"agent_name"`
	Prompt            string              `json:"prompt"`
	SkillIDs          []string            `json:"skill_ids"`
	ModelID           string              `json:"model_id"`
	PermissionProfile string              `json:"permission_profile"`
	WorkingDirectory  string              `json:"working_directory"`
	TimeoutMs         int                 `json:"timeout_ms"`
	OutputSchema      interface{}         `json:"output_schema"`
	Approval          AgentApprovalConfig `json:"approval"`
	Send              AgentSendConfig     `json:"send"`
	Tools             []string            `json:"tools"`
}

// ManagerConfig holds the typed configuration for a manager node.
type ManagerConfig struct {
	PortCount         int      `json:"port_count"`
	MaxHandoffs       int      `json:"max_handoffs"`
	Instructions      string   `json:"instructions"`
	RuntimeID         string   `json:"runtime_id"`
	AgentName         string   `json:"agent_name"`
	ModelID           string   `json:"model_id"`
	SkillIDs          []string `json:"skill_ids"`
	PermissionProfile string   `json:"permission_profile"`
	WorkingDirectory  string   `json:"working_directory"`
	TimeoutMs         int      `json:"timeout_ms"`
	Tools             []string `json:"tools"`
}

// ExecutionMode determines how a manager slot executes its children.
type ExecutionMode string

const (
	ExecutionModeManual   ExecutionMode = "manual"
	ExecutionModeParallel ExecutionMode = "parallel"
)

// ManagerSlotConfig holds the typed configuration for a manager_slot node.
type ManagerSlotConfig struct {
	ManagerNodeID     string        `json:"manager_node_id"`
	Slot              int           `json:"slot"`
	ExecutionMode     ExecutionMode `json:"execution_mode"`
	ParallelLaneCount int           `json:"parallel_lane_count"`
}

// SummaryMode determines how a summary node merges its inputs.
type SummaryMode string

const (
	SummaryModeStructuredMerge SummaryMode = "structured_merge"
	SummaryModeHarnessSummary  SummaryMode = "harness_summary"
)

// SummaryConfig holds the typed configuration for a summary node.
type SummaryConfig struct {
	Mode      SummaryMode `json:"mode"`
	RuntimeID string      `json:"runtime_id"`
	Prompt    string      `json:"prompt"`
	ModelID   string      `json:"model_id"`
}

// GroupConfig holds the typed configuration for a group node.
type GroupConfig struct {
	Color string `json:"color"`
}

// ConditionConfig holds the typed configuration for a condition node.
type ConditionConfig struct {
	Expression string `json:"expression"`
}

// LoopConfig holds the typed configuration for a loop node.
type LoopConfig struct {
	MaxIterations int `json:"max_iterations"`
}

// ── Edge ────────────────────────────────────────────────────────────────

// BlueprintEdge connects two nodes in a blueprint DAG.
type BlueprintEdge struct {
	ID           string `json:"id"`
	Source       string `json:"source"`
	Target       string `json:"target"`
	SourceHandle string `json:"source_handle"`
	TargetHandle string `json:"target_handle"`
	Condition    string `json:"condition"`
	Label        string `json:"label"`
}

// ── Run ─────────────────────────────────────────────────────────────────

// BlueprintRunStatus enumerates the possible states of a blueprint execution.
type BlueprintRunStatus string

const (
	RunStatusQueued          BlueprintRunStatus = "queued"
	RunStatusRunning         BlueprintRunStatus = "running"
	RunStatusSucceeded       BlueprintRunStatus = "succeeded"
	RunStatusFailed          BlueprintRunStatus = "failed"
	RunStatusCancelled       BlueprintRunStatus = "cancelled"
	RunStatusWaitingApproval BlueprintRunStatus = "waiting_approval"
)

// BlueprintRun tracks a single execution of a blueprint.
type BlueprintRun struct {
	ID                string                `json:"id"`
	BlueprintID       string                `json:"blueprint_id"`
	BlueprintName     string                `json:"blueprint_name"`
	BlueprintVersion  int                   `json:"blueprint_version"`
	StartedBy         string                `json:"started_by"`
	Status            BlueprintRunStatus    `json:"status"`
	NodeRuns          []BlueprintNodeRun    `json:"node_runs"`
	Events            []BlueprintNodeEvent  `json:"events"`
	StartedAt         *time.Time            `json:"started_at"`
	FinishedAt        *time.Time            `json:"finished_at"`
	DurationMs        int64                 `json:"duration_ms"`
	FinalResult       interface{}           `json:"final_result"`
	TotalInputTokens  int64                 `json:"total_input_tokens"`
	TotalOutputTokens int64                 `json:"total_output_tokens"`
	TotalCostUsd      float64               `json:"total_cost_usd"`
	TokenUsage        int                   `json:"token_usage"`
}

// ── Node Run ────────────────────────────────────────────────────────────

// BlueprintNodeRunStatus enumerates the possible states of a single node execution.
type BlueprintNodeRunStatus string

const (
	NodeRunStatusPending         BlueprintNodeRunStatus = "pending"
	NodeRunStatusQueued          BlueprintNodeRunStatus = "queued"
	NodeRunStatusRunning         BlueprintNodeRunStatus = "running"
	NodeRunStatusSucceeded       BlueprintNodeRunStatus = "succeeded"
	NodeRunStatusFailed          BlueprintNodeRunStatus = "failed"
	NodeRunStatusSkipped         BlueprintNodeRunStatus = "skipped"
	NodeRunStatusCancelled       BlueprintNodeRunStatus = "cancelled"
	NodeRunStatusWaitingApproval BlueprintNodeRunStatus = "waiting_approval"
)

// NodeRunUsage tracks token consumption for a single node execution.
type NodeRunUsage struct {
	PromptTokens     int64 `json:"prompt_tokens"`
	CompletionTokens int64 `json:"completion_tokens"`
}

// BlueprintNodeRun tracks the execution of a single node within a blueprint run.
type BlueprintNodeRun struct {
	ID             string                  `json:"id"`
	BlueprintRunID string                 `json:"blueprint_run_id"`
	BlueprintID    string                  `json:"blueprint_id"`
	NodeID         string                  `json:"node_id"`
	NodeLabel      string                  `json:"node_label"`
	NodeType       NodeType                `json:"node_type"`
	Status         BlueprintNodeRunStatus  `json:"status"`
	QueuedAt       *time.Time              `json:"queued_at"`
	Input          interface{}             `json:"input"`
	Output         interface{}             `json:"output"`
	Error          string                  `json:"error"`
	StartedAt      *time.Time              `json:"started_at"`
	FinishedAt     *time.Time              `json:"finished_at"`
	Usage          NodeRunUsage            `json:"usage"`
	OpenClawRef    string                  `json:"openclaw_ref"`
	TokenUsage     int                     `json:"token_usage"`
	ApprovalState  *ApprovalState          `json:"approval_state"`
}

// ── Events ──────────────────────────────────────────────────────────────

// BlueprintEventKind enumerates the event types emitted during a blueprint run.
type BlueprintEventKind string

const (
	EventBlueprintRunStarted    BlueprintEventKind = "blueprint.run.started"
	EventNodeRunQueued          BlueprintEventKind = "node.run.queued"
	EventNodeRunStarted         BlueprintEventKind = "node.run.started"
	EventNodeRunWaitingApproval BlueprintEventKind = "node.run.waiting_approval"
	EventNodeRunCompleted       BlueprintEventKind = "node.run.completed"
	EventNodeRunFailed          BlueprintEventKind = "node.run.failed"
	EventNodeRunCancelled       BlueprintEventKind = "node.run.cancelled"
	EventBlueprintRunCompleted  BlueprintEventKind = "blueprint.run.completed"
	EventBlueprintRunCancelled  BlueprintEventKind = "blueprint.run.cancelled"
	EventBlueprintRunFailed     BlueprintEventKind = "blueprint.run.failed"
)

// BlueprintNodeEvent represents a single event emitted during a blueprint run.
type BlueprintNodeEvent struct {
	ID             string             `json:"id"`
	BlueprintRunID string             `json:"blueprint_run_id"`
	NodeRunID      string             `json:"node_run_id,omitempty"`
	Type           BlueprintEventKind `json:"type"`
	Message        string             `json:"message"`
	CreatedAt      time.Time          `json:"created_at"`
}

// ── Final Result ────────────────────────────────────────────────────────

// FinalRunResultState enumerates the possible states of a blueprint run's final result.
type FinalRunResultState string

const (
	FinalRunResultStateAvailable       FinalRunResultState = "available"
	FinalRunResultStateFailed          FinalRunResultState = "failed"
	FinalRunResultStateWaitingApproval FinalRunResultState = "waiting_approval"
	FinalRunResultStateEmpty           FinalRunResultState = "empty"
)

// SelectionReason enumerates the reasons a candidate was selected as the final result.
type SelectionReason string

const (
	SelectionReasonExplicitFinal  SelectionReason = "explicit_final"
	SelectionReasonTerminalResult SelectionReason = "terminal_result"
	SelectionReasonLatestResult   SelectionReason = "latest_result"
)

// FinalRunResult captures the outcome of a completed blueprint run.
type FinalRunResult struct {
	State               FinalRunResultState       `json:"state"`
	Candidates          []FinalRunResultCandidate `json:"candidates"`
	FailedNode          *FinalRunResultCandidate  `json:"failed_node,omitempty"`
	WaitingApprovalNode *FinalRunResultCandidate  `json:"waiting_approval_node,omitempty"`
}

// FinalRunResultCandidate represents a single candidate output in the final result.
type FinalRunResultCandidate struct {
	NodeRunID       string          `json:"node_run_id"`
	BlueprintRunID  string          `json:"blueprint_run_id"`
	BlueprintID     string          `json:"blueprint_id"`
	NodeID          string          `json:"node_id"`
	NodeLabel       string          `json:"node_label"`
	NodeType        NodeType        `json:"node_type"`
	ResultRole      ResultRole      `json:"result_role"`
	SelectionReason SelectionReason `json:"selection_reason"`
	Output          interface{}     `json:"output"`
	EndedAt         *time.Time      `json:"ended_at"`
}

// ── Approval ────────────────────────────────────────────────────────────

// ApprovalStatus enumerates the possible states of an approval request.
type ApprovalStatus string

const (
	ApprovalStatusPending  ApprovalStatus = "pending"
	ApprovalStatusApproved ApprovalStatus = "approved"
	ApprovalStatusDenied   ApprovalStatus = "denied"
	ApprovalStatusTimeout  ApprovalStatus = "timeout"
)

// ApprovalType enumerates the kinds of approval gates.
type ApprovalType string

const (
	ApprovalTypeHuman ApprovalType = "human"
)

// ApprovalState captures the state of a human-approval gate.
type ApprovalState struct {
	RequestID       string         `json:"request_id"`
	Status          ApprovalStatus `json:"status"`
	Replies         []string       `json:"replies"`
	SelectedReplyID string         `json:"selected_reply_id"`
	SelectedOutput  interface{}    `json:"selected_output"`
	ReviewOutput    interface{}    `json:"review_output"`
	ApprovalType    ApprovalType   `json:"approval_type"`
}

// ── Inbox ───────────────────────────────────────────────────────────────

// InboxItemType enumerates the kinds of items that can appear in the user inbox.
type InboxItemType string

const (
	InboxItemTypeApproval     InboxItemType = "approval"
	InboxItemTypeProposal     InboxItemType = "proposal"
	InboxItemTypeNotification InboxItemType = "notification"
)

// InboxItemStatus enumerates the possible states of an inbox item.
type InboxItemStatus string

const (
	InboxItemStatusPending   InboxItemStatus = "pending"
	InboxItemStatusApproved  InboxItemStatus = "approved"
	InboxItemStatusRejected  InboxItemStatus = "rejected"
	InboxItemStatusRead      InboxItemStatus = "read"
	InboxItemStatusDone      InboxItemStatus = "done"
)

// InboxItem represents an item in the user's approval/notification inbox.
type InboxItem struct {
	ID               string                    `json:"id"`
	Type             InboxItemType             `json:"type"`
	Title            string                    `json:"title"`
	Description      string                    `json:"description"`
	Status           InboxItemStatus           `json:"status"`
	BlueprintID      string                    `json:"blueprint_id"`
	RunID            string                    `json:"run_id"`
	NodeID           string                    `json:"node_id"`
	Comment          string                    `json:"comment"`
	BlueprintPackage *PortableBlueprintPackage `json:"blueprint_package,omitempty"`
	CreatedByRoleID  string                    `json:"created_by_role_id"`
	TargetRoleID     string                    `json:"target_role_id"`
	Summary          string                    `json:"summary"`
	Preview          string                    `json:"preview"`
	DiffSummary      string                    `json:"diff_summary"`
	Schema           interface{}               `json:"schema"`
	CreatedAt        time.Time                 `json:"created_at"`
	ResolvedAt       *time.Time                `json:"resolved_at"`
}

// ── Import / Export ─────────────────────────────────────────────────────

// PortableBlueprintPackage is the serialisation format for blueprint import/export.
// Schema is always "hixns.blueprint-package/v1". On export, companyId and timestamps
// are stripped, send.channelId/target/tools are cleared. On import, auto-layout is applied.
type PortableBlueprintPackage struct {
	Schema     string                `json:"schema"`
	ExportedAt time.Time             `json:"exported_at"`
	Blueprints []BlueprintDefinition `json:"blueprints"`
}
