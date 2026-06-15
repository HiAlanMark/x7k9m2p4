<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
/* REMOVED: import { useBlueprintStore } from '@/stores/blueprint' */
import { HxButton, HxCard, HxEmpty, HxSelect } from '@/components/ui'
import { agentFetch, agentJson } from '@/api'

const { t } = useI18n()
/* REMOVED: const bpStore = useBlueprintStore() */

interface NodeRun {
  id: string
  node_id: string
  node_label: string
  node_type: string
  status: string
  input?: any
  output?: any
  error?: string
  usage?: { prompt_tokens: number; completion_tokens: number }
  started_at?: string
  finished_at?: string
}

interface RunEvent {
  kind: string
  timestamp: string
  node_id?: string
  message?: string
}

interface RunRecord {
  id: string
  blueprint_id: string
  blueprint_name?: string
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled' | 'waiting_approval'
  started_at: string
  finished_at?: string
  duration_ms?: number
  node_runs?: NodeRun[]
  node_statuses?: Record<string, string>
  events?: RunEvent[]
  error?: string
  total_input_tokens?: number
  total_output_tokens?: number
  total_cost_usd?: number
  final_result?: any
}

const runs = ref<RunRecord[]>([])
const loading = ref(false)
const expandedRun = ref<string | null>(null)
/* REMOVED: const filterBlueprint = ref('') */
const filterStatus = ref('')
const filterFrom = ref('')
const filterTo = ref('')

// Auto-refresh for running items
let pollTimer: ReturnType<typeof setInterval> | null = null

const filtered = computed(() => {
  let list = [...runs.value]
  if (filterBlueprint.value) {
    // Blueprint filter removed
  }
  if (filterStatus.value) {
    list = list.filter(r => r.status === filterStatus.value)
  }
  if (filterFrom.value) {
    list = list.filter(r => r.started_at >= filterFrom.value)
  }
  if (filterTo.value) {
    list = list.filter(r => r.started_at <= filterTo.value + 'T23:59:59')
  }
  return list.sort((a, b) => b.started_at.localeCompare(a.started_at))
})

const runningCount = computed(() => runs.value.filter(r => r.status === 'running' || r.status === 'queued').length)

async function fetchRuns() {
  loading.value = true
  try {
    const data = await agentJson('/v1/agent/runs')
    runs.value = Array.isArray(data) ? data : (data?.runs || data?.data || [])
    // Enrich with blueprint names
    // Blueprint fetch removed
    for (const run of runs.value) {
// Blueprint enrichment removed
    }
  } catch { runs.value = [] }
  finally { loading.value = false }
}

function toggleExpand(id: string) {
  expandedRun.value = expandedRun.value === id ? null : id
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    running: 'status-running', queued: 'status-queued', succeeded: 'status-succeeded',
    failed: 'status-failed', cancelled: 'status-cancelled', waiting_approval: 'status-waiting'
  }
  return map[status] || 'status-queued'
}

function nodeStatusClass(status: string) {
  const map: Record<string, string> = {
    pending: 'ns-pending', running: 'ns-running', succeeded: 'ns-succeeded',
    failed: 'ns-failed', skipped: 'ns-skipped'
  }
  return map[status] || 'ns-pending'
}

function timeAgo(dateStr: string) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return t('history.justNow')
  if (mins < 60) return t('history.minutesAgo', { n: mins })
  const hours = Math.floor(mins / 60)
  if (hours < 24) return t('history.hoursAgo', { n: hours })
  const days = Math.floor(hours / 24)
  return t('history.daysAgo', { n: days })
}

function duration(start: string, end?: string) {
  if (!start) return '-'
  const ms = (end ? new Date(end) : new Date()).getTime() - new Date(start).getTime()
  const s = Math.floor(ms / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  return `${m}m ${s % 60}s`
}

function formatTime(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString()
}

const expandedIO = ref<Record<string, boolean>>({})
const showEvents = ref<Record<string, boolean>>({})

function toggleIO(key: string) {
  expandedIO.value[key] = !expandedIO.value[key]
}

function toggleEvents(runId: string) {
  showEvents.value[runId] = !showEvents.value[runId]
}

function truncateStr(val: any, max = 200): string {
  if (val === undefined || val === null) return ''
  const s = typeof val === 'string' ? val : JSON.stringify(val, null, 2)
  return s.length > max ? s.slice(0, max) + '…' : s
}

function fullStr(val: any): string {
  if (val === undefined || val === null) return ''
  return typeof val === 'string' ? val : JSON.stringify(val, null, 2)
}

function nodeRunDuration(nr: NodeRun): string {
  if (!nr.started_at) return '-'
  return duration(nr.started_at, nr.finished_at)
}

function nodeTokenSummary(nr: NodeRun): string {
  if (!nr.usage) return ''
  const u = nr.usage
  return `${t('history.nodeTokens')}: ↑${u.prompt_tokens.toLocaleString()} ↓${u.completion_tokens.toLocaleString()}`
}

const statusOptions = computed(() => [
  { value: '', label: t('common.all') },
  { value: 'running', label: t('history.status.running') },
  { value: 'succeeded', label: t('history.status.succeeded') },
  { value: 'failed', label: t('history.status.failed') },
  { value: 'cancelled', label: t('history.status.cancelled') },
])

const blueprintOptions = computed(() => {
  const opts = [{ value: '', label: t('history.allBlueprints') }]
  for (const bp of bpStore.blueprints) {
    opts.push({ value: bp.id, label: bp.name })
  }
  return opts
})

onMounted(() => {
  fetchRuns()
  pollTimer = setInterval(() => {
    if (runs.value.some(r => r.status === 'running' || r.status === 'queued')) {
      fetchRuns()
    }
  }, 3000)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})

defineExpose({ runningCount })
</script>

<template>
  <div class="history-view">
    <!-- Header -->
    <div class="history-header">
      <h2 class="history-title">{{ t('history.title') }}</h2>
      <div v-if="runningCount > 0" class="running-badge">
        <span class="pulse-dot"></span>
        {{ runningCount }} {{ t('history.status.running') }}
      </div>
    </div>

    <!-- Filters -->
    <div class="history-filters">
      <!-- REMOVED BLUEPRINT FILTER -->
<HxSelect v-model="filterBlueprint" :options="blueprintOptions" class="filter-select" />
<!-- END REMOVED BLUEPRINT FILTER -->
      <HxSelect v-model="filterStatus" :options="statusOptions" class="filter-select" />
      <input v-model="filterFrom" type="date" class="filter-date" :placeholder="t('history.from')" />
      <input v-model="filterTo" type="date" class="filter-date" :placeholder="t('history.to')" />
      <HxButton v-if="filterBlueprint || filterStatus || filterFrom || filterTo" variant="ghost" size="sm" @click="filterBlueprint='';filterStatus='';filterFrom='';filterTo=''">
        {{ t('history.clearFilters') }}
      </HxButton>
      <HxButton variant="ghost" size="sm" :loading="loading" @click="fetchRuns">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
      </HxButton>
    </div>

    <!-- Empty State -->
    <HxEmpty v-if="filtered.length === 0 && !loading" :title="runs.length === 0 ? t('history.empty') : t('history.noMatch')" :description="t('history.emptyHint')" />

    <!-- Run Cards -->
    <div class="history-list">
      <div v-for="run in filtered" :key="run.id" class="run-card" :class="{ expanded: expandedRun === run.id }">
        <div class="run-card-main" @click="toggleExpand(run.id)">
          <div class="run-status-indicator" :class="statusClass(run.status)"></div>
          <div class="run-info">
            <div class="run-name">{{ run.blueprint_name || run.blueprint_id.slice(0, 8) }}</div>
            <div class="run-meta">
              <span class="run-status-text" :class="statusClass(run.status)">{{ t('history.status.' + run.status) || run.status }}</span>
              <span class="run-time">{{ timeAgo(run.started_at) }}</span>
            </div>
          </div>
          <div class="run-right">
            <span class="run-duration">{{ duration(run.started_at, run.finished_at) }}</span>
            <svg class="run-chevron" :class="{ open: expandedRun === run.id }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>

        <!-- Expanded Detail -->
        <div v-if="expandedRun === run.id" class="run-detail">
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">{{ t('history.startedAt') }}</span>
              <span class="detail-value">{{ formatTime(run.started_at) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ t('history.finishedAt') }}</span>
              <span class="detail-value">{{ run.finished_at ? formatTime(run.finished_at) : '-' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ t('history.duration') }}</span>
              <span class="detail-value">{{ duration(run.started_at, run.finished_at) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ t('history.inputTokens') }}</span>
              <span class="detail-value">{{ (run.total_input_tokens || 0).toLocaleString() }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ t('history.outputTokens') }}</span>
              <span class="detail-value">{{ (run.total_output_tokens || 0).toLocaleString() }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ t('history.cost') }}</span>
              <span class="detail-value">${{ (run.total_cost_usd || 0).toFixed(4) }}</span>
            </div>
          </div>

          <!-- Node Runs (rich) -->
          <div v-if="run.node_runs && run.node_runs.length > 0" class="node-runs-section">
            <h4 class="timeline-title">{{ t('history.nodeTimeline') }}</h4>
            <div class="node-runs-list">
              <div v-for="nr in run.node_runs" :key="nr.id" class="node-run-card">
                <div class="node-run-header">
                  <span class="node-run-label">{{ nr.node_label || nr.node_id.slice(0, 8) }}</span>
                  <span class="node-run-type-badge">{{ nr.node_type }}</span>
                  <span class="timeline-node-status" :class="nodeStatusClass(nr.status)">{{ t('history.nodeStatus.' + nr.status) || nr.status }}</span>
                  <span class="node-run-duration">{{ t('history.nodeDuration') }}: {{ nodeRunDuration(nr) }}</span>
                  <span v-if="nr.usage" class="token-summary">{{ nodeTokenSummary(nr) }}</span>
                </div>
                <!-- Input -->
                <div v-if="nr.input !== undefined && nr.input !== null" class="node-run-io">
                  <div class="io-header">
                    <span class="io-label">{{ t('history.nodeInput') }}</span>
                    <button class="io-toggle" @click="toggleIO(nr.id + '-input')">
                      {{ expandedIO[nr.id + '-input'] ? t('history.hideDetails') : t('history.showInput') }}
                    </button>
                  </div>
                  <pre v-if="expandedIO[nr.id + '-input']" class="io-content">{{ fullStr(nr.input) }}</pre>
                  <pre v-else class="io-content io-truncated">{{ truncateStr(nr.input) }}</pre>
                </div>
                <!-- Output -->
                <div v-if="nr.output !== undefined && nr.output !== null" class="node-run-io">
                  <div class="io-header">
                    <span class="io-label">{{ t('history.nodeOutput') }}</span>
                    <button class="io-toggle" @click="toggleIO(nr.id + '-output')">
                      {{ expandedIO[nr.id + '-output'] ? t('history.hideDetails') : t('history.showOutput') }}
                    </button>
                  </div>
                  <pre v-if="expandedIO[nr.id + '-output']" class="io-content">{{ fullStr(nr.output) }}</pre>
                  <pre v-else class="io-content io-truncated">{{ truncateStr(nr.output) }}</pre>
                </div>
                <!-- Node Error -->
                <div v-if="nr.error" class="run-error node-run-error">
                  <pre class="error-content">{{ nr.error }}</pre>
                </div>
              </div>
            </div>
          </div>

          <!-- Fallback: simple node_statuses timeline when node_runs not available -->
          <div v-else-if="run.node_statuses && Object.keys(run.node_statuses).length > 0" class="node-timeline">
            <h4 class="timeline-title">{{ t('history.nodeTimeline') }}</h4>
            <div class="timeline-list">
              <div v-for="(status, nodeId) in run.node_statuses" :key="nodeId" class="timeline-item">
                <div class="timeline-dot" :class="nodeStatusClass(status)"></div>
                <span class="timeline-node-id">{{ nodeId.slice(0, 8) }}</span>
                <span class="timeline-node-status" :class="nodeStatusClass(status)">{{ t('history.nodeStatus.' + status) || status }}</span>
              </div>
            </div>
          </div>
          <p v-else class="no-nodes">{{ t('history.noNodeRuns') }}</p>

          <!-- Events Timeline -->
          <div v-if="run.events && run.events.length > 0" class="events-section">
            <div class="events-header" @click="toggleEvents(run.id)">
              <h4 class="timeline-title">{{ t('history.eventsTitle') }}</h4>
              <svg class="run-chevron" :class="{ open: showEvents[run.id] }" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div v-if="showEvents[run.id]" class="events-list">
              <div v-for="(evt, idx) in run.events" :key="idx" class="event-item">
                <span class="event-time">{{ new Date(evt.timestamp).toLocaleTimeString() }}</span>
                <span class="event-kind">{{ evt.kind }}</span>
                <span v-if="evt.node_id" class="event-node">{{ evt.node_id.slice(0, 8) }}</span>
                <span v-if="evt.message" class="event-message">{{ evt.message }}</span>
              </div>
            </div>
          </div>

          <!-- Error -->
          <div v-if="run.error" class="run-error">
            <h4 class="error-title">{{ t('history.errorDetails') }}</h4>
            <pre class="error-content">{{ run.error }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.history-view {
  height: 100%;
  overflow-y: auto;
  padding: 24px 32px 32px;
  background: transparent;
}

.history-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.history-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.running-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--accent, #5ac8fa);
  font-size: 13px;
  font-weight: 500;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent, #5ac8fa);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.history-filters {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 14px;
  border-radius: 10px;
  background: var(--glass-base);
  border: 1px solid var(--border-base);
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  flex-wrap: wrap;
}

.filter-select {
  min-width: 140px;
}

.filter-date {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid var(--border-base);
  background: var(--glass-weak);
  color: var(--text-primary);
  font-size: 13px;
  font-family: 'Noto Sans SC', var(--font-sans), sans-serif;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.run-card {
  border-radius: 12px;
  background: var(--glass-base);
  border: 1px solid var(--border-base);
  backdrop-filter: blur(32px) saturate(1.6);
  -webkit-backdrop-filter: blur(32px) saturate(1.6);
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.run-card:hover {
  border-color: color-mix(in srgb, var(--accent) 20%, transparent);
  box-shadow: 0 0 20px color-mix(in srgb, var(--accent) 6%, transparent);
}

.run-card-main {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
}

.run-status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.run-status-indicator.status-running { background: var(--accent, #5ac8fa); animation: pulse 1.5s infinite; }
.run-status-indicator.status-queued { background: var(--text-secondary); }
.run-status-indicator.status-succeeded { background: var(--success); }
.run-status-indicator.status-failed { background: var(--error); }
.run-status-indicator.status-cancelled { background: var(--text-tertiary); }
.run-status-indicator.status-waiting { background: var(--warning); animation: pulse 2s infinite; }

.run-info {
  flex: 1;
  min-width: 0;
}

.run-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.run-meta {
  display: flex;
  gap: 10px;
  margin-top: 4px;
  font-size: 12px;
}

.run-status-text { font-weight: 500; }
.run-status-text.status-running { color: var(--accent, #5ac8fa); }
.run-status-text.status-succeeded { color: var(--success); }
.run-status-text.status-failed { color: var(--error); }
.run-status-text.status-cancelled { color: var(--text-tertiary); }
.run-status-text.status-waiting { color: var(--warning); }
.run-status-text.status-queued { color: var(--text-secondary); }

.run-time { color: var(--text-secondary); }

.run-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.run-duration {
  font-size: 13px;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.run-chevron {
  color: var(--text-secondary);
  transition: transform 0.2s;
}

.run-chevron.open {
  transform: rotate(180deg);
}

.run-detail {
  padding: 0 16px 16px;
  border-top: 1px solid var(--border-base);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 14px 0;
}

@media (min-width: 600px) {
  .detail-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 13px;
  color: var(--text-primary);
}

.node-timeline {
  margin-top: 8px;
}

.timeline-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 10px;
}

.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  background: var(--glass-base);
  backdrop-filter: blur(12px) saturate(1.3);
  -webkit-backdrop-filter: blur(12px) saturate(1.3);
}

.timeline-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.timeline-dot.ns-pending { background: var(--text-tertiary); }
.timeline-dot.ns-running { background: var(--accent, #5ac8fa); animation: pulse 1.5s infinite; }
.timeline-dot.ns-succeeded { background: var(--success); }
.timeline-dot.ns-failed { background: var(--error); }
.timeline-dot.ns-skipped { background: var(--text-disabled); }

.timeline-node-id {
  font-size: 12px;
  font-family: var(--font-mono, monospace);
  color: var(--text-secondary);
}

.timeline-node-status {
  font-size: 12px;
  font-weight: 500;
  margin-left: auto;
}

.timeline-node-status.ns-pending { color: var(--text-tertiary); }
.timeline-node-status.ns-running { color: var(--accent, #5ac8fa); }
.timeline-node-status.ns-succeeded { color: var(--success); }
.timeline-node-status.ns-failed { color: var(--error); }
.timeline-node-status.ns-skipped { color: var(--text-disabled); }

.no-nodes {
  font-size: 13px;
  color: var(--text-secondary);
  text-align: center;
  padding: 12px 0;
  margin: 0;
}

.run-error {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--error) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--error) 20%, transparent);
}

.error-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--error);
  margin: 0 0 6px;
}

.error-content {
  font-size: 12px;
  color: var(--error);
  font-family: var(--font-mono, monospace);
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
}

/* ── Node Run Cards ── */
.node-runs-section {
  margin-top: 8px;
}

.node-runs-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.node-run-card {
  border-radius: 8px;
  background: var(--glass-base);
  border: 1px solid var(--border-base);
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  padding: 10px 12px;
}

.node-run-header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.node-run-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.node-run-type-badge {
  font-size: 11px;
  padding: 1px 8px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--accent, #5ac8fa);
  font-weight: 500;
}

.node-run-duration {
  font-size: 12px;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.token-summary {
  font-size: 11px;
  color: var(--text-secondary);
  font-family: var(--font-mono, monospace);
  margin-left: auto;
}

/* ── Node I/O ── */
.node-run-io {
  margin-top: 8px;
}

.io-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.io-label {
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.io-toggle {
  font-size: 11px;
  color: var(--accent, #5ac8fa);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.io-toggle:hover {
  text-decoration: underline;
}

.io-content {
  font-size: 11px;
  font-family: var(--font-mono, monospace);
  color: var(--text-primary);
  background: color-mix(in srgb, var(--bg-elevated) 80%, transparent);
  border: 1px solid var(--border-base);
  border-radius: 6px;
  padding: 8px 10px;
  margin: 6px 0 0;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 320px;
  overflow-y: auto;
}

.io-truncated {
  max-height: 80px;
  overflow: hidden;
}

.node-run-error {
  margin-top: 6px;
}

.node-run-error .error-content {
  margin: 0;
}

/* ── Events Timeline ── */
.events-section {
  margin-top: 12px;
}

.events-header {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 8px;
}

.event-item {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 12px;
  background: var(--glass-base);
  backdrop-filter: blur(12px) saturate(1.3);
  -webkit-backdrop-filter: blur(12px) saturate(1.3);
}

.event-time {
  color: var(--text-secondary);
  font-family: var(--font-mono, monospace);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

.event-kind {
  font-weight: 600;
  color: var(--accent, #5ac8fa);
  flex-shrink: 0;
  min-width: 60px;
}

.event-node {
  color: var(--text-secondary);
  font-family: monospace;
  flex-shrink: 0;
}

.event-message {
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

/* ── Scrollbar ── */
.history-view::-webkit-scrollbar {
  width: 6px;
}
.history-view::-webkit-scrollbar-track {
  background: transparent;
}
.history-view::-webkit-scrollbar-thumb {
  background: var(--border-base);
  border-radius: 3px;
}
.history-view::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}
</style>
