<template>
  <div class="bp-node bp-manager-slot-node" :class="[statusClass, { 'bp-node-disabled': data.disabled }]">
    <Handle type="target" :position="Position.Top" class="bp-handle bp-handle-top" />
    <div class="bp-node-glow" />
    <div class="bp-node-inner">
      <div class="bp-node-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      </div>
      <div class="bp-node-label">{{ data.label || t('blueprint.nodes.managerSlot') }}</div>
      <div class="bp-node-meta-row">
        <span v-if="data.slot != null" class="bp-node-badge bp-slot-badge">#{{ data.slot }}</span>
        <span v-if="data.execution_mode" class="bp-node-badge">{{ data.execution_mode }}</span>
      </div>
    </div>
    <div class="bp-node-status" :class="statusClass">
      <svg v-if="!data.status || data.status === 'idle'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10" stroke-dasharray="4 4" /></svg>
      <svg v-else-if="data.status === 'running'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" class="bp-status-spin"><circle cx="12" cy="12" r="10" stroke-dasharray="4 4" /></svg>
      <svg v-else-if="data.status === 'succeeded'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
      <svg v-else-if="data.status === 'failed'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
      <svg v-else-if="data.status === 'waiting_approval'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
      <span v-else class="bp-status-dot" />
    </div>
    <Handle type="source" :position="Position.Bottom" class="bp-handle bp-handle-bottom" />
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
.bp-manager-slot-node {
  min-width: 160px;
  max-width: 200px;
  background: var(--glass-bg);
  backdrop-filter: blur(32px) saturate(1.8);
  -webkit-backdrop-filter: blur(32px) saturate(1.8);
  border: 1px solid color-mix(in srgb, var(--info) 25%, transparent);
  border-radius: 14px;
  position: relative;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: grab;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
}

.bp-manager-slot-node:hover {
  border-color: color-mix(in srgb, var(--info) 50%, transparent);
  box-shadow: var(--shadow-md), 0 0 16px color-mix(in srgb, var(--info) 10%, transparent);
}

.bp-node-glow {
  position: absolute;
  inset: -1px;
  border-radius: 14px;
  opacity: 0;
  transition: opacity 0.3s ease;
  background: linear-gradient(135deg, color-mix(in srgb, var(--info) 15%, transparent), color-mix(in srgb, var(--accent) 8%, transparent));
  z-index: -1;
}

.bp-manager-slot-node:hover .bp-node-glow {
  opacity: 1;
}

.bp-node-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  z-index: 1;
  width: 100%;
}

.bp-node-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--info) 12%, transparent);
  color: var(--info);
  margin-bottom: 2px;
}

.bp-node-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
}

.bp-node-meta-row {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: center;
}

.bp-node-badge {
  font-size: 9px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;
  background: color-mix(in srgb, var(--info) 12%, transparent);
  color: var(--info);
  font-variant-numeric: tabular-nums;
}

.bp-slot-badge {
  background: color-mix(in srgb, var(--accent) 15%, transparent);
  color: var(--accent);
  font-size: 10px;
  font-weight: 700;
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

.bp-handle {
  width: 10px;
  height: 10px;
  background: color-mix(in srgb, var(--info) 60%, transparent);
  border: 2px solid var(--border-strong);
  border-radius: 50%;
  transition: all 0.2s ease;
}

.bp-handle:hover {
  background: var(--info);
  box-shadow: 0 0 8px color-mix(in srgb, var(--info) 50%, transparent);
  transform: scale(1.3);
}

.bp-handle-top {
  top: -5px;
}

.bp-handle-bottom {
  bottom: -5px;
}

.status-running { border-color: color-mix(in srgb, var(--info) 40%, transparent); box-shadow: 0 0 12px color-mix(in srgb, var(--info) 15%, transparent); }
.status-succeeded { border-color: color-mix(in srgb, var(--success) 40%, transparent); }
.status-failed { border-color: color-mix(in srgb, var(--error) 40%, transparent); }
.status-waiting_approval { border-color: color-mix(in srgb, var(--accent) 40%, transparent); }

.bp-node-disabled {
  opacity: 0.48;
  filter: saturate(0.72);
  pointer-events: none;
}
.bp-node-disabled .bp-node-status { display: none; }
</style>
