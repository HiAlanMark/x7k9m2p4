<template>
  <div class="bp-node-panel">
    <div class="bp-panel-header">
      <span class="bp-panel-title">{{ t('common.edit') }}</span>
      <button class="bp-panel-close" @click="$emit('close')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <div v-if="!node" class="bp-panel-empty">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.3">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
      <span>{{ t('common.noData') }}</span>
    </div>

    <div v-else class="bp-panel-body">
      <!-- Node Type Badge -->
      <div class="bp-field">
        <label class="bp-label">Type</label>
        <div class="bp-type-badge" :class="`type-${node.type}`">
          {{ node.type }}
        </div>
      </div>

      <!-- Label -->
      <div class="bp-field">
        <label class="bp-label">{{ t('blueprint.name') }}</label>
        <input
          class="bp-input"
          :value="node.data.label || ''"
          @input="updateField('label', ($event.target as HTMLInputElement).value)"
          placeholder="Node label"
        />
      </div>

      <!-- Agent-specific fields -->
      <template v-if="node.type === 'agent'">
        <div class="bp-field">
          <label class="bp-label">{{ t('blueprint.nodeConfig.prompt') }}</label>
          <textarea
            class="bp-textarea"
            :value="node.data.prompt || ''"
            @input="updateField('prompt', ($event.target as HTMLTextAreaElement).value)"
            rows="3"
            :placeholder="t('blueprint.nodeConfig.prompt')"
          />
        </div>
        <div class="bp-field">
          <label class="bp-label">{{ t('blueprint.nodeConfig.model') }}</label>
          <input
            class="bp-input"
            :value="node.data.model || ''"
            @input="updateField('model', ($event.target as HTMLInputElement).value)"
            placeholder="gpt-4o"
          />
        </div>
        <div class="bp-field">
          <label class="bp-label">{{ t('blueprint.nodeConfig.timeout') }}</label>
          <input
            class="bp-input"
            type="number"
            :value="node.data.timeout || 60"
            @input="updateField('timeout', Number(($event.target as HTMLInputElement).value))"
            min="1"
          />
        </div>
        <div class="bp-field bp-field-row">
          <label class="bp-label">{{ t('blueprint.nodeConfig.approval') }}</label>
          <button
            class="bp-toggle"
            :class="{ active: node.data.requiresApproval }"
            @click="updateField('requiresApproval', !node.data.requiresApproval)"
          >
            <span class="bp-toggle-dot" />
          </button>
        </div>
        <div class="bp-field">
          <label class="bp-label">{{ t('blueprint.nodeConfig.skills') }}</label>
          <div class="bp-skills-select">
            <div v-for="skill in availableSkills" :key="skill.name"
                 class="bp-skill-chip"
                 :class="{ selected: isSelected(skill.name) }"
                 @click="toggleSkill(skill.name)">
              {{ skill.name }}
            </div>
            <div v-if="availableSkills.length === 0" class="bp-skills-empty">
              {{ t('blueprint.nodeConfig.noSkills') }}
            </div>
          </div>
          <div v-if="selectedSkills.length > 0" class="bp-skills-selected">
            <span v-for="s in selectedSkills" :key="s" class="bp-skill-tag">
              {{ s }}
              <button class="bp-skill-remove" @click.stop="toggleSkill(s)">×</button>
            </span>
          </div>
        </div>
      </template>

      <!-- Condition-specific fields -->
      <template v-if="node.type === 'condition'">
        <div class="bp-field">
          <label class="bp-label">{{ t('blueprint.nodeConfig.conditionExpr') }}</label>
          <textarea
            class="bp-textarea"
            :value="node.data.conditionExpr || ''"
            @input="updateField('conditionExpr', ($event.target as HTMLTextAreaElement).value)"
            rows="2"
            :placeholder="t('blueprint.nodeConfig.conditionExpr')"
          />
        </div>
      </template>

      <!-- Loop-specific fields -->
      <template v-if="node.type === 'loop'">
        <div class="bp-field">
          <label class="bp-label">{{ t('blueprint.nodeConfig.maxIterations') }}</label>
          <input
            class="bp-input"
            type="number"
            :value="node.data.maxIterations || 10"
            @input="updateField('maxIterations', Number(($event.target as HTMLInputElement).value))"
            min="1"
          />
        </div>
        <div class="bp-field">
          <label class="bp-label">{{ t('blueprint.nodeConfig.prompt') }}</label>
          <textarea
            class="bp-textarea"
            :value="node.data.prompt || ''"
            @input="updateField('prompt', ($event.target as HTMLTextAreaElement).value)"
            rows="2"
            :placeholder="t('blueprint.nodeConfig.prompt')"
          />
        </div>
      </template>

      <!-- Summary-specific fields -->
      <template v-if="node.type === 'summary'">
        <div class="bp-field">
          <label class="bp-label">{{ t('blueprint.nodeConfig.summaryMode') }}</label>
          <select
            class="bp-select"
            :value="node.data.summaryMode || 'concat'"
            @change="updateField('summaryMode', ($event.target as HTMLSelectElement).value)"
          >
            <option value="concat">Concat</option>
            <option value="summarize">Summarize</option>
            <option value="merge">Merge</option>
          </select>
        </div>
      </template>

      <!-- Manager-specific fields -->
      <template v-if="node.type === 'manager'">
        <div class="bp-field">
          <label class="bp-label">{{ t('blueprint.nodeConfig.instructions') }}</label>
          <textarea
            class="bp-textarea"
            :value="node.data.instructions || ''"
            @input="updateField('instructions', ($event.target as HTMLTextAreaElement).value)"
            rows="3"
            :placeholder="t('blueprint.nodeConfig.instructions')"
          />
        </div>
        <div class="bp-field">
          <label class="bp-label">{{ t('blueprint.nodeConfig.portCount') }}</label>
          <input
            class="bp-input"
            type="number"
            :value="node.data.port_count || 2"
            @input="updateField('port_count', Number(($event.target as HTMLInputElement).value))"
            min="1"
            max="10"
          />
        </div>
        <div class="bp-field">
          <label class="bp-label">{{ t('blueprint.nodeConfig.maxHandoffs') }}</label>
          <input
            class="bp-input"
            type="number"
            :value="node.data.max_handoffs || 3"
            @input="updateField('max_handoffs', Number(($event.target as HTMLInputElement).value))"
            min="1"
          />
        </div>
        <div class="bp-field">
          <label class="bp-label">{{ t('blueprint.nodeConfig.model') }}</label>
          <input
            class="bp-input"
            :value="node.data.model_id || ''"
            @input="updateField('model_id', ($event.target as HTMLInputElement).value)"
            placeholder="gpt-4o"
          />
        </div>
        <div class="bp-field">
          <label class="bp-label">{{ t('blueprint.nodeConfig.agentName') }}</label>
          <input
            class="bp-input"
            :value="node.data.agent_name || ''"
            @input="updateField('agent_name', ($event.target as HTMLInputElement).value)"
            :placeholder="t('blueprint.nodeConfig.agentName')"
          />
        </div>
        <div class="bp-field">
          <label class="bp-label">{{ t('blueprint.nodeConfig.timeout') }}</label>
          <input
            class="bp-input"
            type="number"
            :value="node.data.timeout_ms ? Math.round(node.data.timeout_ms / 1000) : 60"
            @input="updateField('timeout_ms', Number(($event.target as HTMLInputElement).value) * 1000)"
            min="1"
          />
        </div>
        <div class="bp-field">
          <label class="bp-label">{{ t('blueprint.nodeConfig.skills') }}</label>
          <div class="bp-skills-select">
            <div v-for="skill in availableSkills" :key="skill.name"
                 class="bp-skill-chip"
                 :class="{ selected: isSelected(skill.name) }"
                 @click="toggleSkill(skill.name)">
              {{ skill.name }}
            </div>
            <div v-if="availableSkills.length === 0" class="bp-skills-empty">
              {{ t('blueprint.nodeConfig.noSkills') }}
            </div>
          </div>
        </div>
      </template>

      <!-- Manager Slot-specific fields -->
      <template v-if="node.type === 'manager_slot'">
        <div class="bp-field">
          <label class="bp-label">{{ t('blueprint.nodeConfig.slot') }}</label>
          <input
            class="bp-input"
            type="number"
            :value="node.data.slot != null ? node.data.slot : 0"
            @input="updateField('slot', Number(($event.target as HTMLInputElement).value))"
            min="0"
          />
        </div>
        <div class="bp-field">
          <label class="bp-label">{{ t('blueprint.nodeConfig.executionMode') }}</label>
          <select
            class="bp-select"
            :value="node.data.execution_mode || 'manual'"
            @change="updateField('execution_mode', ($event.target as HTMLSelectElement).value)"
          >
            <option value="manual">Manual</option>
            <option value="parallel">Parallel</option>
          </select>
        </div>
        <div class="bp-field" v-if="node.data.execution_mode === 'parallel'">
          <label class="bp-label">{{ t('blueprint.nodeConfig.parallelLanes') }}</label>
          <input
            class="bp-input"
            type="number"
            :value="node.data.parallel_lane_count || 1"
            @input="updateField('parallel_lane_count', Number(($event.target as HTMLInputElement).value))"
            min="1"
            max="10"
          />
        </div>
      </template>

      <!-- Group-specific fields -->
      <template v-if="node.type === 'group'">
        <div class="bp-field">
          <label class="bp-label">{{ t('blueprint.nodeConfig.color') }}</label>
          <input
            class="bp-input bp-color-input"
            type="color"
            :value="node.data.color || '#5AC8FA'"
            @input="updateField('color', ($event.target as HTMLInputElement).value)"
          />
        </div>
      </template>

      <!-- Note-specific fields -->
      <template v-if="node.type === 'note'">
        <div class="bp-field">
          <label class="bp-label">Content</label>
          <textarea
            class="bp-textarea"
            :value="node.data.content || ''"
            @input="updateField('content', ($event.target as HTMLTextAreaElement).value)"
            rows="4"
            placeholder="Note content..."
          />
        </div>
      </template>

      <!-- Delete Button -->
      <div class="bp-field bp-field-actions">
        <button class="bp-btn bp-btn-danger" @click="$emit('delete', node.id)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          <span>{{ t('common.delete') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBlueprintStore } from '@/stores/blueprint'

export interface NodeData {
  id: string
  type: string
  data: Record<string, any>
}

const props = defineProps<{
  node: NodeData | null
}>()

const emit = defineEmits<{
  close: []
  update: [nodeId: string, field: string, value: any]
  delete: [nodeId: string]
}>()

const { t } = useI18n()
const blueprintStore = useBlueprintStore()

const availableSkills = computed(() => blueprintStore.skills)
const selectedSkills = computed(() => {
  const skills = props.node?.data?.skills
  return Array.isArray(skills) ? skills as string[] : []
})

function isSelected(name: string) {
  return selectedSkills.value.includes(name)
}

function toggleSkill(name: string) {
  if (!props.node) return
  const current = selectedSkills.value
  const next = current.includes(name)
    ? current.filter(s => s !== name)
    : [...current, name]
  emit('update', props.node.id, 'skills', next)
}

// Fetch skills on mount if not loaded
onMounted(() => {
  if (blueprintStore.skills.length === 0) {
    blueprintStore.fetchSkills()
  }
})

function updateField(field: string, value: any) {
  if (!props.node) return
  emit('update', props.node.id, field, value)
}
</script>

<style scoped>
.bp-node-panel {
  width: 280px;
  height: 100%;
  background: var(--glass-bg);
  backdrop-filter: blur(24px) saturate(1.8);
  -webkit-backdrop-filter: blur(24px) saturate(1.8);
  border-left: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.bp-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-base);
}

.bp-panel-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.3px;
}

.bp-panel-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  background: var(--glass-bg);
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.bp-panel-close:hover {
  background: color-mix(in srgb, var(--error) 15%, transparent);
  color: var(--error);
}

.bp-panel-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 12px;
}

.bp-panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.bp-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bp-field-row {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.bp-field-actions {
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid var(--border-base);
}

.bp-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
}

.bp-input {
  background: var(--border-base);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 12px;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.2s ease;
}

.bp-input:focus {
  border-color: var(--accent);
}

.bp-textarea {
  background: var(--border-base);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 12px;
  color: var(--text-primary);
  outline: none;
  resize: vertical;
  min-height: 48px;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.bp-textarea:focus {
  border-color: var(--accent);
}

.bp-select {
  background: var(--border-base);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 12px;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.2s ease;
}

.bp-select:focus {
  border-color: var(--accent);
}

.bp-type-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
}

.type-agent {
  background: color-mix(in srgb, var(--info) 15%, transparent);
  color: var(--info);
}

.type-condition {
  background: color-mix(in srgb, var(--warning, #ff9f0a) 15%, transparent);
  color: var(--warning, #ff9f0a);
}

.type-loop {
  background: color-mix(in srgb, var(--purple, #af52de) 15%, transparent);
  color: var(--purple, #af52de);
}

.type-summary {
  background: color-mix(in srgb, var(--accent) 15%, transparent);
  color: var(--accent);
}

.type-note {
  background: color-mix(in srgb, var(--yellow, #ffd60a) 15%, transparent);
  color: var(--yellow, #ffd60a);
}

.bp-toggle {
  position: relative;
  width: 38px;
  height: 22px;
  background: var(--glass-bg-hover);
  border-radius: 11px;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
  padding: 2px;
}

.bp-toggle.active {
  background: var(--accent);
}

.bp-toggle-dot {
  display: block;
  width: 18px;
  height: 18px;
  background: var(--bg-surface);
  border-radius: 50%;
  transition: transform 0.2s ease;
}

.bp-toggle.active .bp-toggle-dot {
  transform: translateX(16px);
}

.bp-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.bp-btn-danger {
  background: color-mix(in srgb, var(--error) 12%, transparent);
  color: var(--error);
}

.bp-btn-danger:hover {
  background: color-mix(in srgb, var(--error) 20%, transparent);
}

.bp-skills-select {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-height: 120px;
  overflow-y: auto;
  padding: 6px;
  background: var(--border-base);
  border: 1px solid var(--border-light);
  border-radius: 8px;
}

.bp-skill-chip {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 10px;
  background: var(--glass-bg);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid transparent;
}

.bp-skill-chip.selected {
  background: color-mix(in srgb, var(--accent) 15%, transparent);
  color: var(--accent);
  border-color: color-mix(in srgb, var(--accent) 30%, transparent);
}

.bp-skill-chip:hover {
  background: color-mix(in srgb, var(--accent) 8%, transparent);
}

.bp-skills-empty {
  font-size: 10px;
  color: var(--text-secondary);
  padding: 4px;
}

.bp-skills-selected {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.bp-skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 9px;
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--accent);
}

.bp-skill-remove {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 11px;
  line-height: 1;
  padding: 0;
}

.bp-skill-remove:hover {
  color: var(--error);
}
</style>
