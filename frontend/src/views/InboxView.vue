<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { HxButton, HxCard, HxEmpty, HxModal, HxSpinner, HxTextarea, HxBadge } from '@/components/ui'
import { agentJson, agentPost } from '@/api'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

// ═══════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════

interface ApprovalContext {
  command?: string
  params?: Record<string, unknown>
  risk_level?: 'low' | 'medium' | 'high' | 'critical'
  node_id?: string
}

interface InboxItem {
  id: string
  type: 'approval' | 'proposal' | 'notification'
  title: string
  content: string
  status: 'pending' | 'approved' | 'rejected' | 'read'
  blueprint_id?: string
  run_id?: string
  context?: ApprovalContext
  created_at: string
  resolved_at?: string
}

type FilterTab = 'all' | 'approval' | 'proposal' | 'notification'

// ═══════════════════════════════════════════════════════════
// Reactive State
// ═══════════════════════════════════════════════════════════

const items = ref<InboxItem[]>([])
const loading = ref(false)
const polling = ref(false)
const filter = ref<FilterTab>('all')
const detailItem = ref<InboxItem | null>(null)
const detailModal = ref(false)
const replyText = ref('')
const replyItemId = ref('')
const replyExpanded = ref<Record<string, boolean>>({})

// Polling
const POLL_INTERVAL = 5000
let pollTimer: ReturnType<typeof setInterval> | null = null

// Pending count for sidebar badge
const inboxPendingCount = computed(() =>
  items.value.filter(i => i.status === 'pending').length
)

// ═══════════════════════════════════════════════════════════
// Computed
// ═══════════════════════════════════════════════════════════

const filtered = computed(() => {
  if (filter.value === 'all') return items.value
  return items.value.filter(i => i.type === filter.value)
})

const pendingByType = computed(() => ({
  approval: items.value.filter(i => i.type === 'approval' && i.status === 'pending').length,
  proposal: items.value.filter(i => i.type === 'proposal' && i.status === 'pending').length,
  notification: items.value.filter(i => i.type === 'notification' && i.status === 'pending').length,
}))

const filterTabs = computed(() => [
  { key: 'all' as FilterTab, label: t('common.all'), count: items.value.filter(i => i.status === 'pending').length },
  { key: 'approval' as FilterTab, label: t('inbox.types.approval'), count: pendingByType.value.approval },
  { key: 'proposal' as FilterTab, label: t('inbox.types.proposal'), count: pendingByType.value.proposal },
  { key: 'notification' as FilterTab, label: t('inbox.types.notification'), count: pendingByType.value.notification },
])

// ═══════════════════════════════════════════════════════════
// API
// ═══════════════════════════════════════════════════════════

async function fetchInbox() {
  try {
    const data = await agentJson('/v1/agent/inbox') as any
    const newItems: InboxItem[] = Array.isArray(data) ? data : (data?.items || data?.data || [])
    // Backfill missing type/context for older items
    for (const item of newItems) {
      if (!item.type) {
        const c = (item.content || '').toLowerCase()
        const t = (item.title || '').toLowerCase()
        if (c.includes('approve') || c.includes('批准') || t.includes('approve') || t.includes('批准')) {
          item.type = 'approval'
        } else if (c.includes('deploy') || c.includes('部署') || c.includes('完成') || t.includes('deploy')) {
          item.type = 'notification'
        } else {
          item.type = 'approval'
        }
      }
      if (!item.context) item.context = {}
    }
    // Mark new items for spring animation
    const prevIds = new Set(items.value.map(i => i.id))
    for (const item of newItems) {
      if (!prevIds.has(item.id)) {
        ;(item as any)._new = true
      }
    }
    items.value = newItems
  } catch {
    items.value = []
  }
}

async function loadInbox() {
  loading.value = true
  await fetchInbox()
  loading.value = false
}

async function pollInbox() {
  polling.value = true
  await fetchInbox()
  polling.value = false
}

async function approve(id: string) {
  try {
    await agentPost(`/v1/agent/inbox/${id}/approve`, {})
    const item = items.value.find(i => i.id === id)
    if (item) item.status = 'approved'
  } catch (e) {
    console.error('Approve failed:', e)
  }
}

async function reject(id: string) {
  try {
    await agentPost(`/v1/agent/inbox/${id}/reject`, {})
    const item = items.value.find(i => i.id === id)
    if (item) item.status = 'rejected'
  } catch (e) {
    console.error('Reject failed:', e)
  }
}

async function sendReply() {
  if (!replyText.value.trim() || !replyItemId.value) return
  try {
    await agentPost(`/v1/agent/inbox/${replyItemId.value}/reply`, { reply: replyText.value.trim() })
    const item = items.value.find(i => i.id === replyItemId.value)
    if (item) item.status = 'approved'
    replyText.value = ''
    replyItemId.value = ''
    if (replyExpanded.value[replyItemId.value]) {
      delete replyExpanded.value[replyItemId.value]
    }
  } catch (e) {
    console.error('Reply failed:', e)
  }
}

async function markRead(id: string) {
  try {
    await agentPost(`/v1/agent/inbox/${id}/read`, {})
    const item = items.value.find(i => i.id === id)
    if (item) item.status = 'read'
  } catch (e) {
    console.error('Mark read failed:', e)
  }
}

function openDetail(item: InboxItem) {
  detailItem.value = item
  detailModal.value = true
}

function toggleReply(id: string) {
  replyExpanded.value = { ...replyExpanded.value, [id]: !replyExpanded.value[id] }
  if (replyExpanded.value[id]) {
    replyItemId.value = id
    replyText.value = ''
  }
}

/* REMOVED: function navigateToBlueprint(blueprintId: string) {
  router.push(`/blueprints?id=${blueprintId}`)
} */

// ═══════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════

function timeAgo(dateStr: string): string {
  if (!dateStr) return ''
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.max(0, now - then)
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return t('inbox.justNow')
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return t('inbox.minutesAgo', { n: minutes })
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return t('inbox.hoursAgo', { n: hours })
  const days = Math.floor(hours / 24)
  return t('inbox.daysAgo', { n: days })
}

function riskColor(level?: string): string {
  switch (level) {
    case 'critical': return 'var(--error)'
    case 'high': return 'var(--warning)'
    case 'medium': return 'var(--accent)'
    case 'low': return 'var(--success)'
    default: return 'var(--text-tertiary)'
  }
}

function riskLabel(level?: string): string {
  switch (level) {
    case 'critical': return t('inbox.risk.critical')
    case 'high': return t('inbox.risk.high')
    case 'medium': return t('inbox.risk.medium')
    case 'low': return t('inbox.risk.low')
    default: return t('inbox.risk.unknown')
  }
}

function statusClass(status: string): string {
  switch (status) {
    case 'pending': return 'status-pending'
    case 'approved': return 'status-approved'
    case 'rejected': return 'status-rejected'
    case 'read': return 'status-read'
    default: return 'status-read'
  }
}

// ═══════════════════════════════════════════════════════════
// Lifecycle — Polling
// ═══════════════════════════════════════════════════════════

onMounted(() => {
  loadInbox()
  pollTimer = setInterval(pollInbox, POLL_INTERVAL)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})

defineExpose({ inboxPendingCount })
</script>

<template>
  <div class="inbox-view" @contextmenu.prevent>
    <!-- ═══ Header ═══ -->
    <header class="inbox-header">
      <div class="inbox-title-row">
        <h1 class="inbox-title">{{ t('inbox.title') }}</h1>
        <div v-if="inboxPendingCount > 0" class="inbox-badge-wrap">
          <span class="inbox-badge">{{ inboxPendingCount }}</span>
        </div>
        <div class="poll-indicator" :class="{ active: polling }" :title="t('inbox.polling')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="inbox-filters">
        <button
          v-for="tab in filterTabs"
          :key="tab.key"
          :class="['filter-tab', { active: filter === tab.key }]"
          @click="filter = tab.key"
        >
          <span class="filter-label">{{ tab.label }}</span>
          <span v-if="tab.count > 0" class="filter-count">{{ tab.count }}</span>
        </button>
      </div>
    </header>

    <!-- ═══ Loading ═══ -->
    <div v-if="loading" class="inbox-loading">
      <HxSpinner size="md" :label="t('common.loading')" />
    </div>

    <!-- ═══ Empty State ═══ -->
    <div v-else-if="filtered.length === 0" class="inbox-empty">
      <div class="empty-illustration">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="12" y="20" width="56" height="44" rx="6" stroke="var(--text-tertiary)" stroke-width="1.5" fill="none" opacity="0.4"/>
          <path d="M12 32L40 48L68 32" stroke="var(--text-tertiary)" stroke-width="1.5" fill="none" opacity="0.3"/>
          <circle cx="56" cy="24" r="10" fill="var(--accent)" opacity="0.15"/>
          <circle cx="56" cy="24" r="4" fill="var(--accent)" opacity="0.5">
            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>
      <p class="empty-title">{{ filter === 'all' ? t('inbox.empty') : t('inbox.emptyFilter') }}</p>
      <p class="empty-hint">{{ t('inbox.emptyHint') }}</p>
    </div>

    <!-- ═══ Item List ═══ -->
    <div v-else class="inbox-list">
      <TransitionGroup name="inbox-item">
        <HxCard
          v-for="item in filtered"
          :key="item.id"
          class="inbox-card"
          :class="{ 'inbox-card--new': (item as any)._new }"
          @click="openDetail(item)"
        >
          <!-- Card Header: type icon + status badge -->
          <div class="inbox-card__header">
            <div class="inbox-card__type">
              <!-- Approval icon (hand) -->
              <svg v-if="item.type === 'approval'" class="type-icon type-icon--approval" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
                <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
                <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
                <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
              </svg>
              <!-- Proposal icon (lightbulb) -->
              <svg v-else-if="item.type === 'proposal'" class="type-icon type-icon--proposal" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18h6"/>
                <path d="M10 22h4"/>
                <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
              </svg>
              <!-- Notification icon (bell) -->
              <svg v-else class="type-icon type-icon--notification" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span class="type-label">{{ t(`inbox.types.${item.type}`) }}</span>
            </div>
            <span :class="['status-badge', statusClass(item.status)]">
              <span v-if="item.status === 'pending'" class="status-dot status-dot--pulse"></span>
              {{ t(`common.${item.status}`) }}
            </span>
          </div>

          <!-- Card Body -->
          <h3 class="inbox-card__title">{{ item.title }}</h3>
          <p class="inbox-card__content">{{ item.content }}</p>

          <!-- Risk Level (approvals with context) -->
          <div v-if="item.type === 'approval' && item.context?.risk_level" class="inbox-card__risk">
            <span class="risk-label">{{ t('inbox.riskLevel') }}:</span>
            <span class="risk-value" :style="{ color: riskColor(item.context.risk_level) }">
              {{ riskLabel(item.context.risk_level) }}
            </span>
          </div>

          <!-- Timestamp -->
          <div class="inbox-card__time">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {{ timeAgo(item.created_at) }}
          </div>

          <!-- Actions: Approval -->
          <div v-if="item.type === 'approval' && item.status === 'pending'" class="inbox-card__actions" @click.stop>
            <HxButton size="sm" variant="primary" @click="approve(item.id)">
              <template #icon>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </template>
              {{ t('inbox.approve') }}
            </HxButton>
            <HxButton size="sm" variant="danger" @click="reject(item.id)">
              <template #icon>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </template>
              {{ t('inbox.reject') }}
            </HxButton>
            <HxButton size="sm" variant="ghost" @click="openDetail(item)">
              <template #icon>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              </template>
              {{ t('inbox.details') }}
            </HxButton>
          </div>

          <!-- Actions: Proposal — Reply -->
          <div v-if="item.type === 'proposal' && item.status === 'pending'" class="inbox-card__actions" @click.stop>
            <HxButton size="sm" variant="ghost" @click="toggleReply(item.id)">
              <template #icon>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <polyline points="9 17 4 22 4 3 20 3 20 13"/>
                  <line x1="14" y1="12" x2="22" y2="12"/>
                  <polyline points="18 8 22 12 18 16"/>
                </svg>
              </template>
              {{ t('inbox.reply') }}
            </HxButton>
            <HxButton size="sm" variant="primary" @click="approve(item.id)">
              {{ t('inbox.accept') }}
            </HxButton>
            <HxButton size="sm" variant="danger" @click="reject(item.id)">
              {{ t('inbox.reject') }}
            </HxButton>
          </div>

          <!-- Reply Area (expandable) -->
          <Transition name="reply-slide">
            <div v-if="replyExpanded[item.id]" class="inbox-card__reply" @click.stop>
              <HxTextarea
                v-model="replyText"
                :placeholder="t('inbox.replyPlaceholder')"
                :rows="3"
              />
              <div class="reply-actions">
                <HxButton size="sm" variant="ghost" @click="toggleReply(item.id)">
                  {{ t('common.cancel') }}
                </HxButton>
                <HxButton
                  size="sm"
                  variant="primary"
                  :disabled="!replyText.trim()"
                  @click="replyItemId = item.id; sendReply()"
                >
                  {{ t('inbox.sendReply') }}
                </HxButton>
              </div>
            </div>
          </Transition>

          <!-- Actions: Notification — Mark Read -->
          <div v-if="item.type === 'notification' && item.status === 'pending'" class="inbox-card__actions" @click.stop>
            <HxButton size="sm" variant="ghost" @click="markRead(item.id)">
              {{ t('inbox.markRead') }}
            </HxButton>
          </div>
        </HxCard>
      </TransitionGroup>
    </div>

    <!-- ═══ Detail Modal ═══ -->
    <HxModal v-model="detailModal" :title="t('inbox.detailTitle')" size="lg">
      <div v-if="detailItem" class="detail-body">
        <!-- Status + Type -->
        <div class="detail-row">
          <span class="detail-label">{{ t('inbox.fieldStatus') }}</span>
          <span :class="['status-badge', statusClass(detailItem.status)]">
            <span v-if="detailItem.status === 'pending'" class="status-dot status-dot--pulse"></span>
            {{ t(`common.${detailItem.status}`) }}
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('inbox.fieldType') }}</span>
          <span class="detail-value">{{ t(`inbox.types.${detailItem.type}`) }}</span>
        </div>

        <!-- Title -->
        <div class="detail-section">
          <span class="detail-label">{{ t('inbox.fieldTitle') }}</span>
          <p class="detail-title-text">{{ detailItem.title }}</p>
        </div>

        <!-- Content -->
        <div class="detail-section">
          <span class="detail-label">{{ t('inbox.fieldContent') }}</span>
          <p class="detail-content-text">{{ detailItem.content }}</p>
        </div>

        <!-- Approval Context -->
        <template v-if="detailItem.type === 'approval' && detailItem.context">
          <div class="detail-divider"></div>
          <h4 class="detail-subtitle">{{ t('inbox.approvalContext') }}</h4>
          <div v-if="detailItem.context.command" class="detail-row">
            <span class="detail-label">{{ t('inbox.fieldCommand') }}</span>
            <code class="detail-code">{{ detailItem.context.command }}</code>
          </div>
          <div v-if="detailItem.context.risk_level" class="detail-row">
            <span class="detail-label">{{ t('inbox.riskLevel') }}</span>
            <span class="risk-value" :style="{ color: riskColor(detailItem.context.risk_level) }">
              {{ riskLabel(detailItem.context.risk_level) }}
            </span>
          </div>
          <div v-if="detailItem.context.params && Object.keys(detailItem.context.params).length" class="detail-section">
            <span class="detail-label">{{ t('inbox.fieldParams') }}</span>
            <pre class="detail-params">{{ JSON.stringify(detailItem.context.params, null, 2) }}</pre>
          </div>
        </template>

        <!-- Timestamp -->
        <div class="detail-row">
          <span class="detail-label">{{ t('inbox.fieldTime') }}</span>
          <span class="detail-value">{{ new Date(detailItem.created_at).toLocaleString() }}</span>
        </div>
        <div v-if="detailItem.resolved_at" class="detail-row">
          <span class="detail-label">{{ t('inbox.fieldResolved') }}</span>
          <span class="detail-value">{{ new Date(detailItem.resolved_at).toLocaleString() }}</span>
        </div>
      </div>
      <template #footer>
        <template v-if="detailItem && detailItem.status === 'pending'">
          <HxButton variant="danger" @click="reject(detailItem!.id); detailModal = false">
            {{ t('inbox.reject') }}
          </HxButton>
          <HxButton v-if="detailItem.type === 'proposal'" variant="ghost" @click="detailModal = false; toggleReply(detailItem!.id)">
            {{ t('inbox.reply') }}
          </HxButton>
          <HxButton variant="primary" @click="approve(detailItem!.id); detailModal = false">
            {{ t('inbox.approve') }}
          </HxButton>
        </template>
        <HxButton v-else variant="ghost" @click="detailModal = false">{{ t('common.close') }}</HxButton>
      </template>
    </HxModal>
  </div>
</template>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   Inbox View — HiveWard Approval System
   ═══════════════════════════════════════════════════════════ */

.inbox-view {
  padding: var(--space-6);
  min-height: 100%;
}

/* ── Header ────────────────────────────────────────────── */

.inbox-header {
  margin-bottom: 16px;
}

.inbox-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.inbox-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.01em;
}

.inbox-badge-wrap {
  display: flex;
  align-items: center;
}

.inbox-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: var(--radius-full);
  background: var(--accent);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  animation: badge-pop 0.3s var(--ease-back);
}

@keyframes badge-pop {
  0% { transform: scale(0.6); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.poll-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--glass-bg);
  border: 1px solid var(--border-base);
  color: var(--text-tertiary);
  transition: background var(--fast), color var(--fast);
}

.poll-indicator.active {
  color: var(--accent);
  animation: spin var(--duration-700) linear infinite;
}

/* ── Filter Tabs ───────────────────────────────────────── */

.inbox-filters {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--border-base);
  margin-bottom: var(--space-5);
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-family);
  color: var(--text-tertiary);
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
  user-select: none;
}

.filter-tab:hover {
  color: var(--text-primary);
}

.filter-tab.active {
  color: var(--text-primary);
  border-bottom-color: var(--text-primary);
  font-weight: 600;
}

.filter-count {
  font-family: var(--font-mono);
  font-size: 10px;
  background: var(--glass-bg);
  color: var(--text-tertiary);
  padding: 1px 5px;
  border-radius: 3px;
}

.filter-tab.active .filter-count {
  background: var(--text-primary);
  color: var(--glass-bg);
}

/* ── Loading ───────────────────────────────────────────── */

.inbox-loading {
  display: flex;
  justify-content: center;
  padding: var(--space-16) 0;
}

/* ── Empty State ───────────────────────────────────────── */

.inbox-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16) var(--space-6);
  text-align: center;
}

.empty-illustration {
  margin-bottom: var(--space-6);
  opacity: 0.6;
  animation: float-gentle 4s var(--ease-sine) infinite;
}

@keyframes float-gentle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.empty-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
  margin: 0 0 var(--space-2);
}

.empty-hint {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  margin: 0;
}

/* ── Item List ─────────────────────────────────────────── */

.inbox-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

/* ── Card ──────────────────────────────────────────────── */

.inbox-card {
  cursor: pointer;
  padding: var(--space-4) var(--space-5) !important;
  transition: border-color var(--fast), box-shadow var(--fast);
}

.inbox-card:hover {
  border-color: var(--border-light);
  box-shadow: var(--glass-inset), var(--shadow-md);
}

.inbox-card--new {
  animation: card-enter 0.4s var(--ease-back);
}

@keyframes card-enter {
  0% {
    opacity: 0;
    transform: translateY(12px) scale(0.97);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* TransitionGroup animations */
.inbox-item-enter-active {
  animation: card-enter 0.4s var(--ease-back);
}
.inbox-item-leave-active {
  transition: opacity var(--duration-250) var(--ease-expo), transform var(--duration-250) var(--ease-expo);
}
.inbox-item-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
.inbox-item-move {
  transition: transform var(--duration-300) var(--ease-expo);
}

/* ── Card Header ───────────────────────────────────────── */

.inbox-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.inbox-card__type {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.type-icon {
  flex-shrink: 0;
}

.type-icon--approval {
  color: var(--warning);
}

.type-icon--proposal {
  color: var(--secondary);
}

.type-icon--notification {
  color: var(--accent);
}

.type-label {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* ── Status Badge ──────────────────────────────────────── */

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  line-height: 1;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-pending {
  background: color-mix(in srgb, var(--warning) 12%, transparent);
  color: var(--warning);
}

.status-pending .status-dot {
  background: var(--warning);
}

.status-dot--pulse {
  animation: pulse-dot 2s var(--ease-sine) infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.7); }
}

.status-approved {
  background: color-mix(in srgb, var(--success) 12%, transparent);
  color: var(--success);
}

.status-approved .status-dot {
  background: var(--success);
}

.status-rejected {
  background: color-mix(in srgb, var(--error) 12%, transparent);
  color: var(--error);
}

.status-rejected .status-dot {
  background: var(--error);
}

.status-read {
  background: var(--glass-bg);
  color: var(--text-tertiary);
}

/* ── Card Body ─────────────────────────────────────────── */

.inbox-card__title {
  font-size: 18px;
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-1);
  line-height: var(--leading-tight);
}

.inbox-card__content {
  font-size: var(--text-base);
  color: var(--text-secondary);
  margin: 0;
  line-height: var(--leading-relaxed);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Risk Level ────────────────────────────────────────── */

.inbox-card__risk {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: var(--space-2);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  background: var(--glass-bg);
  font-size: var(--text-xs);
}

.risk-label {
  color: var(--text-tertiary);
}

.risk-value {
  font-weight: var(--font-semibold);
  font-size: var(--text-xs);
}

/* ── References ────────────────────────────────────────── */

.inbox-card__refs {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.ref-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--glass-bg);
  color: var(--accent);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: background var(--fast);
}

.ref-link:hover {
  background: var(--accent-light);
}

.ref-link--static {
  cursor: default;
  color: var(--text-tertiary);
}

.ref-link--static:hover {
  background: var(--glass-bg);
}

/* ── Timestamp ─────────────────────────────────────────── */

.inbox-card__time {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: var(--space-2);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

/* ── Card Actions ──────────────────────────────────────── */

.inbox-card__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-base);
}

/* ── Reply Area ────────────────────────────────────────── */

.inbox-card__reply {
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-base);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
}

.reply-slide-enter-active {
  animation: reply-in 0.25s var(--ease-back);
}
.reply-slide-leave-active {
  animation: reply-in 0.15s var(--ease-expo) reverse;
}

@keyframes reply-in {
  0% { opacity: 0; transform: translateY(-8px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* ═══════════════════════════════════════════════════════════
   Detail Modal
   ═══════════════════════════════════════════════════════════ */

.detail-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.detail-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.detail-label {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  min-width: 80px;
  flex-shrink: 0;
}

.detail-value {
  font-size: var(--text-sm);
  color: var(--text-primary);
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.detail-title-text {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  line-height: var(--leading-tight);
}

.detail-content-text {
  font-size: var(--text-base);
  color: var(--text-secondary);
  margin: 0;
  line-height: var(--leading-relaxed);
  white-space: pre-wrap;
  word-break: break-word;
}

.detail-divider {
  height: 1px;
  background: var(--border-base);
  margin: var(--space-2) 0;
}

.detail-subtitle {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0;
}

.detail-code {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  background: var(--glass-bg);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-sm);
  padding: 4px 10px;
  color: var(--accent);
  overflow-x: auto;
  max-width: 100%;
}

.detail-params {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  background: var(--glass-bg);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  color: var(--text-secondary);
  margin: 0;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
}

.detail-refs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
</style>
