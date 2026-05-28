<template>
  <div class="bp-node bp-summary-node" :class="[statusClass, { 'bp-node-disabled': data.disabled }]">
    <Handle type="target" :position="Position.Top" class="bp-handle bp-handle-top" />
    <Handle type="target" :position="Position.Left" id="input-left" class="bp-handle bp-handle-left" />
    <div class="bp-summary-inner">
      <div class="bp-summary-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      </div>
      <span class="bp-summary-label">{{ data.label || t('blueprint.nodes.summary') }}</span>
      <span v-if="data.summaryMode" class="bp-summary-mode">{{ data.summaryMode }}</span>
    </div>
    <Handle type="source" :position="Position.Bottom" class="bp-handle bp-handle-bottom" />
    <div class="bp-node-status" :class="statusClass">
      <svg v-if="!data.status || data.status === 'idle'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10" stroke-dasharray="4 4" /></svg>
      <svg v-else-if="data.status === 'running'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" class="bp-status-spin"><circle cx="12" cy="12" r="10" stroke-dasharray="4 4" /></svg>
      <svg v-else-if="data.status === 'succeeded'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
      <svg v-else-if="data.status === 'failed'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
      <svg v-else-if="data.status === 'waiting_approval'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
      <span v-else class="bp-status-dot" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  id: string
  data: Record<string, any>
}>()

const { t } = useI18n()

const statusClass = computed(() => {
  const s = props.data?.status as string
  if (!s) return ''
  return `status-${s}`
})
</script>

<style scoped>
.bp-summary-node {
  min-width: 140px;
  min-height: 64px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(1.6);
  -webkit-backdrop-filter: blur(20px) saturate(1.6);
  border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
  border-radius: 14px;
  position: relative;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  transition: all 0.3s ease;
  overflow: hidden;
}

/* Type color bar — accent stripe */
.bp-summary-node::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  border-radius: 0 2px 2px 0;
  background: var(--accent);
  opacity: 0.5;
  transition: opacity 0.2s, box-shadow 0.2s;
}

.bp-summary-node:hover::before {
  opacity: 1;
  box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 40%, transparent);
}

.bp-summary-node:hover {
  border-color: var(--accent);
  box-shadow: 0 0 20px color-mix(in srgb, var(--accent) 15%, transparent);
}

.bp-summary-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.bp-summary-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--accent) 15%, transparent);
  color: var(--accent);
}

.bp-summary-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bp-summary-mode {
  font-size: 9px;
  color: var(--text-secondary);
}

.bp-handle {
  width: 10px;
  height: 10px;
  background: var(--accent);
  border: 2px solid var(--glass-bg);
  border-radius: 50%;
}

.bp-handle-top {
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
}

.bp-handle-left {
  left: -5px;
  top: 50%;
  transform: translateY(-50%);
}

.bp-handle-bottom {
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
}

.bp-node-status {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  opacity: 0.5;
}

.bp-status-spin {
  animation: bp-spin 1.2s linear infinite;
}

@keyframes bp-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.status-idle .bp-node-status { opacity: 0.4; }
.status-running .bp-node-status { color: var(--info); opacity: 1; }
.status-succeeded .bp-node-status { color: var(--success); opacity: 1; }
.status-failed .bp-node-status { color: var(--error); opacity: 1; }
.status-waiting_approval .bp-node-status { color: var(--accent); opacity: 1; }

.bp-status-dot {
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-secondary);
}

.status-running { border-color: color-mix(in srgb, var(--info) 40%, transparent) !important; box-shadow: 0 0 12px color-mix(in srgb, var(--info) 15%, transparent); }
.status-succeeded { border-color: color-mix(in srgb, var(--success) 40%, transparent) !important; }
.status-failed { border-color: color-mix(in srgb, var(--error) 40%, transparent) !important; }
.status-waiting_approval { border-color: color-mix(in srgb, var(--accent) 40%, transparent) !important; }

.bp-node-disabled {
  opacity: 0.48;
  filter: saturate(0.72);
  pointer-events: none;
}
.bp-node-disabled .bp-node-status { display: none; }
</style>
