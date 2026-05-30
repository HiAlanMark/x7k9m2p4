<template>
  <div class="coding-agents-view">
    <!-- Header -->
    <div class="ca-header">
      <div class="ca-header-left">
        <h1 class="ca-title">{{ t('codingAgents.title') }}</h1>
        <p class="ca-subtitle">{{ t('codingAgents.subtitle') }}</p>
      </div>
      <HxButton variant="secondary" size="sm" :loading="loading" @click="refresh">
        {{ t('codingAgents.refresh') }}
      </HxButton>
    </div>

    <!-- Loading -->
    <div v-if="loading && !agents.length" class="ca-loading">
      <HxSpinner />
      <span>{{ t('codingAgents.loading') }}</span>
    </div>

    <!-- Agent Cards -->
    <div v-else class="ca-cards">
      <div
        v-for="agent in agents"
        :key="agent.id"
        class="ca-card glass"
      >
        <!-- Card Header -->
        <div class="ca-card-header">
          <div class="ca-card-icon">
            <!-- Code/terminal icon -->
            <svg v-if="agent.id === 'claude-code'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"/>
              <polyline points="8 6 2 12 8 18"/>
            </svg>
            <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="4 17 10 11 4 5"/>
              <line x1="12" y1="19" x2="20" y2="19"/>
            </svg>
          </div>
          <div class="ca-card-info">
            <h2 class="ca-card-name">{{ agent.name }}</h2>
            <div class="ca-card-meta">
              <HxBadge :variant="agent.installed ? 'success' : 'error'" size="sm">
                {{ agent.installed ? t('codingAgents.installed') : t('codingAgents.notFound') }}
              </HxBadge>
              <span v-if="agent.version" class="ca-version">{{ agent.version }}</span>
            </div>
          </div>
          <div class="ca-card-status">
            <span class="ca-status-dot" :class="agent.running ? 'dot-running' : 'dot-stopped'"></span>
            <span class="ca-status-text" :class="agent.running ? 'text-running' : 'text-stopped'">
              {{ agent.running ? t('codingAgents.running') : t('codingAgents.stopped') }}
            </span>
          </div>
        </div>

        <!-- Card Actions -->
        <div class="ca-card-actions">
          <HxButton
            variant="primary"
            size="sm"
            :disabled="!agent.installed || agent.running || launching[agent.id]"
            :loading="launching[agent.id]"
            @click="onLaunch(agent)"
          >
            {{ t('codingAgents.launch') }}
          </HxButton>
          <HxButton
            variant="danger"
            size="sm"
            :disabled="!agent.running || stopping[agent.id]"
            :loading="stopping[agent.id]"
            @click="onStop(agent)"
          >
            {{ t('codingAgents.stop') }}
          </HxButton>
          <HxButton
            variant="secondary"
            size="sm"
            :disabled="!agent.installed"
            @click="openLogs(agent)"
          >
            {{ t('codingAgents.viewLogs') }}
          </HxButton>
        </div>

        <!-- Config Section -->
        <div class="ca-card-config">
          <h3 class="ca-config-title">{{ t('codingAgents.config') }}</h3>
          <div class="ca-config-fields">
            <div class="ca-field">
              <label class="ca-field-label">{{ t('codingAgents.model') }}</label>
              <HxInput
                v-model="configs[agent.id].model"
                :placeholder="t('codingAgents.modelPlaceholder')"
                :disabled="agent.running"
              />
            </div>
            <div class="ca-field">
              <label class="ca-field-label">{{ t('codingAgents.workdir') }}</label>
              <HxInput
                v-model="configs[agent.id].workdir"
                :placeholder="t('codingAgents.workdirPlaceholder')"
                :disabled="agent.running"
              />
            </div>
            <div class="ca-field">
              <label class="ca-field-label">{{ t('codingAgents.systemPrompt') }}</label>
              <HxTextarea
                v-model="configs[agent.id].system_prompt"
                :placeholder="t('codingAgents.systemPromptPlaceholder')"
                :rows="3"
                :disabled="agent.running"
              />
            </div>
          </div>
          <div class="ca-config-actions">
            <HxButton
              variant="secondary"
              size="sm"
              :loading="saving[agent.id]"
              @click="onSaveConfig(agent)"
            >
              {{ t('codingAgents.saveConfig') }}
            </HxButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Logs Modal -->
    <HxModal
      v-model="logsModalVisible"
      :title="logsModalTitle"
      size="lg"
    >
      <div class="ca-logs-container">
        <pre v-if="logsLines.length" class="ca-logs-pre" ref="logsPreRef">{{ logsLines.join('\n') }}</pre>
        <div v-else class="ca-logs-empty">{{ t('codingAgents.noLogs') }}</div>
      </div>
      <template #footer>
        <HxButton variant="secondary" size="sm" @click="logsModalVisible = false">
          {{ t('codingAgents.close') }}
        </HxButton>
        <HxButton variant="secondary" size="sm" @click="refreshLogs">
          {{ t('codingAgents.refresh') }}
        </HxButton>
      </template>
    </HxModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  codingAgentsList,
  codingAgentLaunch,
  codingAgentStop,
  codingAgentLogs,
  codingAgentSetConfig,
  type CodingAgent,
} from '@/api'
import { HxButton, HxBadge, HxInput, HxTextarea, HxModal, HxSpinner } from '@/components/ui'

const { t } = useI18n()

// State
const agents = ref<CodingAgent[]>([])
const loading = ref(false)
const launching = reactive<Record<string, boolean>>({})
const stopping = reactive<Record<string, boolean>>({})
const saving = reactive<Record<string, boolean>>({})
const configs = reactive<Record<string, { model: string; workdir: string; system_prompt: string }>>({})

// Logs modal
const logsModalVisible = ref(false)
const logsModalTitle = ref('')
const logsLines = ref<string[]>([])
const logsAgentId = ref('')
const logsPreRef = ref<HTMLPreElement | null>(null)

// Polling
let pollTimer: ReturnType<typeof setInterval> | null = null

async function refresh() {
  loading.value = true
  try {
    const result = await codingAgentsList()
    agents.value = result.agents
    // Initialize config forms from agent config
    for (const agent of result.agents) {
      if (!configs[agent.id]) {
        configs[agent.id] = {
          model: (agent.config?.model as string) || '',
          workdir: (agent.config?.workdir as string) || '',
          system_prompt: (agent.config?.system_prompt as string) || '',
        }
      } else {
        // Update from server if not dirty
        configs[agent.id].model = configs[agent.id].model || (agent.config?.model as string) || ''
        configs[agent.id].workdir = configs[agent.id].workdir || (agent.config?.workdir as string) || ''
        configs[agent.id].system_prompt = configs[agent.id].system_prompt || (agent.config?.system_prompt as string) || ''
      }
    }
  } catch (e) {
    console.warn('[CodingAgents] Failed to fetch agents:', e)
  } finally {
    loading.value = false
  }
}

async function onLaunch(agent: CodingAgent) {
  launching[agent.id] = true
  try {
    const opts: { workdir?: string; prompt?: string; model?: string } = {}
    if (configs[agent.id]?.workdir) opts.workdir = configs[agent.id].workdir
    if (configs[agent.id]?.model) opts.model = configs[agent.id].model
    const result = await codingAgentLaunch(agent.id, opts)
    console.log(`[CodingAgents] Launched ${agent.name} with PID ${result.pid}`)
  } catch (e) {
    console.error('[CodingAgents] Launch failed:', e)
  } finally {
    launching[agent.id] = false
    await refresh()
  }
}

async function onStop(agent: CodingAgent) {
  stopping[agent.id] = true
  try {
    await codingAgentStop(agent.id)
  } catch (e) {
    console.error('[CodingAgents] Stop failed:', e)
  } finally {
    stopping[agent.id] = false
    await refresh()
  }
}

async function openLogs(agent: CodingAgent) {
  logsAgentId.value = agent.id
  logsModalTitle.value = `${agent.name} — ${t('codingAgents.logsTitle')}`
  await refreshLogs()
  logsModalVisible.value = true
  await nextTick()
  scrollToBottom()
}

async function refreshLogs() {
  if (!logsAgentId.value) return
  try {
    const result = await codingAgentLogs(logsAgentId.value)
    logsLines.value = result.logs
    await nextTick()
    scrollToBottom()
  } catch (e) {
    console.warn('[CodingAgents] Failed to fetch logs:', e)
    logsLines.value = []
  }
}

function scrollToBottom() {
  if (logsPreRef.value) {
    logsPreRef.value.scrollTop = logsPreRef.value.scrollHeight
  }
}

async function onSaveConfig(agent: CodingAgent) {
  saving[agent.id] = true
  try {
    const config: Record<string, unknown> = {}
    if (configs[agent.id].model) config.model = configs[agent.id].model
    if (configs[agent.id].workdir) config.workdir = configs[agent.id].workdir
    if (configs[agent.id].system_prompt) config.system_prompt = configs[agent.id].system_prompt
    await codingAgentSetConfig(agent.id, config)
  } catch (e) {
    console.error('[CodingAgents] Save config failed:', e)
  } finally {
    saving[agent.id] = false
  }
}

onMounted(() => {
  refresh()
  pollTimer = setInterval(refresh, 5000)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>

<style scoped>
.coding-agents-view {
  padding: 24px;
  height: 100%;
  overflow-y: auto;
}

.ca-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

.ca-header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ca-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.ca-subtitle {
  font-size: 13px;
  color: var(--text-tertiary);
  margin: 0;
}

.ca-loading {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  padding: 48px;
  color: var(--text-secondary);
  font-size: 14px;
}

.ca-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(480px, 1fr));
  gap: 20px;
}

.ca-card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--blur-base)) saturate(var(--saturate));
  -webkit-backdrop-filter: blur(var(--blur-base)) saturate(var(--saturate));
  border: 1px solid var(--border-base);
  border-radius: var(--radius-xl);
  padding: 24px;
  transition: border-color var(--fast), box-shadow var(--fast);
}

.ca-card:hover {
  border-color: color-mix(in srgb, var(--accent) 40%, var(--border-base));
  box-shadow: 0 0 20px color-mix(in srgb, var(--accent) 8%, transparent);
}

/* Card Header */
.ca-card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.ca-card-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.ca-card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ca-card-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.ca-card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ca-version {
  font-size: 12px;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
}

/* Status Indicator */
.ca-card-status {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.ca-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot-running {
  background: var(--success);
  box-shadow: 0 0 6px color-mix(in srgb, var(--success) 60%, transparent);
  animation: pulse-dot 2s ease-in-out infinite;
}

.dot-stopped {
  background: var(--text-tertiary);
  opacity: 0.5;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.ca-status-text {
  font-size: 13px;
  font-weight: 500;
}

.text-running {
  color: var(--success);
}

.text-stopped {
  color: var(--text-tertiary);
}

/* Card Actions */
.ca-card-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-subtle);
}

/* Config Section */
.ca-card-config {
  margin-top: 0;
}

.ca-config-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0 0 12px 0;
}

.ca-config-fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ca-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ca-field-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-tertiary);
}

.ca-config-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

/* Logs Modal */
.ca-logs-container {
  max-height: 60vh;
  overflow: hidden;
}

.ca-logs-pre {
  background: color-mix(in srgb, var(--bg-base) 95%, black);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-secondary);
  max-height: 55vh;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
}

.ca-logs-empty {
  text-align: center;
  padding: 24px;
  color: var(--text-tertiary);
  font-size: 14px;
}

/* Responsive */
@media (max-width: 560px) {
  .ca-cards {
    grid-template-columns: 1fr;
  }

  .ca-card {
    padding: 16px;
  }
}
</style>
