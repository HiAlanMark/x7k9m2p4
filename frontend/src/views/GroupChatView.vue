<template>
  <div class="gc-view">
    <!-- Left: Group List -->
    <aside class="gc-sidebar">
      <div class="gc-sidebar-header">
        <span class="gc-sidebar-title">{{ t('groupChat.title') }}</span>
        <button class="gc-create-btn" @click="showCreateModal = true" :title="t('groupChat.createGroup')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>
      <div class="gc-group-list">
        <div
          v-for="g in store.groups"
          :key="g.id"
          class="gc-group-item"
          :class="{ active: g.id === store.activeGroupId }"
          @click="selectGroup(g.id)"
        >
          <div class="gc-group-name">{{ g.name }}</div>
          <div class="gc-group-meta">{{ g.agentCount }} agent</div>
        </div>
        <HxEmpty v-if="store.groups.length === 0" :description="t('groupChat.noGroups')" />
      </div>
    </aside>

    <!-- Right: Chat Area -->
    <main class="gc-main">
      <template v-if="store.activeGroup">
        <!-- Header -->
        <div class="gc-header">
          <span class="gc-header-name">{{ store.activeGroup.name }}</span>
          <button class="gc-icon-btn gc-delete-btn" @click="onDeleteGroup" :title="t('groupChat.deleteGroup')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>

        <!-- Messages -->
        <div class="gc-messages" ref="messagesRef">
          <div v-for="msg in store.messages" :key="msg.id" class="gc-msg" :class="{ human: !msg.agentId, agent: !!msg.agentId }">
            <div class="gc-msg-body">
              <div class="gc-msg-sender">
                <span v-if="msg.agentId" class="gc-agent-badge" :style="{ background: agentColor(msg.agentId), color: '#fff' }">{{ agentName(msg.agentId) }}</span>
                <span v-else class="gc-human-badge">{{ t('groupChat.you') }}</span>
                <span class="gc-msg-time">{{ formatTime(msg.timestamp) }}</span>
              </div>
              <div class="gc-msg-content" v-html="renderContent(msg.content)"></div>
            </div>
          </div>
          <HxEmpty v-if="store.messages.length === 0" :description="t('groupChat.noMessages')" />
        </div>

        <!-- Input -->
        <div class="gc-input-wrap">
          <HxTextarea
            ref="inputRef"
            v-model="inputText"
            :placeholder="t('groupChat.typePlaceholder')"
            :rows="1"
            @keydown.enter.exact.prevent="onSend"
          />
          <button class="gc-send-btn" @click="onSend" :disabled="!inputText.trim() || store.loading">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </template>
      <HxEmpty v-else :description="t('groupChat.selectOrCreate')" />
    </main>

    <!-- Create Group Modal -->
    <HxModal v-model:visible="showCreateModal" :title="t('groupChat.createGroup')" size="sm">
      <div class="gc-modal-body">
        <label class="gc-field">
          <span class="gc-field-label">{{ t('groupChat.groupName') }}</span>
          <HxInput v-model="newGroupName" :placeholder="t('groupChat.groupNamePlaceholder')" />
        </label>
        <div class="gc-field">
          <span class="gc-field-label">{{ t('groupChat.agent') }}</span>
          <div class="gc-agent-def">
            <HxInput v-model="newAgentName" :placeholder="t('groupChat.agentName')" style="flex:1" />
            <HxInput v-model="newAgentModel" :placeholder="t('groupChat.agentModel')" style="flex:1" />
            <HxInput v-model="newAgentProvider" placeholder="Provider" style="width:90px" />
          </div>
        </div>
      </div>
      <template #footer>
        <HxButton variant="ghost" @click="showCreateModal = false">{{ t('common.cancel') }}</HxButton>
        <HxButton @click="onCreateGroup" :loading="store.loading" :disabled="!newGroupName.trim()">{{ t('groupChat.createGroup') }}</HxButton>
      </template>
    </HxModal>

    <!-- Delete Confirm Modal -->
    <HxModal v-model:visible="showDeleteConfirm" :title="t('groupChat.deleteGroup')" size="sm">
      <p>{{ t('groupChat.deleteConfirm') }}</p>
      <template #footer>
        <HxButton variant="ghost" @click="showDeleteConfirm = false">{{ t('common.cancel') }}</HxButton>
        <HxButton variant="danger" @click="confirmDeleteGroup">{{ t('common.delete') }}</HxButton>
      </template>
    </HxModal>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGroupChatStore } from '@/stores/groupChat'
import { HxButton, HxInput, HxTextarea, HxModal, HxEmpty } from '@/components/ui'
import { useToast } from '@/composables/useToast'

const { t } = useI18n()
const store = useGroupChatStore()
const toast = useToast()

const messagesRef = ref<HTMLElement | null>(null)
const inputRef = ref<InstanceType<typeof HxTextarea> | null>(null)
const inputText = ref('')
const showCreateModal = ref(false)
const showDeleteConfirm = ref(false)

// Create group form
const newGroupName = ref('')
const newAgentName = ref('')
const newAgentModel = ref('')
const newAgentProvider = ref('')

function agentName(id: string): string {
  return store.agentMap.get(id)?.name ?? 'Agent'
}

function agentColor(id: string): string {
  return store.agentMap.get(id)?.color ?? '#5ac8fa'
}

function formatTime(ts: string): string {
  if (!ts) return ''
  const d = new Date(ts.replace(' ', 'T'))
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function renderContent(content: string): string {
  const escaped = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return escaped.replace(/@(\w+)/g, (_, name) => {
    const agent = store.agents.find(a => a.name === name)
    if (agent) {
      return `<span style="color:${agent.color};font-weight:600">@${name}</span>`
    }
    return `@${name}`
  })
}

async function selectGroup(id: string) {
  store.activeGroupId = id
  await store.fetchMessages(id)
  await nextTick()
  scrollBottom()
}

function scrollBottom() {
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

async function onSend() {
  const text = inputText.value.trim()
  if (!text || store.sending) return
  inputText.value = ''
  await store.sendMessage(text)
  await nextTick()
  scrollBottom()
}

async function onCreateGroup() {
  if (!newGroupName.value.trim() || !newAgentName.value.trim()) return
  const agent = {
    name: newAgentName.value.trim(),
    model: newAgentModel.value.trim() || 'glm-5.1',
    provider: newAgentProvider.value.trim() || 'custom',
  }
  const result = await store.createGroup(newGroupName.value.trim(), [agent])
  if (result) {
    showCreateModal.value = false
    newGroupName.value = ''
    newAgentName.value = ''
    newAgentModel.value = ''
    newAgentProvider.value = ''
    toast.success(t('groupChat.created'))
  } else {
    toast.error(store.error || t('groupChat.error'))
  }
}

function onDeleteGroup() {
  showDeleteConfirm.value = true
}

async function confirmDeleteGroup() {
  if (!store.activeGroupId) return
  const id = store.activeGroupId
  await store.deleteGroup(id)
  showDeleteConfirm.value = false
  toast.success(t('groupChat.deleted'))
}

// Init
onMounted(() => {
  store.fetchGroups()
})

watch(() => store.activeGroupId, async () => {
  if (store.activeGroupId) {
    await store.fetchMessages(store.activeGroupId)
    await nextTick()
    scrollBottom()
  }
})
</script>

<style scoped>
.gc-view {
  display: flex;
  height: 100%;
  overflow: hidden;
  background: var(--bg-base);
}

/* ─── Sidebar ─── */
.gc-sidebar {
  width: 240px;
  border-right: 1px solid var(--border-base);
  display: flex;
  flex-direction: column;
  background: var(--glass-bg);
}

.gc-sidebar-header {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-base);
}

.gc-sidebar-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.gc-create-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid var(--border-base);
  background: var(--glass-bg);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.gc-create-btn:hover {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.gc-group-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.gc-group-item {
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.gc-group-item:hover {
  background: var(--glass-hover);
}

.gc-group-item.active {
  background: var(--accent-alpha);
  color: var(--accent);
}

.gc-group-name {
  font-size: 13px;
  font-weight: 500;
}

.gc-group-meta {
  font-size: 11px;
  color: var(--text-tertiary);
  margin-top: 2px;
}

/* ─── Main ─── */
.gc-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.gc-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-base);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--glass-bg);
}

.gc-header-name {
  font-size: 14px;
  font-weight: 600;
}

.gc-header-actions {
  display: flex;
  gap: 4px;
}

.gc-icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.gc-icon-btn:hover {
  background: var(--glass-hover);
}

.gc-delete-btn:hover {
  background: rgba(235, 87, 87, 0.12);
  color: var(--error);
}

/* ─── Messages ─── */
.gc-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gc-msg {
  max-width: 80%;
}

.gc-msg.human {
  align-self: flex-end;
}

.gc-msg.agent {
  align-self: flex-start;
}

.gc-msg-body {
  padding: 10px 14px;
  border-radius: 12px;
  background: var(--glass-bg);
  border: 1px solid var(--border-base);
}

.gc-msg.human .gc-msg-body {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.gc-msg-sender {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 11px;
}

.gc-msg.human .gc-msg-sender {
  color: rgba(255,255,255,0.7);
}

.gc-agent-badge {
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.gc-human-badge {
  color: var(--accent);
  font-weight: 600;
}

.gc-msg-time {
  color: var(--text-tertiary);
  font-size: 10px;
}

.gc-msg-content {
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}

/* ─── Input ─── */
.gc-input-wrap {
  padding: 12px 16px;
  border-top: 1px solid var(--border-base);
  display: flex;
  gap: 8px;
  background: var(--glass-bg);
}

.gc-send-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: var(--primary);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s;
  flex-shrink: 0;
}

.gc-send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ─── Modal ─── */
.gc-modal-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gc-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.gc-field-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
}

.gc-agent-def {
  display: flex;
  gap: 8px;
}

/* ─── Agent Panel ─── */
.gc-agent-panel {
  padding: 12px;
  border-bottom: 1px solid var(--border-base);
  background: var(--glass-bg);
}

.gc-agent-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.gc-agent-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
}

.gc-agent-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.gc-agent-info {
  flex: 1;
  min-width: 0;
}

.gc-agent-name {
  font-size: 12px;
  font-weight: 500;
}

.gc-agent-model {
  font-size: 10px;
  color: var(--text-tertiary);
}

.gc-agent-remove {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: var(--text-tertiary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gc-agent-remove:hover {
  background: rgba(235, 87, 87, 0.12);
  color: var(--error);
}

.gc-add-agent-btn {
  margin-top: 8px;
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px dashed var(--border-base);
  background: transparent;
  color: var(--text-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.gc-add-agent-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}
</style>
