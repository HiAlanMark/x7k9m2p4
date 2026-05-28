<template>
  <div class="blueprint-view">
    <!-- ═══ List Mode ═══ -->
    <div v-if="mode === 'list'" class="bp-list-mode">
      <div class="bp-list-header">
        <div class="bp-list-title-row">
          <h2 class="bp-list-title">{{ t('blueprint.title') }}</h2>
          <div class="bp-list-actions">
            <button class="bp-action-btn bp-action-primary" @click="onCreateBlueprint">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>{{ t('blueprint.create') }}</span>
            </button>
            <button class="bp-action-btn" @click="triggerImport">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>{{ t('blueprint.import') }}</span>
            </button>
            <input
              ref="fileInputRef"
              type="file"
              accept=".json"
              class="bp-file-input"
              @change="onImportFile"
            />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="bpStore.blueprints.length === 0 && !bpStore.loading" class="bp-empty">
        <div class="bp-empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.3">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M12 8v8" />
            <path d="M8 12h8" />
          </svg>
        </div>
        <p class="bp-empty-text">{{ t('blueprint.empty') }}</p>
        <button class="bp-action-btn bp-action-primary" @click="onCreateBlueprint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>{{ t('blueprint.create') }}</span>
        </button>
      </div>

      <!-- Card Grid -->
      <div v-else class="bp-card-grid">
        <div
          v-for="bp in bpStore.blueprints"
          :key="bp.id"
          class="bp-card"
          @click="openEditor(bp)"
        >
          <div class="bp-card-glow" />
          <div class="bp-card-header">
            <h3 class="bp-card-name">{{ bp.name }}</h3>
            <span class="bp-card-count">{{ bp.nodes?.length || 0 }}</span>
          </div>
          <p class="bp-card-desc">{{ bp.description || '—' }}</p>
          <div class="bp-card-footer">
            <div class="bp-card-meta">
              <span v-if="bp.updated_at" class="bp-card-date">{{ formatDate(bp.updated_at) }}</span>
            </div>
            <div class="bp-card-btns" @click.stop>
              <button class="bp-card-btn bp-card-btn-run" @click.stop="onRunBlueprint(bp.id)" :title="t('blueprint.run.start')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </button>
              <button class="bp-card-btn" @click.stop="onExportBlueprint(bp.id)" :title="t('blueprint.export')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </button>
              <button class="bp-card-btn bp-card-btn-delete" @click.stop="onDeleteBlueprint(bp.id)" :title="t('common.delete')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          </div>
          <!-- Run Status Indicator -->
          <div v-if="getLastRunStatus(bp.id)" class="bp-card-run-status" :class="`status-${getLastRunStatus(bp.id)}`">
            <span class="bp-run-dot" />
            <span class="bp-run-text">{{ t(`blueprint.run.status.${getLastRunStatus(bp.id)}`) }}</span>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="bpStore.loading" class="bp-loading">
        <div class="bp-loading-spinner" />
        <span>{{ t('common.loading') }}</span>
      </div>
    </div>

    <!-- ═══ Editor Mode ═══ -->
    <div v-else class="bp-editor-mode">
      <!-- Floating Toolbar (left, below titlebar) -->
      <div class="bp-editor-toolbar">
        <button class="bp-toolbar-btn" @click="mode = 'list'" :title="t('common.close')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div class="bp-toolbar-divider"></div>
        <span class="bp-toolbar-name">{{ currentBp?.name || '' }}</span>
        <!--v-if-->
        <div class="bp-toolbar-divider"></div>
        <button
          class="bp-toolbar-btn bp-toolbar-run"
          @click="onRunBlueprint(currentBp?.id || '')"
          :disabled="!currentBp"
          title="运行蓝图"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
          <span>{{ t('blueprint.run.start') }}</span>
        </button>
        <button
          v-if="currentRun?.status === 'running'"
          class="bp-toolbar-btn bp-toolbar-stop"
          @click="onCancelRun(currentRun.id)"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1" /></svg>
          <span>{{ t('blueprint.run.stop') }}</span>
        </button>
        <!--v-if-->
        <div class="bp-toolbar-divider"></div>
        <button class="bp-toolbar-btn bp-toolbar-labeled" @click="onSaveBlueprint" :disabled="!currentBp" :title="t('common.save')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          <span>{{ t('common.save') }}</span>
        </button>
        <button class="bp-toolbar-btn bp-toolbar-labeled" @click="onExportBlueprint(currentBp?.id || '')" :title="t('common.export')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>{{ t('common.export') }}</span>
        </button>
        <button class="bp-toolbar-btn bp-toolbar-labeled" @click="triggerImport" :title="t('common.import')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>{{ t('common.import') }}</span>
        </button>
        <input ref="fileInputRef" type="file" accept=".json" class="bp-file-input" @change="onImportFile" />
        <div class="bp-toolbar-divider"></div>
        <button class="bp-toolbar-btn" :class="{ 'bp-toolbar-active': showDrawer }" @click="showDrawer = !showDrawer" :title="t('blueprint.drawer.title')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </button>
      </div>

      <!-- Floating Palette (right) -->
      <div class="bp-palette">
        <div class="bp-palette-title">{{ t('blueprint.nodes.agent') }}</div>
        <div
          v-for="nodeType in nodeTypes"
          :key="nodeType.type"
          class="bp-palette-item"
          :class="`palette-${nodeType.type}`"
          draggable="true"
          @dragstart="onDragStart($event, nodeType.type)"
        >
          <span class="bp-palette-icon" v-html="nodeType.icon" />
          <span class="bp-palette-label">{{ nodeType.label }}</span>
        </div>
      </div>

      <!-- ═══ Side Drawer + Canvas Row ═══ -->
      <div class="bp-editor-row">
      <!-- ═══ Side Drawer: Blueprint List ═══ -->
      <aside v-if="showDrawer" class="bp-side-drawer">
        <div class="bp-drawer-header">
          <strong class="bp-drawer-title">{{ t('blueprint.drawer.title') }}</strong>
          <div class="bp-drawer-actions">
            <button class="bp-drawer-action-btn" @click="onCreateBlueprint" :title="t('blueprint.create')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
          </div>
        </div>
        <div class="bp-drawer-tools">
          <label class="bp-drawer-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input v-model="drawerSearch" type="search" :placeholder="t('blueprint.drawer.search')" />
          </label>
          <select v-model="drawerSort" class="bp-drawer-sort">
            <option value="recent">{{ t('blueprint.drawer.sortRecent') }}</option>
            <option value="name">{{ t('blueprint.drawer.sortName') }}</option>
            <option value="nodes">{{ t('blueprint.drawer.sortNodes') }}</option>
          </select>
        </div>
        <div class="bp-drawer-list">
          <div v-if="sortedBlueprints.length === 0" class="bp-drawer-empty">{{ t('blueprint.empty') }}</div>
          <button
            v-for="bp in sortedBlueprints"
            :key="bp.id"
            class="bp-drawer-item"
            :class="{ 'bp-drawer-item-active': bp.id === currentBp?.id }"
            @click="switchBlueprint(bp)"
            @contextmenu.prevent="onDrawerItemContext($event, bp.id)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>
            <span class="bp-drawer-item-name">{{ bp.name }}</span>
            <span class="bp-drawer-item-count">{{ bp.nodes?.length || 0 }}</span>
          </button>
        </div>
      </aside>

      <!-- Editor Body -->
      <div class="bp-editor-body">
        <div class="bp-canvas-wrap" @drop="onDrop" @dragover.prevent>
          <VueFlow
            v-model:nodes="nodes"
            v-model:edges="edges"
            :node-types="customNodeTypes"
            :default-viewport="{ x: 50, y: 50, zoom: 0.9 }"
            :min-zoom="0.2"
            :max-zoom="2"
            :is-valid-connection="isValidConnection"
            fit-view-on-init
            @node-click="onNodeClick"
            @pane-click="onPaneClick"
            @pane-context-menu="onPaneContextMenu"
            @node-context-menu="onNodeContextMenu"
            @move-end="onViewportChange"
          >
            <Background :gap="16" :size="1" />
            <Controls />
            <MiniMap />
          </VueFlow>
        </div>

        <!-- Right Sidebar: Property Panel -->
        <NodePanel
          v-if="selectedNode"
          :node="selectedNode"
          @close="selectedNode = null"
          @update="onNodeUpdate"
          @delete="onNodeDelete"
        />
      </div>
      </div><!-- /bp-editor-row -->

      <!-- ═══ Multi-select Batch Bar ═══ -->
      <div v-if="multiSelected" class="bp-batch-bar">
        <span class="bp-batch-count">{{ multiSelectedCount }} selected</span>
        <button class="bp-batch-btn" @click="batchEnable">{{ t('blueprint.enableNode') }}</button>
        <button class="bp-batch-btn" @click="batchDisable">{{ t('blueprint.disableNode') }}</button>
        <button class="bp-batch-btn bp-batch-danger" @click="batchDelete">{{ t('blueprint.deleteNode') }}</button>
      </div>

      <!-- ═══ Canvas Context Menu: Add Node ═══ -->
      <div
        v-if="canvasContextMenu.show"
        class="bp-ctx-menu bp-ctx-add-menu"
        :style="{ left: canvasContextMenu.x + 'px', top: canvasContextMenu.y + 'px' }"
      >
        <div class="bp-ctx-title">{{ t('blueprint.addNode') }}</div>
        <div class="bp-ctx-list">
          <button
            v-for="nt in nodeTypes"
            :key="nt.type"
            class="bp-ctx-item"
            @click="addNodeAtContextMenu(nt.type)"
          >
            <span class="bp-ctx-icon" v-html="nt.icon" />
            <span>{{ nt.label }}</span>
          </button>
        </div>
      </div>

      <!-- ═══ Node Context Menu: Disable/Delete ═══ -->
      <div
        v-if="nodeContextMenu.show"
        class="bp-ctx-menu bp-ctx-node-menu"
        :style="{ left: nodeContextMenu.x + 'px', top: nodeContextMenu.y + 'px' }"
      >
        <button class="bp-ctx-item" @click="toggleNodeDisabled">
          {{ nodeContextMenuTarget?.data?.disabled ? t('blueprint.enableNode') : t('blueprint.disableNode') }}
        </button>
        <button class="bp-ctx-item bp-ctx-danger" @click="deleteContextMenuNode">
          {{ t('blueprint.deleteNode') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, markRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { VueFlow, useVueFlow, type Node, type Edge, type NodeMouseEvent } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/minimap/dist/style.css'

import { useBlueprintStore } from '@/stores/blueprint'
import { useToast } from '@/composables/useToast'
import AgentNode from '@/components/blueprint/AgentNode.vue'
import ConditionNode from '@/components/blueprint/ConditionNode.vue'
import LoopNode from '@/components/blueprint/LoopNode.vue'
import SummaryNode from '@/components/blueprint/SummaryNode.vue'
import NoteNode from '@/components/blueprint/NoteNode.vue'
import ManagerNode from '@/components/blueprint/ManagerNode.vue'
import ManagerSlotNode from '@/components/blueprint/ManagerSlotNode.vue'
import GroupNode from '@/components/blueprint/GroupNode.vue'
import NodePanel from '@/components/blueprint/NodePanel.vue'

const { t } = useI18n()
const bpStore = useBlueprintStore()
const toast = useToast()

// ── Vue Flow setup ──────────────────────────
const customNodeTypes = {
  agent: markRaw(AgentNode),
  condition: markRaw(ConditionNode),
  loop: markRaw(LoopNode),
  summary: markRaw(SummaryNode),
  note: markRaw(NoteNode),
  manager: markRaw(ManagerNode),
  manager_slot: markRaw(ManagerSlotNode),
  group: markRaw(GroupNode),
}

const { addNodes, addEdges, onConnect, project, getViewport, setViewport, getSelectedNodes, getSelectedEdges } = useVueFlow()

const nodes = ref<Node[]>([])
const edges = ref<Edge[]>([])
onConnect((params) => {
  addEdges([params])
})

// ── Mode & Selection ────────────────────────
const mode = ref<'list' | 'editor'>('list')
const currentBp = ref<typeof bpStore.blueprints[0] | null>(null)
const selectedNode = ref<{ id: string; type: string; data: Record<string, any> } | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

// ── Multi-select batch operations ────────────
const multiSelected = computed(() => getSelectedNodes.value.filter(n => n.selected).length > 1)
const multiSelectedCount = computed(() => getSelectedNodes.value.filter(n => n.selected).length)

function batchDelete() {
  const sel = getSelectedNodes.value.filter(n => n.selected)
  const ids = new Set(sel.map(n => n.id))
  nodes.value = nodes.value.filter(n => !ids.has(n.id))
  edges.value = edges.value.filter(e => !ids.has(e.source) && !ids.has(e.target))
  selectedNode.value = null
}

function batchDisable() {
  const sel = getSelectedNodes.value.filter(n => n.selected)
  for (const n of sel) {
    if (n.data) n.data.disabled = true
  }
}

function batchEnable() {
  const sel = getSelectedNodes.value.filter(n => n.selected)
  for (const n of sel) {
    if (n.data) n.data.disabled = false
  }
}

const currentRun = computed(() => {
  if (!currentBp.value) return null
  return bpStore.runs.find(r => r.blueprint_id === currentBp.value!.id && r.status === 'running') || null
})

// ── Node Palette ────────────────────────────
const nodeTypes = computed(() => [
  { type: 'agent', label: t('blueprint.nodes.agent'), icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 13v1a7 7 0 0 1-14 0v-1"/><line x1="12" y1="18" x2="12" y2="22"/></svg>' },
  { type: 'condition', label: t('blueprint.nodes.condition'), icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>' },
  { type: 'loop', label: t('blueprint.nodes.loop'), icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>' },
  { type: 'summary', label: t('blueprint.nodes.summary'), icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/></svg>' },
  { type: 'note', label: t('blueprint.nodes.note'), icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>' },
  { type: 'manager', label: t('blueprint.nodes.manager'), icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>' },
  { type: 'manager_slot', label: t('blueprint.nodes.managerSlot'), icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>' },
  { type: 'group', label: t('blueprint.nodes.group'), icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>' },
])

// ── Drag & Drop ─────────────────────────────
function onDragStart(event: DragEvent, type: string) {
  event.dataTransfer?.setData('application/vueflow', type)
  event.dataTransfer!.effectAllowed = 'move'
}

function onDrop(event: DragEvent) {
  const type = event.dataTransfer?.getData('application/vueflow') as string
  if (!type) return

  const { left, top } = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const position = {
    x: event.clientX - left - 80,
    y: event.clientY - top - 40,
  }

  const newNode: Node = {
    id: `${type}-${Date.now()}`,
    type,
    position,
    data: { label: nodeTypes.value.find(n => n.type === type)?.label || type },
  }

  addNodes([newNode])
}

// ── Node Selection ──────────────────────────
function onNodeClick({ node }: { node: Node }) {
  selectedNode.value = { id: node.id, type: node.type || 'agent', data: { ...node.data } }
}

function onPaneClick() {
  selectedNode.value = null
  closeContextMenu()
}

// ── Context Menus ───────────────────────────
const canvasContextMenu = ref<{ show: boolean; x: number; y: number; flowPos: { x: number; y: number } }>({
  show: false, x: 0, y: 0, flowPos: { x: 0, y: 0 }
})
const nodeContextMenu = ref<{ show: boolean; x: number; y: number; nodeId: string }>({
  show: false, x: 0, y: 0, nodeId: ''
})
const nodeContextMenuTarget = computed(() =>
  nodeContextMenu.value.show ? nodes.value.find(n => n.id === nodeContextMenu.value.nodeId) : null
)

function onPaneContextMenu(event: MouseEvent) {
  event.preventDefault()
  closeContextMenu()
  const flowPos = project({ x: event.clientX, y: event.clientY })
  canvasContextMenu.value = {
    show: true,
    x: event.clientX,
    y: event.clientY,
    flowPos: { x: flowPos.x - 80, y: flowPos.y - 40 }
  }
}

function onNodeContextMenu({ event, node }: NodeMouseEvent) {
  event.preventDefault()
  closeContextMenu()
  const me = event as MouseEvent
  nodeContextMenu.value = {
    show: true,
    x: me.clientX,
    y: me.clientY,
    nodeId: node.id
  }
}

function addNodeAtContextMenu(type: string) {
  const newNode: Node = {
    id: `${type}-${Date.now()}`,
    type,
    position: canvasContextMenu.value.flowPos,
    data: { label: nodeTypes.value.find(n => n.type === type)?.label || type },
  }
  addNodes([newNode])
  closeContextMenu()
}

function toggleNodeDisabled() {
  const node = nodes.value.find(n => n.id === nodeContextMenu.value.nodeId)
  if (node) {
    node.data = { ...node.data, disabled: !node.data?.disabled }
  }
  closeContextMenu()
}

function deleteContextMenuNode() {
  const nodeId = nodeContextMenu.value.nodeId
  nodes.value = nodes.value.filter(n => n.id !== nodeId)
  edges.value = edges.value.filter(e => e.source !== nodeId && e.target !== nodeId)
  if (selectedNode.value?.id === nodeId) selectedNode.value = null
  closeContextMenu()
}

function closeContextMenu() {
  canvasContextMenu.value.show = false
  nodeContextMenu.value.show = false
}

// Close context menu on outside click
function onGlobalClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.bp-ctx-menu')) {
    closeContextMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', onGlobalClick)
  bpStore.fetchBlueprints()
  bpStore.fetchInbox()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onGlobalClick)
})

// ── Connection Validation (P0-3) ────────────
function isValidConnection(connection: { source: string; target: string; sourceHandle?: string | null; targetHandle?: string | null }): boolean {
  // No self-connections
  if (connection.source === connection.target) return false
  // No duplicate edges
  const exists = edges.value.some(
    e => e.source === connection.source && e.target === connection.target
      && e.sourceHandle === (connection.sourceHandle ?? null)
      && e.targetHandle === (connection.targetHandle ?? null)
  )
  if (exists) return false
  // Both nodes must exist and not be disabled
  const sourceNode = nodes.value.find(n => n.id === connection.source)
  const targetNode = nodes.value.find(n => n.id === connection.target)
  if (!sourceNode || !targetNode) return false
  if (sourceNode.data?.disabled || targetNode.data?.disabled) return false
  return true
}

// ── Side Drawer (P1-1) ──────────────────────
const showDrawer = ref(false)
const drawerSearch = ref('')
const drawerSort = ref<'recent' | 'name' | 'nodes'>('recent')
const drawerContextMenu = ref<{ show: boolean; x: number; y: number; bpId: string }>({ show: false, x: 0, y: 0, bpId: '' })

const sortedBlueprints = computed(() => {
  let list = [...bpStore.blueprints]
  if (drawerSearch.value) {
    const q = drawerSearch.value.toLowerCase()
    list = list.filter(bp => bp.name.toLowerCase().includes(q))
  }
  switch (drawerSort.value) {
    case 'name': list.sort((a, b) => a.name.localeCompare(b.name)); break
    case 'nodes': list.sort((a, b) => (b.nodes?.length || 0) - (a.nodes?.length || 0)); break
    case 'recent': default: list.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()); break
  }
  return list
})

function switchBlueprint(bp: typeof bpStore.blueprints[0]) {
  // Save current viewport before switching
  saveViewport()
  openEditor(bp)
}

function onDrawerItemContext(event: MouseEvent, bpId: string) {
  drawerContextMenu.value = { show: true, x: event.clientX, y: event.clientY, bpId }
}

// ── Viewport Persistence (P1-3) ─────────────
function onViewportChange() {
  saveViewport()
}

function saveViewport() {
  if (!currentBp.value) return
  try {
    const vp = getViewport()
    const key = `bp-viewport-${currentBp.value.id}`
    localStorage.setItem(key, JSON.stringify({ x: vp.x, y: vp.y, zoom: vp.zoom }))
  } catch { /* ignore */ }
}

function restoreViewport(bpId: string) {
  try {
    const key = `bp-viewport-${bpId}`
    const raw = localStorage.getItem(key)
    if (raw) {
      const vp = JSON.parse(raw)
      setViewport(vp, { duration: 0 })
    }
  } catch { /* ignore */ }
}

function onNodeUpdate(nodeId: string, field: string, value: any) {
  const node = nodes.value.find(n => n.id === nodeId)
  if (node) {
    node.data = { ...node.data, [field]: value }
  }
  if (selectedNode.value?.id === nodeId) {
    selectedNode.value = { ...selectedNode.value, data: { ...selectedNode.value.data, [field]: value } }
  }
}

function onNodeDelete(nodeId: string) {
  nodes.value = nodes.value.filter(n => n.id !== nodeId)
  edges.value = edges.value.filter(e => e.source !== nodeId && e.target !== nodeId)
  selectedNode.value = null
}

// ── Blueprint CRUD ──────────────────────────
async function onCreateBlueprint() {
  const name = `Blueprint ${bpStore.blueprints.length + 1}`
  const bp = await bpStore.createBlueprint(name, '')
  if (bp) {
    toast.success(t('common.success'))
    openEditor(bp)
  } else if (bpStore.error) {
    toast.error(bpStore.error)
  }
}

function openEditor(bp: typeof bpStore.blueprints[0]) {
  currentBp.value = bp
  mode.value = 'editor'
  selectedNode.value = null

  // Load nodes & edges from blueprint data
  if (bp.nodes?.length) {
    nodes.value = bp.nodes.map(n => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: { ...n.data },
    }))
  } else {
    nodes.value = []
  }
  if (bp.edges?.length) {
    edges.value = bp.edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle,
    }))
  } else {
    edges.value = []
  }

  bpStore.fetchRuns(bp.id)

  // Restore saved viewport position
  nextTick(() => restoreViewport(bp.id))
}

async function onSaveBlueprint() {
  if (!currentBp.value) return
  saveViewport() // persist viewport on save
  const bpNodes = nodes.value.map(n => ({
    id: n.id,
    type: n.type as any,
    position: n.position,
    data: { ...n.data },
  }))
  const bpEdges = edges.value.map(e => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle,
  }))
  await bpStore.updateBlueprint(currentBp.value.id, {
    nodes: bpNodes,
    edges: bpEdges,
  } as any)
  toast.success(t('common.success'))
}

async function onDeleteBlueprint(id: string) {
  await bpStore.deleteBlueprint(id)
  toast.success(t('common.success'))
}

async function onRunBlueprint(id: string) {
  if (!id) return
  const run = await bpStore.runBlueprint(id)
  if (run) {
    toast.success(t('blueprint.run.start'))
  } else if (bpStore.error) {
    toast.error(bpStore.error)
  }
}

async function onCancelRun(id: string) {
  await bpStore.cancelRun(id)
  toast.success(t('blueprint.run.stop'))
}

async function onExportBlueprint(id: string) {
  if (!id) return
  await bpStore.exportBlueprint(id)
  toast.success(t('blueprint.export'))
}

function triggerImport() {
  fileInputRef.value?.click()
}

async function onImportFile(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const bp = await bpStore.importBlueprint(file)
  if (bp) {
    toast.success(t('common.success'))
  } else if (bpStore.error) {
    toast.error(bpStore.error)
  }
  target.value = ''
}

// ── Helpers ─────────────────────────────────
function getLastRunStatus(bpId: string): string | null {
  const bpRuns = bpStore.runs.filter(r => r.blueprint_id === bpId)
  if (!bpRuns.length) return null
  return bpRuns[0].status
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return dateStr
  }
}
</script>

<style scoped>
/* ═══════════════════════════════════════════
   Blueprint View — Glass IDE Design
   ═══════════════════════════════════════════ */

.blueprint-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--text-primary);
  background: var(--bg-base, transparent);
}

/* ── List Mode ─────────────────────────────── */
.bp-list-mode {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

.bp-list-header {
  margin-bottom: 20px;
}

.bp-list-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.bp-list-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.bp-list-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bp-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid var(--border-base);
  border-radius: 10px;
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.bp-action-btn:hover {
  border-color: var(--border-base);
  background: var(--glass-bg-hover);
}

.bp-action-primary {
  background: color-mix(in srgb, var(--info) 20%, transparent);
  border-color: color-mix(in srgb, var(--info) 30%, transparent);
  color: var(--info);
}

.bp-action-primary:hover {
  background: color-mix(in srgb, var(--info) 30%, transparent);
  border-color: color-mix(in srgb, var(--info) 50%, transparent);
}

.bp-file-input {
  display: none;
}

/* ── Empty State ────────────────────────────── */
.bp-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 0;
}

.bp-empty-icon {
  opacity: 0.3;
}

.bp-empty-text {
  color: var(--text-secondary);
  font-size: 13px;
  margin: 0;
}

/* ── Card Grid ─────────────────────────────── */
.bp-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.bp-card {
  position: relative;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(1.6);
  -webkit-backdrop-filter: blur(20px) saturate(1.6);
  border: 1px solid var(--border-base);
  border-radius: 16px;
  padding: 16px 18px;
  cursor: pointer;
  transition: border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.bp-card:hover {
  border-color: color-mix(in srgb, var(--info) 30%, transparent);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px var(--shadow-sm), 0 0 20px color-mix(in srgb, var(--info) 8%, transparent);
}

.bp-card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.bp-card:hover .bp-card-glow {
  opacity: 1;
}

.bp-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.bp-card-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bp-card-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  background: color-mix(in srgb, var(--info) 15%, transparent);
  color: var(--info);
  font-size: 10px;
  font-weight: 700;
  border-radius: 6px;
}

.bp-card-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0 0 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bp-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bp-card-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}

.bp-card-date {
  font-size: 10px;
  color: var(--text-tertiary, var(--text-secondary));
}

.bp-card-btns {
  display: flex;
  gap: 4px;
}

.bp-card-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 8px;
  background: var(--glass-bg);
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.bp-card-btn:hover {
  background: var(--glass-bg-hover);
  color: var(--text-primary);
}

.bp-card-btn-run {
  color: var(--success);
}

.bp-card-btn-run:hover {
  background: color-mix(in srgb, var(--success) 15%, transparent);
  color: var(--success);
}

.bp-card-btn-delete:hover {
  background: color-mix(in srgb, var(--error) 15%, transparent);
  color: var(--error);
}

.bp-card-run-status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--border-base);
}

.bp-run-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.bp-run-text {
  font-size: 10px;
  font-weight: 500;
}

.status-running .bp-run-dot { background: var(--info); box-shadow: 0 0 6px color-mix(in srgb, var(--info) 60%, transparent); }
.status-running .bp-run-text { color: var(--info); }
.status-succeeded .bp-run-dot { background: var(--success); box-shadow: 0 0 6px color-mix(in srgb, var(--success) 60%, transparent); }
.status-succeeded .bp-run-text { color: var(--success); }
.status-failed .bp-run-dot { background: var(--error); box-shadow: 0 0 6px color-mix(in srgb, var(--error) 60%, transparent); }
.status-failed .bp-run-text { color: var(--error); }
.status-waiting_approval .bp-run-dot { background: var(--accent); box-shadow: 0 0 6px color-mix(in srgb, var(--accent) 60%, transparent); }
.status-waiting_approval .bp-run-text { color: var(--accent); }

/* ── Loading ────────────────────────────────── */
.bp-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px;
  color: var(--text-secondary);
  font-size: 12px;
}

.bp-loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--border-base);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ═══════════════════════════════════════════
   Editor Mode
   ═══════════════════════════════════════════ */

.bp-editor-mode {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

/* ── Toolbar — floating top-left ───────────── */
.bp-editor-toolbar {
  position: absolute;
  top: 38px;
  left: 6px;
  z-index: 100;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background: var(--glass-strong);
  backdrop-filter: blur(32px) saturate(1.6);
  -webkit-backdrop-filter: blur(32px) saturate(1.6);
  border: 1px solid var(--border-base);
  border-radius: 10px;
  box-shadow: var(--shadow-md);
}

.bp-toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.bp-toolbar-labeled {
  padding: 0 10px;
}

.bp-toolbar-labeled span {
  font-size: 11px;
  white-space: nowrap;
}

.bp-toolbar-btn:hover {
  background: var(--glass-bg-hover);
  color: var(--text-primary);
}

.bp-toolbar-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.bp-toolbar-run {
  padding: 0 10px;
  background: color-mix(in srgb, var(--success) 15%, transparent);
  border: 1px solid color-mix(in srgb, var(--success) 30%, transparent);
  color: var(--success);
}

.bp-toolbar-run:hover:not(:disabled) {
  background: color-mix(in srgb, var(--success) 25%, transparent);
}

.bp-toolbar-stop {
  padding: 0 10px;
  background: color-mix(in srgb, var(--error) 15%, transparent);
  border: 1px solid color-mix(in srgb, var(--error) 30%, transparent);
  color: var(--error);
}

.bp-toolbar-stop:hover {
  background: color-mix(in srgb, var(--error) 25%, transparent);
}

.bp-toolbar-divider {
  width: 1px;
  height: 20px;
  background: var(--border-base);
  margin: 0 2px;
  flex-shrink: 0;
}

.bp-toolbar-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
}

/* ── Palette — floating right ──────────────── */
.bp-palette {
  position: absolute;
  top: 38px;
  right: 6px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 190px;
  max-height: calc(100% - 48px);
  padding: 10px;
  background: var(--glass-strong);
  backdrop-filter: blur(32px) saturate(1.6);
  -webkit-backdrop-filter: blur(32px) saturate(1.6);
  border: 1px solid var(--border-base);
  border-radius: 10px;
  box-shadow: var(--shadow-md);
  overflow-y: auto;
}

.bp-palette-title {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  margin-bottom: 4px;
  padding: 0 6px;
}

.bp-palette-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid var(--border-base);
  background: var(--glass-bg);
  cursor: grab;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  margin-bottom: 4px;
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 500;
}

.bp-palette-item:hover {
  background: var(--glass-bg-hover);
  border-color: var(--border-base);
  color: var(--text-primary);
}

.bp-palette-item:active {
  cursor: grabbing;
}

.palette-agent { border-left: 3px solid var(--info); }
.palette-condition { border-left: 3px solid var(--warning); }
.palette-loop { border-left: 3px solid var(--purple); }
.palette-summary { border-left: 3px solid var(--accent); }
.palette-note { border-left: 3px solid var(--yellow); }

.palette-agent .bp-palette-icon { color: var(--info); }
.palette-condition .bp-palette-icon { color: var(--warning); }
.palette-loop .bp-palette-icon { color: var(--purple); }
.palette-summary .bp-palette-icon { color: var(--accent); }
.palette-note .bp-palette-icon { color: var(--yellow); }

.bp-palette-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.bp-palette-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Editor Body ───────────────────────────── */
.bp-editor-row {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.bp-editor-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ── Canvas ─────────────────────────────────── */
.bp-canvas-wrap {
  flex: 1;
  background: var(--bg-base);
  position: relative;
}

/* ── Vue Flow overrides for glass theme ─────── */
.bp-canvas-wrap :deep(.vue-flow) {
  background: transparent;
}

.bp-canvas-wrap :deep(.vue-flow__minimap) {
  background: var(--glass-bg);
  border: 1px solid var(--border-base);
  border-radius: 12px;
}

.bp-canvas-wrap :deep(.vue-flow__controls) {
  background: var(--glass-bg);
  border: 1px solid var(--border-base);
  border-radius: 10px;
  overflow: hidden;
}

.bp-canvas-wrap :deep(.vue-flow__controls-button) {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--border-base);
  color: var(--text-secondary);
  fill: var(--text-secondary);
}

.bp-canvas-wrap :deep(.vue-flow__controls-button:hover) {
  background: var(--glass-bg-hover);
}

/* ── Node selected state (VueFlow wraps node in .vue-flow__node) ── */
.bp-canvas-wrap :deep(.vue-flow__node.selected) {
  z-index: 10;
}

/* Global selected glow + color bar brightening */
.bp-canvas-wrap :deep(.vue-flow__node.selected > div) {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 35%, transparent),
              0 0 20px color-mix(in srgb, var(--accent) 12%, transparent) !important;
}

/* Per-type selected glow colors + color bar full opacity */
.bp-canvas-wrap :deep(.vue-flow__node.selected .bp-agent-node) {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--info) 40%, transparent),
              0 0 20px color-mix(in srgb, var(--info) 10%, transparent) !important;
}
.bp-canvas-wrap :deep(.vue-flow__node.selected .bp-agent-node::before) {
  opacity: 1 !important;
  box-shadow: 0 0 10px color-mix(in srgb, var(--info) 50%, transparent) !important;
}

.bp-canvas-wrap :deep(.vue-flow__node.selected .bp-condition-node) {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--warning) 40%, transparent),
              0 0 20px color-mix(in srgb, var(--warning) 10%, transparent) !important;
}
.bp-canvas-wrap :deep(.vue-flow__node.selected .bp-condition-node::before) {
  opacity: 1 !important;
  box-shadow: 0 0 10px color-mix(in srgb, var(--warning) 50%, transparent) !important;
}

.bp-canvas-wrap :deep(.vue-flow__node.selected .bp-loop-node) {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--purple, #af52de) 40%, transparent),
              0 0 20px color-mix(in srgb, var(--purple, #af52de) 10%, transparent) !important;
}
.bp-canvas-wrap :deep(.vue-flow__node.selected .bp-loop-node::before) {
  opacity: 1 !important;
  box-shadow: 0 0 10px color-mix(in srgb, var(--purple, #af52de) 50%, transparent) !important;
}

.bp-canvas-wrap :deep(.vue-flow__node.selected .bp-summary-node) {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 40%, transparent),
              0 0 20px color-mix(in srgb, var(--accent) 10%, transparent) !important;
}
.bp-canvas-wrap :deep(.vue-flow__node.selected .bp-summary-node::before) {
  opacity: 1 !important;
  box-shadow: 0 0 10px color-mix(in srgb, var(--accent) 50%, transparent) !important;
}

.bp-canvas-wrap :deep(.vue-flow__node.selected .bp-note-node) {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--yellow, #ffd60a) 40%, transparent),
              0 0 20px color-mix(in srgb, var(--yellow, #ffd60a) 10%, transparent) !important;
}
.bp-canvas-wrap :deep(.vue-flow__node.selected .bp-note-node::before) {
  opacity: 1 !important;
  box-shadow: 0 0 10px color-mix(in srgb, var(--yellow, #ffd60a) 50%, transparent) !important;
}

.bp-canvas-wrap :deep(.vue-flow__node.selected .bp-manager-node) {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--purple, #af52de) 40%, transparent),
              0 0 20px color-mix(in srgb, var(--purple, #af52de) 10%, transparent) !important;
}
.bp-canvas-wrap :deep(.vue-flow__node.selected .bp-manager-node::before) {
  opacity: 1 !important;
  box-shadow: 0 0 10px color-mix(in srgb, var(--purple, #af52de) 50%, transparent) !important;
}

.bp-canvas-wrap :deep(.vue-flow__node.selected .bp-manager-slot-node) {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--info) 40%, transparent),
              0 0 20px color-mix(in srgb, var(--info) 10%, transparent) !important;
}
.bp-canvas-wrap :deep(.vue-flow__node.selected .bp-manager-slot-node::before) {
  opacity: 1 !important;
  box-shadow: 0 0 10px color-mix(in srgb, var(--info) 50%, transparent) !important;
}

.bp-canvas-wrap :deep(.vue-flow__node.selected .bp-group-node) {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--yellow, #ffd60a) 40%, transparent),
              0 0 20px color-mix(in srgb, var(--yellow, #ffd60a) 10%, transparent) !important;
}

/* ── Edge styles ─────────────────────────────── */
.bp-canvas-wrap :deep(.vue-flow__edge-path) {
  stroke: var(--border-strong);
  stroke-width: 2;
}

.bp-canvas-wrap :deep(.vue-flow__edge.selected .vue-flow__edge-path) {
  stroke: var(--accent);
  stroke-width: 2.5;
}

.bp-canvas-wrap :deep(.vue-flow__edge.animated .vue-flow__edge-path) {
  stroke-dasharray: 5;
  animation: bp-edge-flow 0.6s linear infinite;
}

@keyframes bp-edge-flow {
  to { stroke-dashoffset: -10; }
}

.bp-canvas-wrap :deep(.vue-flow__connection-line) {
  stroke: var(--accent);
  stroke-width: 2;
}

.bp-canvas-wrap :deep(.vue-flow__background) {
  background: transparent;
}

/* ── Context Menus ─────────────────────────── */
.bp-ctx-menu {
  position: fixed;
  z-index: 100;
  min-width: 200px;
  padding: 10px;
  border: 1px solid var(--border-base);
  border-radius: 10px;
  background: var(--glass-base);
  backdrop-filter: blur(32px) saturate(1.6);
  -webkit-backdrop-filter: blur(32px) saturate(1.6);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: ctxFadeIn 0.12s ease-out;
}

@keyframes ctxFadeIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

.bp-ctx-title {
  margin-bottom: 8px;
  padding-bottom: 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-base);
}

.bp-ctx-list {
  display: grid;
  gap: 4px;
}

.bp-ctx-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 36px;
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-primary);
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition: background 0.12s;
}

.bp-ctx-item:hover {
  background: color-mix(in srgb, var(--accent) 12%, transparent);
}

.bp-ctx-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: var(--text-secondary);
}

.bp-ctx-icon :deep(svg) {
  width: 16px;
  height: 16px;
}

.bp-ctx-danger {
  color: var(--error);
}

.bp-ctx-danger:hover {
  background: color-mix(in srgb, var(--error) 10%, transparent);
}

.bp-ctx-add-menu .bp-ctx-item:active,
.bp-ctx-node-menu .bp-ctx-item:active {
  transform: scale(0.98);
}

/* ── Side Drawer ────────────────────────────── */
.bp-side-drawer {
  width: 260px;
  min-width: 260px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border-base);
  background: var(--glass-base);
  backdrop-filter: blur(32px) saturate(1.6);
  -webkit-backdrop-filter: blur(32px) saturate(1.6);
  overflow: hidden;
}

.bp-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 10px;
  border-bottom: 1px solid var(--border-base);
}

.bp-drawer-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.bp-drawer-actions {
  display: flex;
  gap: 6px;
}

.bp-drawer-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid var(--border-base);
  border-radius: 6px;
  background: var(--glass-weak);
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.bp-drawer-action-btn:hover {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

.bp-drawer-tools {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border-base);
}

.bp-drawer-search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border: 1px solid var(--border-base);
  border-radius: 6px;
  background: var(--glass-weak);
  color: var(--text-secondary);
}

.bp-drawer-search input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 12px;
  outline: none;
  font-family: inherit;
}

.bp-drawer-search input::placeholder {
  color: var(--text-secondary);
  opacity: 0.6;
}

.bp-drawer-sort {
  width: 32px;
  padding: 4px;
  border: 1px solid var(--border-base);
  border-radius: 6px;
  background: var(--glass-weak);
  color: var(--text-secondary);
  font-size: 11px;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  text-indent: -9999px;
}

.bp-drawer-sort:hover {
  border-color: var(--accent);
}

.bp-drawer-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bp-drawer-empty {
  padding: 24px 12px;
  text-align: center;
  font-size: 12px;
  color: var(--text-secondary);
}

.bp-drawer-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--text-primary);
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition: background 0.12s, color 0.12s;
}

.bp-drawer-item:hover {
  background: color-mix(in srgb, var(--accent) 8%, transparent);
  border-color: var(--border-base);
}

.bp-drawer-item-active {
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  border-color: color-mix(in srgb, var(--accent) 40%, transparent);
  position: relative;
}

.bp-drawer-item-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: 3px;
  border-radius: 2px;
  background: var(--accent);
}

.bp-drawer-item svg {
  flex-shrink: 0;
  color: var(--text-secondary);
}

.bp-drawer-item-active svg {
  color: var(--accent);
}

.bp-drawer-item-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

.bp-drawer-item-count {
  font-size: 11px;
  color: var(--text-secondary);
  background: var(--glass-weak);
  padding: 1px 6px;
  border-radius: 10px;
  font-variant-numeric: tabular-nums;
}

.bp-toolbar-active {
  background: color-mix(in srgb, var(--accent) 18%, transparent) !important;
  color: var(--accent) !important;
}

/* ── Multi-select Batch Bar ─────────────────── */
.bp-batch-bar {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--glass-bg);
  -webkit-backdrop-filter: blur(32px) saturate(1.6);
  backdrop-filter: blur(32px) saturate(1.6);
  border: 1px solid var(--border-base);
  border-radius: 12px;
  z-index: 50;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}

.bp-batch-count {
  font-size: 12px;
  color: var(--text-secondary);
  margin-right: 4px;
}

.bp-batch-btn {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background: var(--glass-weak);
  border: 1px solid var(--border-base);
  color: var(--text-primary);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.bp-batch-btn:hover {
  background: var(--glass-base);
}

.bp-batch-btn:active {
  transform: scale(0.96);
}

.bp-batch-danger {
  color: var(--error);
  border-color: color-mix(in srgb, var(--error) 40%, transparent);
}

.bp-batch-danger:hover {
  background: color-mix(in srgb, var(--error) 12%, transparent);
}
</style>
