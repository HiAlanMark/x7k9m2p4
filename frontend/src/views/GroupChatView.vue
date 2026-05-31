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
          <div class="gc-group-meta">{{ g.agentCount }} {{ t('groupChat.agents') }}</div>
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
          <div class="gc-header-actions">
            <button class="gc-icon-btn" @click="showAgentPanel = !showAgentPanel" :title="t('groupChat.manageAgents')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </button>
            <button class="gc-icon-btn gc-delete-btn" @click="onDeleteGroup" :title="t('groupChat.deleteGroup')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div class="gc-messages" ref="messagesRef">
          <div v-for="msg in store.messages" :key="msg.id" class="gc-msg" :class="{ human: !msg.agentId, agent: !!msg.agentId }">
            <div v-if="msg.agentId" class="gc-msg-agent-bar" :style="{ background: agentColor(msg.agentId) }"></div>
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

        <!-- Agent Panel -->
        <div v-if="showAgentPanel" class="gc-agent-panel">
          <div class="gc-agent-panel-header">
            <span>{{ t('groupChat.agents') }}</span>
            <button class="gc-icon-btn" @click="showAgentPanel = false">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div v-for="a in store.agents" :key="a.id" class="gc-agent-item">
            <span class="gc-agent-color" :style="{ background: a.color }"></span>
            <div class="gc-agent-info">
              <span class="gc-agent-name">{{ a.name }}</span>
              <span class="gc-agent-model">{{ a.model }}<template v-if="a.provider"> · {{ a.provider }}</template></span>
            </div>
            <button class="gc-agent-remove" @click="onRemoveAgent(a.id)" :title="t('groupChat.removeAgent')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <button class="gc-add-agent-btn" @click="showAddAgentModal = true">{{ t('groupChat.addAgent') }}</button>
        </div>

        <!-- Input -->
        <div class="gc-input-area">
          <div class="gc-mention-hint" v-if="mentionHint.visible">
            <div
              v-for="a in mentionHint.filtered"
              :key="a.id"
              class="gc-mention-item"
              :class="{ active: mentionHint.index === mentionHint.filtered.indexOf(a) }"
              @mousedown.prevent="insertMention(a)"
            >
              <span class="gc-agent-color" :style="{ background: a.color }"></span>
              <span>{{ a.name }}</span>
            </div>
          </div>
          <div class="gc-input-row">
            <HxTextarea
              ref="inputRef"
              v-model="inputText"
              :placeholder="t('groupChat.typePlaceholder')"
              autoResize
              :maxHeight="120"
              inline
              variant="chat"
              @keydown="onInputKeydown"
            />
            <button class="gc-send-btn" @click="onSend" :disabled="!inputText.trim() || store.sending">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      </template>
      <div v-else class="gc-empty">
        <HxEmpty :description="t('groupChat.selectOrCreate')" />
      </div>
    </main>

    <!-- Create Group Modal -->
    <HxModal v-model:visible="showCreateModal" :title="t('groupChat.createGroup')" size="md">
      <div class="gc-modal-body">
        <label class="gc-field">
          <span class="gc-field-label">{{ t('groupChat.groupName') }}</span>
          <HxInput v-model="newGroupName" :placeholder="t('groupChat.groupNamePlaceholder')" />
        </label>
        <div class="gc-field">
          <span class="gc-field-label">{{ t('groupChat.agents') }}</span>
          
          <div v-for="(ad, i) in newAgents" :key="i" class="gc-agent-def">
            <div class="gc-agent-role-select">
              <button
                v-for="role in AGENT_ROLES"
                :key="role.id"
                class="gc-role-mini"
                :class="{ active: ad.name === role.name }"
                @click="ad.name = role.name; ad.system_prompt = role.systemPrompt; ad.color = role.color"
                :title="role.name"
              >
                {{ role.icon }}
              </button>
            </div>
            <div class="gc-agent-def-colors">
              <button
                v-for="c in AGENT_COLORS"
                :key="c"
                class="gc-color-dot"
                :class="{ selected: ad.color === c }"
                :style="{ background: c }"
                @click="ad.color = c"
              ></button>
            </div>
            <HxInput v-model="ad.name" :placeholder="t('groupChat.agentName')" style="flex:1" />
            <HxInput v-model="ad.model" :placeholder="t('groupChat.agentModel')" style="flex:1" />
            <button class="gc-agent-def-remove" @click="newAgents.splice(i, 1)" v-if="newAgents.length > 1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <button class="gc-add-agent-btn" @click="newAgents.push({ name: '', model: '', provider: '', system_prompt: '', color: AGENT_COLORS[newAgents.length % AGENT_COLORS.length] })">+ {{ t('groupChat.addAgent') }}</button>
        </div>
      </div>
      <template #footer>
        <HxButton variant="ghost" @click="showCreateModal = false">{{ t('common.cancel') }}</HxButton>
        <HxButton @click="onCreateGroup" :loading="store.loading" :disabled="!newGroupName.trim()">{{ t('groupChat.createGroup') }}</HxButton>
      </template>
    </HxModal>

    <!-- Add Agent Modal -->
    <HxModal v-model:visible="showAddAgentModal" :title="t('groupChat.addAgent')" size="md">
      <div class="gc-modal-body">
        <div class="gc-role-section">
          <h4 class="gc-section-title">选择角色模板:</h4>
          <div class="gc-role-grid">
            <div 
              v-for="role in AGENT_ROLES" 
              :key="role.id" 
              class="gc-role-card"
              :class="{ active: addAgentName === role.name }"
              @click="selectRoleForAdd(role)"
            >
              <div class="gc-role-icon">{{ role.icon }}</div>
              <div class="gc-role-name">{{ role.name }}</div>
            </div>
          </div>
        </div>
        
        <div class="gc-field-separator">自定义配置:</div>

        <label class="gc-field">
          <span class="gc-field-label">{{ t('groupChat.agentName') }}</span>
          <HxInput v-model="addAgentName" />
        </label>
        <label class="gc-field">
          <span class="gc-field-label">{{ t('groupChat.agentModel') }}</span>
          <HxInput v-model="addAgentModel" placeholder="留空则使用默认模型" />
        </label>
        <label class="gc-field">
          <span class="gc-field-label">{{ t('groupChat.systemPrompt') }}</span>
          <HxTextarea v-model="addAgentPrompt" :placeholder="t('groupChat.systemPromptPlaceholder')" autoResize :maxHeight="100" />
        </label>
        <div class="gc-field">
          <span class="gc-field-label">{{ t('groupChat.agentColor') }}</span>
          <div class="gc-agent-def-colors">
            <button v-for="c in AGENT_COLORS" :key="c" class="gc-color-dot" :class="{ selected: addAgentColor === c }" :style="{ background: c }" @click="addAgentColor = c"></button>
          </div>
        </div>
      </div>
      <template #footer>
        <HxButton variant="ghost" @click="showAddAgentModal = false">{{ t('common.cancel') }}</HxButton>
        <HxButton @click="onAddAgent" :disabled="!addAgentName.trim()">{{ t('groupChat.addAgent') }}</HxButton>
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
import { ref, reactive, computed, nextTick, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGroupChatStore } from '@/stores/groupChat'
import { AGENT_COLORS } from '@/types'
import { HxButton, HxInput, HxTextarea, HxModal, HxEmpty } from '@/components/ui'
import { useToast } from '@/composables/useToast'
import { marked } from 'marked'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import javascript from 'highlight.js/lib/languages/javascript'
import bash from 'highlight.js/lib/languages/bash'
import { AGENT_ROLES, type AgentRole } from '@/data/agent-roles'

const { t } = useI18n()
const store = useGroupChatStore()
const toast = useToast()

// Configure Highlight.js
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('bash', bash)

// Configure Marked with Highlight.js
marked.setOptions({
  highlight: function(code: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  }
})

const messagesRef = ref<HTMLElement | null>(null)
const inputRef = ref<InstanceType<typeof HxTextarea> | null>(null)
const inputText = ref('')
const showCreateModal = ref(false)
const showAddAgentModal = ref(false)
const showAgentPanel = ref(false)
const showDeleteConfirm = ref(false)

// Create group form
const newGroupName = ref('')
const newAgents = reactive([
  { name: '', model: '', provider: '', system_prompt: '', color: AGENT_COLORS[0] },
  { name: '', model: '', provider: '', system_prompt: '', color: AGENT_COLORS[1] },
])

// Add agent form
const addAgentName = ref('')
const addAgentModel = ref('')
const addAgentProvider = ref('')
const addAgentPrompt = ref('')
const addAgentColor = ref(AGENT_COLORS[2])

// @mention autocomplete
const mentionHint = reactive({
  visible: false,
  filtered: [] as any[],
  index: -1,
  startPos: -1,
})

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
  // Use marked for Markdown rendering
  // First, render mentions so they don't get escaped
  // We use a placeholder to protect them from markdown parsing if needed, 
  // but simple @Name usually survives markdown.
  
  // Escape HTML for safety? Marked does this usually, but let's be safe.
  // Actually, we want to render the markdown.
  
  // Handle mentions: convert @Name to HTML span before markdown parsing?
  // Or after? If after, we might parse <span> as markdown?
  // Better: Convert @Name to HTML, then parse.
  
  // But wait, if content is: "**@Name** is here", we want bold name?
  // Let's just parse markdown first.
  
  const rendered = marked.parse(content, { async: false }) as string
  
  // Now handle mentions in the rendered HTML?
  // That's risky if markdown generated <span>s.
  
  // Alternative: Just parse markdown. If the user types @Name, it's usually plain text.
  // Let's stick to a simpler approach:
  // 1. Replace @Name with a unique placeholder
  // 2. Parse Markdown
  // 3. Replace placeholder with actual HTML
  
  const agents = store.agents
  const mentions: { name: string, color: string }[] = []
  
  let processedContent = content.replace(/@(\w+)/g, (match, name) => {
    const agent = agents.find(a => a.name.toLowerCase() === name.toLowerCase())
    if (agent) {
      const placeholder = `MENTION_${mentions.length}_PLACEHOLDER`
      mentions.push({ name: agent.name, color: agent.color })
      return placeholder
    }
    return match
  })
  
  let html = marked.parse(processedContent, { async: false }) as string
  
  mentions.forEach((m, i) => {
    const placeholder = `MENTION_${i}_PLACEHOLDER`
    const span = `<span style="color:${m.color};font-weight:600">@${m.name}</span>`
    html = html.split(placeholder).join(span)
  })
  
  return html
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
  // Parse @mentions
  const mentionRegex = /@(\w+)/g
  const mentionedIds: string[] = []
  let match
  while ((match = mentionRegex.exec(text)) !== null) {
    const agent = store.agents.find(a => a.name === match[1])
    if (agent) mentionedIds.push(agent.id)
  }
  inputText.value = ''
  mentionHint.visible = false
  await store.sendMessage(text, mentionedIds.length > 0 ? mentionedIds : undefined)
  await nextTick()
  scrollBottom()
}

function onInputKeydown(e: KeyboardEvent) {
  // Enter to send (Shift+Enter for newline)
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    onSend()
    return
  }
  // @mention autocomplete navigation
  if (mentionHint.visible) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      mentionHint.index = Math.min(mentionHint.index + 1, mentionHint.filtered.length - 1)
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      mentionHint.index = Math.max(mentionHint.index - 1, 0)
      return
    }
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      if (mentionHint.filtered[mentionHint.index]) {
        insertMention(mentionHint.filtered[mentionHint.index])
      }
      return
    }
    if (e.key === 'Escape') {
      mentionHint.visible = false
      return
    }
  }
  // Trigger @mention on typing @
  const textarea = inputRef.value?.textarea
  if (textarea) {
    setTimeout(() => updateMentionHint(textarea), 0)
  }
}

function updateMentionHint(textarea: HTMLTextAreaElement) {
  const pos = textarea.selectionStart
  const text = textarea.value
  // Find @ before cursor
  let start = pos - 1
  while (start >= 0 && /\w/.test(text[start])) start--
  if (start < 0 || text[start] !== '@') {
    mentionHint.visible = false
    return
  }
  const query = text.slice(start + 1, pos).toLowerCase()
  const filtered = store.agents.filter(a => a.name.toLowerCase().includes(query))
  if (filtered.length === 0) {
    mentionHint.visible = false
    return
  }
  mentionHint.visible = true
  mentionHint.filtered = filtered
  mentionHint.index = 0
  mentionHint.startPos = start
}

function insertMention(agent: any) {
  const textarea = inputRef.value?.textarea
  if (!textarea) return
  const before = inputText.value.slice(0, mentionHint.startPos)
  const after = inputText.value.slice(textarea.selectionStart)
  inputText.value = before + '@' + agent.name + ' ' + after
  mentionHint.visible = false
  textarea.focus()
}

async function onCreateGroup() {
  const validAgents = newAgents.filter(a => a.name.trim())
  if (!newGroupName.value.trim() || validAgents.length === 0) return
  const result = await store.createGroup(newGroupName.value.trim(), validAgents)
  if (result) {
    showCreateModal.value = false
    newGroupName.value = ''
    newAgents.splice(0, newAgents.length, ...[
      { name: '', model: '', provider: '', system_prompt: '', color: AGENT_COLORS[0] },
      { name: '', model: '', provider: '', system_prompt: '', color: AGENT_COLORS[1] },
    ])
    toast.success(t('groupChat.created'))
  } else {
    toast.error(store.error || t('groupChat.error'))
  }
}

function selectRoleForAdd(role: AgentRole) {
  addAgentName.value = role.name
  addAgentPrompt.value = role.systemPrompt
  addAgentColor.value = role.color
  addAgentModel.value = '' // Use default model
}

async function onAddAgent() {
  if (!store.activeGroupId || !addAgentName.value.trim()) return
  await store.addAgent({
    name: addAgentName.value.trim(),
    model: addAgentModel.value.trim() || 'default',
    provider: addAgentProvider.value.trim(),
    system_prompt: addAgentPrompt.value.trim(),
    color: addAgentColor.value,
  })
  showAddAgentModal.value = false
  addAgentName.value = ''
  addAgentModel.value = ''
  addAgentProvider.value = ''
  addAgentPrompt.value = ''
  addAgentColor.value = AGENT_COLORS[(store.agents.length) % AGENT_COLORS.length]
  toast.success(t('groupChat.agentAdded'))
}

async function onRemoveAgent(agentId: string) {
  if (!store.activeGroupId) return
  await store.removeAgent(agentId)
  toast.success(t('groupChat.agentRemoved'))
}

function onDeleteGroup() {
  showDeleteConfirm.value = true
}

async function confirmDeleteGroup() {
  if (!store.activeGroupId) return
  await store.deleteGroup(store.activeGroupId)
  showDeleteConfirm.value = false
  toast.success(t('groupChat.deleted'))
}

onMounted(() => {
  store.fetchGroups()
})
</script>

<style scoped>
@import 'highlight.js/styles/github-dark.css';

.gc-view {
  display: flex;
  height: 100%;
  background: var(--glass-bg, rgba(20, 22, 28, 0.85));
  backdrop-filter: blur(32px) saturate(1.5);
}

/* Sidebar */
.gc-sidebar {
  width: 220px;
  border-right: 1px solid var(--border-base, rgba(255,255,255,.08));
  display: flex;
  flex-direction: column;
}
.gc-sidebar-header {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-base, rgba(255,255,255,.08));
}
.gc-sidebar-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #e0e0e0);
}
.gc-create-btn {
  background: rgba(90,200,250,.12);
  border: 1px solid rgba(90,200,250,.22);
  border-radius: 8px;
  color: var(--accent, #5ac8fa);
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
}
.gc-create-btn:hover {
  background: rgba(90,200,250,.22);
}
.gc-group-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}
.gc-group-item {
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 4px;
  transition: background .15s;
}
.gc-group-item:hover {
  background: rgba(255,255,255,.05);
}
.gc-group-item.active {
  background: rgba(90,200,250,.10);
  border-left: 3px solid var(--accent, #5ac8fa);
}
.gc-group-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary, #e0e0e0);
}
.gc-group-meta {
  font-size: 11px;
  color: var(--text-secondary, rgba(255,255,255,.45));
  margin-top: 2px;
}

/* Main Area */
.gc-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.gc-header {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-base, rgba(255,255,255,.08));
}
.gc-header-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary, #e0e0e0);
}
.gc-header-actions {
  display: flex;
  gap: 8px;
}
.gc-icon-btn {
  background: none;
  border: none;
  color: var(--text-secondary, rgba(255,255,255,.5));
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
}
.gc-icon-btn:hover {
  background: rgba(255,255,255,.08);
  color: var(--text-primary, #e0e0e0);
}
.gc-delete-btn:hover {
  color: #ff6b6b;
}

/* Messages */
.gc-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
}
.gc-msg {
  display: flex;
  margin-bottom: 12px;
  position: relative;
}
.gc-msg.human {
  justify-content: flex-end;
}
.gc-msg-agent-bar {
  width: 3px;
  border-radius: 2px;
  margin-right: 10px;
  flex-shrink: 0;
  align-self: stretch;
}
.gc-msg-body {
  max-width: 70%;
}
.gc-msg-sender {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.gc-agent-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  line-height: 1.4;
}
.gc-human-badge {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary, rgba(255,255,255,.5));
}
.gc-msg-time {
  font-size: 10px;
  color: var(--text-secondary, rgba(255,255,255,.35));
}
.gc-msg-content {
  font-size: 13px;
  color: var(--text-primary, #e0e0e0);
  line-height: 1.6;
  word-break: break-word;
}
.gc-msg.human .gc-msg-content {
  background: rgba(90,200,250,.10);
  padding: 8px 12px;
  border-radius: 12px 12px 4px 12px;
}

/* ─── Role Picker ─── */
.gc-role-section {
  margin-bottom: 16px;
}
.gc-section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0 0 8px 0;
}
.gc-role-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
}
.gc-role-card {
  background: var(--glass-bg);
  border: 1px solid var(--border-base);
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}
.gc-role-card:hover {
  background: var(--glass-hover);
  border-color: var(--accent);
}
.gc-role-card.active {
  border-color: var(--accent);
  background: var(--accent-alpha);
}
.gc-role-icon {
  font-size: 24px;
}
.gc-role-name {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-primary);
  text-align: center;
}
/* Role Select Mini (for Create Group) */
.gc-agent-def {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  padding: 4px;
  border-radius: 6px;
  background: var(--glass-bg);
}
.gc-agent-role-select {
  display: flex;
  gap: 2px;
}
.gc-role-mini {
  width: 22px;
  height: 22px;
  font-size: 14px;
  line-height: 1;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  opacity: 0.5;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gc-role-mini:hover {
  opacity: 1;
  background: var(--glass-hover);
}
.gc-role-mini.active {
  opacity: 1;
  background: var(--accent-alpha);
}

.gc-field-separator {
  font-size: 11px;
  color: var(--text-tertiary);
  text-align: center;
  margin: 12px 0;
  position: relative;
}
.gc-field-separator::before,
.gc-field-separator::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 30%;
  height: 1px;
  background: var(--border-base);
}
.gc-field-separator::before { left: 0; }
.gc-field-separator::after { right: 0; }

/* ─── Agent Panel ─── */
.gc-agent-panel {
  border-top: 1px solid var(--border-base, rgba(255,255,255,.08));
  padding: 12px 16px;
  max-height: 200px;
  overflow-y: auto;
  background: rgba(0,0,0,.15);
}
.gc-agent-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary, #e0e0e0);
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
  color: var(--text-primary, #e0e0e0);
}
.gc-agent-model {
  display: block;
  font-size: 10px;
  color: var(--text-secondary, rgba(255,255,255,.45));
}
.gc-agent-remove {
  background: none;
  border: none;
  color: var(--text-secondary, rgba(255,255,255,.4));
  cursor: pointer;
  padding: 2px;
}
.gc-agent-remove:hover {
  color: #ff6b6b;
}
.gc-add-agent-btn {
  background: none;
  border: 1px dashed rgba(90,200,250,.3);
  color: var(--accent, #5ac8fa);
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  margin-top: 8px;
}
.gc-add-agent-btn:hover {
  background: rgba(90,200,250,.08);
}

/* Input */
.gc-input-area {
  padding: 12px 16px;
  border-top: 1px solid var(--border-base, rgba(255,255,255,.08));
  position: relative;
}
.gc-mention-hint {
  position: absolute;
  bottom: 100%;
  left: 16px;
  right: 16px;
  background: rgba(30,33,42,.95);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-base, rgba(255,255,255,.1));
  border-radius: 10px;
  padding: 4px;
  max-height: 160px;
  overflow-y: auto;
  z-index: 20;
}
.gc-mention-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-primary, #e0e0e0);
}
.gc-mention-item:hover,
.gc-mention-item.active {
  background: rgba(90,200,250,.12);
}
.gc-input-row {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}
.gc-input-row :deep(.hixns-textarea-wrap) {
  flex: 1;
}
.gc-send-btn {
  background: rgba(90,200,250,.15);
  border: 1px solid rgba(90,200,250,.25);
  color: var(--accent, #5ac8fa);
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 40px;
}
.gc-send-btn:hover:not(:disabled) {
  background: rgba(90,200,250,.25);
}
.gc-send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Empty State */
.gc-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Modal */
.gc-modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.gc-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.gc-field-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary, rgba(255,255,255,.6));
}
.gc-agent-def {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.gc-agent-def-colors {
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
}
.gc-color-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color .15s;
}
.gc-color-dot.selected {
  border-color: #fff;
  box-shadow: 0 0 6px rgba(255,255,255,.3);
}
.gc-agent-def-remove {
  background: none;
  border: none;
  color: var(--text-secondary, rgba(255,255,255,.4));
  cursor: pointer;
  padding: 2px;
}
</style>
