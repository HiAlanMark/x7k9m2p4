<template>
  <div class="bp-node bp-condition-node" :class="[statusClass, { 'bp-node-disabled': data.disabled }]">
    <Handle type="target" :position="Position.Top" class="bp-handle bp-handle-top" />
    <div class="bp-diamond">
      <div class="bp-diamond-inner">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
        <span class="bp-diamond-label">{{ data.label || t('blueprint.nodes.condition') }}</span>
        <span v-if="data.conditionExpr" class="bp-diamond-expr">{{ data.conditionExpr }}</span>
      </div>
    </div>
    <Handle type="source" :position="Position.Bottom" id="yes" class="bp-handle bp-handle-bottom-yes" />
    <Handle type="source" :position="Position.Right" id="no" class="bp-handle bp-handle-right-no" />
    <div class="bp-handle-label-yes">Y</div>
    <div class="bp-handle-label-no">N</div>
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
.bp-condition-node {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
}

.bp-diamond {
  width: 120px;
  height: 120px;
  transform: rotate(45deg);
  background: var(--glass-bg);
  backdrop-filter: blur(32px) saturate(1.8);
  -webkit-backdrop-filter: blur(32px) saturate(1.8);
  border: 1px solid var(--border-light);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
}

.bp-condition-node:hover .bp-diamond {
  border-color: color-mix(in srgb, var(--accent) 40%, transparent);
  box-shadow: var(--shadow-md), 0 0 16px color-mix(in srgb, var(--accent) 8%, transparent);
}

.bp-diamond-inner {
  transform: rotate(-45deg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  color: var(--accent);
}

.bp-diamond-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  max-width: 75px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bp-diamond-expr {
  font-size: 8px;
  color: var(--text-secondary);
  max-width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-style: italic;
}

.bp-handle {
  width: 10px;
  height: 10px;
  background: color-mix(in srgb, var(--accent) 60%, transparent);
  border: 2px solid var(--border-strong);
  border-radius: 50%;
  transition: all 0.2s ease;
}

.bp-handle:hover {
  background: var(--accent);
  box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 50%, transparent);
  transform: scale(1.3);
}

.bp-handle-top {
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
}

.bp-handle-bottom-yes {
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
}

.bp-handle-right-no {
  right: -5px;
  top: 50%;
  transform: translateY(-50%);
}

.bp-handle-label-yes {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 9px;
  color: var(--success);
  font-weight: 700;
}

.bp-handle-label-no {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 9px;
  color: var(--error);
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

.status-running { border-color: color-mix(in srgb, var(--info) 40%, transparent) !important; box-shadow: 0 0 12px color-mix(in srgb, var(--info) 15%, transparent); }
.status-succeeded { border-color: color-mix(in srgb, var(--success) 40%, transparent) !important; }
.status-failed { border-color: color-mix(in srgb, var(--error) 40%, transparent) !important; }

.bp-node-disabled {
  opacity: 0.48;
  filter: saturate(0.72);
  pointer-events: none;
}
.bp-node-disabled .bp-node-status { display: none; }
</style>
