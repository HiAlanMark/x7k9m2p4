# HiveWard Manager/Slot/Group Node Analysis for Hi!XNS

## 1. MANAGER NODE TYPE

### TypeScript Config (from HiveWard `blueprint.ts`)

```typescript
interface ManagerNodeConfig extends BlueprintNodeBaseConfig {
  portCount: number;           // 1-8, default 3 — how many numbered slots
  maxHandoffs: number;         // 1-50, default 12 — loop guard
  instructions?: string;       // custom system prompt for the manager agent
  openclawAgentId?: string;    // which agent instance to use
  agentName?: string;          // agent name (default "manager")
  modelId?: string;            // model override
  skillIds?: string[];         // skills attached
  permissionProfile?: AgentPermissionProfile;
  workingDirectory?: string;
  timeoutMs?: number;
  tools?: string[];
}
```

### How It Routes Work Through Slots

The manager is an **LLM-driven dispatcher**. On each handoff cycle:

1. It receives `upstream` outputs + `previousResults` (trace of prior handoffs)
2. If `isAgentDriven` (has runtimeId = openclaw/codex/claude), it calls `runManagerDecisionTask()` — an LLM call with outputSchema requiring `{status, nextSlot, reason}`
3. The LLM picks the next numbered slot (1..portCount)
4. The worker calls `findManagerSlotAssignment(blueprint, managerNode, slot)` which:
   - Looks for an edge from manager with `sourceHandle = "manager-out-{slot}"`
   - Finds the target node
   - Checks if a return edge exists (target → manager with `targetHandle = "manager-in-{slot}"`)
5. If the target is an agent → execute it. If it's a manager_slot → execute the slot. If it's another manager → nested execution.
6. After the target completes, the manager reads its output JSON for routing keys:
   - `nextSlot`, `routeToSlot`, `returnToSlot`, `targetSlot` — any of these override the next slot
   - `status` = "complete"/"done"/"stop" → manager finishes
   - `status` = "fail"/"retry"/"rework" → retries previous slot
   - Default: advance to slot+1
7. Repeat until `status: "complete"` or `maxHandoffs` exceeded

### Default Config (from StudioPage)

```typescript
{
  label: "Manager",
  portCount: 3,
  maxHandoffs: 12,
  instructions: "...",    // customizable manager system prompt
  openclawAgentId: "main",
  agentName: "manager",
  permissionProfile: "read_only",
  timeoutMs: 600000,
  tools: []
}
```

### Visual Component (React JSX — BlueprintNodeCard)

```
┌──────────────────────────┐
│ [Network icon] [status]  │  ← topline with type icon + status
│ Manager                  │  ← label
│ Manager                  │  ← kind label
│                          │
│  1 ──── ──────           │  ← port row: index + rule + guide
│  2 ──── ──────           │  ← one row per port (1..portCount)
│  3 ──── ──────           │
│                          │
│ ◄ [input]   [output] ◄  │  ← LEFT side: blueprint input (top:34) & output (top:62)
│              [out-1] ►   │  ← RIGHT side: manager-out-{1..N} handles
│              [in-1]  ◄   │  ← RIGHT side: manager-in-{1..N} handles (offset below out)
│              [out-2] ►   │
│              [in-2]  ◄   │
│              ...         │
└──────────────────────────┘
```

Handle layout constants:
- `managerPortStart = 122px` — top offset of first port row
- `managerPortGap = 48px` — vertical gap between ports
- `managerPortLaneOffset = 11px` — input handles offset +11px, output -11px from port center
- `managerBlueprintInputTop = 34px`
- `managerBlueprintOutputTop = 62px`
- Node height = `managerPortStart + (portCount-1) * managerPortGap + 40`
- All slot handles are on the **RIGHT** side (`position: Position.Right`)
- Blueprint input/output handles are on the **LEFT** side

### Handle IDs

| Handle ID | Direction | Side | Purpose |
|---|---|---|---|
| (unnamed, class `manager-blueprint-input-handle`) | target (input) | Left | Blueprint flow input |
| (unnamed, class `manager-blueprint-output-handle`) | source (output) | Left | Blueprint flow output |
| `manager-in-{1..N}` | target (input) | Right | Return edge from slot |
| `manager-out-{1..N}` | source (output) | Right | Handoff edge to slot |

---

## 2. MANAGER SLOT NODE TYPE

### TypeScript Config

```typescript
interface ManagerSlotNodeConfig extends BlueprintNodeBaseConfig {
  managerNodeId: string;           // which manager owns this slot
  slot: number;                    // slot number (1..portCount)
  executionMode?: "manual" | "parallel";  // derived from parallelLaneCount
  parallelLaneCount?: number;      // 1-16, default 1; >1 means parallel mode
}
```

### Slot Execution Logic

When the manager delegates to a slot:

1. The slot receives a `ManagerSlotContext`:
   ```typescript
   {
     manager: { nodeId, nodeLabel, instructions, slot, handoff, maxHandoffs },
     upstream: UpstreamOutput[],
     previousResults: ManagerTraceItem[]
   }
   ```

2. **Children**: Nodes with `parentId === slotNode.id` and `isRunnableNode`

3. **Manual mode (parallelLaneCount=1)**: Children execute sequentially based on internal edge topology (same as top-level DAG, but scoped inside the slot). Uses `getScopedIncomingEdges` and `resolveScopedEdgeState`.

4. **Parallel mode (parallelLaneCount>1)**: ALL children run simultaneously. Output is collected from all successful child runs.

5. **Slot output resolution**:
   - Parallel: all children must succeed; output = `{ outputs: [...] }`
   - Manual: output from leaf nodes or nodes connected to `manager-slot-inner-in` handles

6. If no children, slot returns `{ status: "complete", reason: "manager_slot_empty" }`

### Visual Component (React — BlueprintNodeCard)

The slot is a **resizable container** that holds child nodes:

```
┌──────────────────────────────────────────────┐
│ [Network icon] [status]                      │
│ Slot 1                                       │
│ Manager Slot                                 │
│ ┌──────────────────────────────────────────┐ │
│ │                body area                 │ │
│ │  ┌─────┐   ┌─────┐   ┌─────┐           │ │
│ │  │child│   │child│   │child│           │ │
│ │  │  1  │   │  2  │   │  3  │           │ │
│ │  └─────┘   └─────┘   └─────┘           │ │
│ │                                          │ │
│ │  [lane labels: 1, 2, ...]               │ │
│ │  [wall lines on left and right]          │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

**Sizing constants**:
- `MANAGER_SLOT_DEFAULT_SIZE = { width: 560, height: 300 }`
- `MANAGER_SLOT_MIN_SIZE = { width: 420, height: 260 }`
- Frame: `{ top: 86, side: 28, bottom: 28 }` — header height, inner padding, bottom padding
- Has `NodeResizer` when selected

**Handle layout on the slot node itself**:

| Handle ID | Direction | Side | Position | Purpose |
|---|---|---|---|---|
| `manager-slot-in` | target | Left | top:30 | Edge from manager-out-{N} |
| `manager-slot-out` | source | Left | top:58 | Return edge to manager-in-{N} |
| `manager-slot-forward-out` | source | Right | top:58 | Forward to next top-level node |
| `manager-slot-inner-out` | source | Right | calculated | Inner output to child (lane 1) |
| `manager-slot-inner-out-{2..N}` | source | Right | calculated | Inner output to child (lane N) |
| `manager-slot-inner-in` | target | Left | calculated | Inner input from child (lane 1) |
| `manager-slot-inner-in-{2..N}` | target | Left | calculated | Inner input from child (lane N) |

**Inner handle position calculation** (from `managerSlotLaneHandleStyle`):
```
availableHeight = nodeHeight - frame.top - frame.bottom
top = frame.top + (availableHeight * lane) / (laneCount + 1)
```
For "out" handles: `left: frame.side, right: "auto"`
For "in" handles: `left: "auto", right: frame.side`

### Edge Wiring Rules (from `isBlueprintConnectionAllowed`)

| Source | SourceHandle | Target | TargetHandle | Allowed |
|---|---|---|---|---|
| manager | `manager-out-{N}` | manager_slot | `manager-slot-in` | YES |
| manager_slot | `manager-slot-out` | manager | `manager-in-{N}` | YES |
| manager_slot | `manager-slot-forward-out` | any non-manager, non-slot, no parentId | — | YES |
| manager_slot | `manager-slot-inner-out-{L}` | child | (parentId === slot.id) | YES |
| child | — | manager_slot | `manager-slot-inner-in-{L}` | (source.parentId === target.id) |

---

## 3. GROUP NODE TYPE

### TypeScript Config

```typescript
interface GroupNodeConfig extends BlueprintNodeBaseConfig {
  color: string;    // hex color, e.g. "#64748b"
}
```

### What It Does

**Purely visual grouping**. No execution logic. Not in `executableTypes`. Not in `resultProducingNodeTypes`. Not in `blueprintStepTypes`.

- Config form: just a color picker (`<input type="color">`)
- Default config: `{ label: "Group", color: "#64748b" }`
- NOT in the palette sidebar (palette only has: agent, manager, manager_slot, loop, condition, summary)
- Can be created from context menu but is not a first-class palette item
- In BlueprintNodeCard, the group uses `MessagesSquare` icon (same as note/summary — but in HiveWard it's decorative)

### Visual Component

The group node in HiveWard renders identically to other non-slot nodes in BlueprintNodeCard (standard input Left, output Right handles), with the `group` type class. The **color** is stored in config but applied via CSS class.

In a Vue implementation, this would be a simple colored rectangle with a label, serving as a visual container. No parentId enforcement — it's just a labeled colored box on the canvas.

---

## 4. HANDOFF FLOW (Runtime Execution)

### Manager Decision Protocol

The manager agent returns JSON conforming to this schema:

```json
{
  "type": "object",
  "required": ["status"],
  "properties": {
    "status": { "type": "string" },
    "nextSlot": { "type": "integer" },
    "routeToSlot": { "type": "integer" },
    "returnToSlot": { "type": "integer" },
    "targetSlot": { "type": "integer" },
    "reason": { "type": "string" }
  }
}
```

### Decision Resolution (`resolveManagerDecision`)

Priority order for reading the next slot from output:
1. `nextSlot`
2. `routeToSlot`
3. `returnToSlot`
4. `targetSlot`

Status interpretation:
| Agent returns `status` | Action |
|---|---|
| `"complete"`, `"done"`, `"stop"` | Manager completes |
| `"passed"`, `"pass"`, `"approved"` | Completes IF currentSlot >= portCount |
| `"fail"`, `"failed"`, `"retry"`, `"rework"`, `"blocked"`, `"reject"`, `"rejected"`, `"needs_revision"` | Retries previous slot (slot-1) |
| Any explicit slot number | Routes to that slot |
| No slot, no completion | Advances to currentSlot+1; completes if >= portCount |

If slot number is out of range (<1 or >portCount), manager completes.

### ManagerSlotContext (passed to slot children)

```typescript
{
  manager: {
    nodeId: string,
    nodeLabel: string,
    instructions?: string,
    slot: number,          // current slot number
    handoff: number,       // current handoff count
    maxHandoffs: number    // limit
  },
  upstream: UpstreamOutput[],
  previousResults: Array<{
    handoff: number,
    slot: number,
    nodeId: string,
    nodeLabel: string,
    status: "succeeded" | "failed" | "cancelled",
    output?: string,
    error?: string,
    decision?: ManagerDecision
  }>
}
```

### Manager Default Prompt

```
You are a Hiveward manager agent.
Choose which numbered slot should receive the next handoff by reading the upstream input, previousResults, and delegationRoster.
If there is no better instruction, run connected slots in ascending order.
Return only JSON with keys: status, nextSlot, reason.
Use status="continue" with nextSlot to delegate, or status="complete" when the workflow is done.
```

Plus delegation rules appended:
- Treat delegationRoster entries as descriptions of available subordinates
- Pick only slots that exist in delegationRoster
- Return only JSON, no markdown

### Delegation Roster (built for agent-driven managers)

The `delegationRoster` input gives the manager a summary of each connected slot:
```json
{
  "policy": "full_prompts_with_deterministic_truncation",
  "promptBudget": 24000,
  "slots": [
    {
      "slot": 1,
      "returnEdgePresent": true,
      "target": {
        "nodeId": "...",
        "label": "Slot 1",
        "type": "manager_slot",
        "executionMode": "manual",
        "children": [ /* descriptions of child agents */ ]
      }
    }
  ]
}
```

---

## 5. PALETTE (Blueprint Sidebar)

From HiveWard's `palette` array:

| Type | Icon (lucide) | In Palette |
|---|---|---|
| `agent` | `Bot` | YES |
| `manager` | `Network` | YES |
| `manager_slot` | `Network` | YES |
| `loop` | `Repeat2` | YES |
| `condition` | `GitBranch` | YES |
| `summary` | `MessagesSquare` | YES |
| `note` | — | NO (not in palette) |
| `group` | — | NO (not in palette) |

---

## 6. KEY IMPLEMENTATION NOTES FOR Hi!XNS VUE COMPONENTS

### Current Hi!XNS Gaps

The Hi!XNS `blueprint.ts` store currently only supports these node types:
```typescript
type: 'agent' | 'condition' | 'loop' | 'summary' | 'note'
```
Missing: `manager`, `manager_slot`, `group`

The Go backend (`blueprint.go`) already has all the types defined including `ManagerConfig`, `ManagerSlotConfig`, `GroupConfig`.

### What to Add

1. **Store type update**: Add `'manager' | 'manager_slot' | 'group'` to the BlueprintNode type union

2. **ManagerNode.vue**: New Vue component
   - Icon: Network/graph SVG
   - Shows port rows (1..portCount) with slot numbers
   - LEFT: Blueprint input/output handles (top/bottom or left side)
   - RIGHT: `manager-out-{N}` and `manager-in-{N}` handles per port
   - Config panel fields: portCount (1-8), maxHandoffs (1-50), instructions (textarea), runtime, model, skills

3. **ManagerSlotNode.vue**: New Vue component
   - Resizable container node (like a group with frame)
   - Frame: top 86px header, 28px side/bottom padding
   - Default size: 560x300, min: 420x260
   - LEFT: `manager-slot-in` (top:30), `manager-slot-out` (top:58), plus `manager-slot-inner-in-{L}` handles
   - RIGHT: `manager-slot-forward-out` (top:58), plus `manager-slot-inner-out-{L}` handles
   - Inner lane handles positioned proportionally within the frame area
   - Config panel: parallelLaneCount (1-16)
   - Children use `parentId` = slot node id, extent = "parent" (or calculated for slot)

4. **GroupNode.vue**: Simple visual node
   - Colored rectangle with configurable color picker
   - Standard input/output handles
   - No execution logic

5. **NodePanel.vue**: Add config sections for manager, manager_slot, group

6. **Edge validation**: Add `isBlueprintConnectionAllowed` logic for manager↔slot wiring

7. **Runtime worker**: The Go backend already has the structs; execution logic needs to mirror the TypeScript BlueprintWorker's manager reconciliation loop
