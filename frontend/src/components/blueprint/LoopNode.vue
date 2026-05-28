<template>
  <div class="bp-node bp-loop-node" :class="[statusClass, { 'bp-node-disabled': data.disabled }]">
    <Handle type="target" :position="Position.Top" class="bp-handle bp-handle-top" />
    <div class="bp-loop-ring">
      <div class="bp-loop-inner">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="17 1 21 5 17 9" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <polyline points="7 23 3 19 7 15" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
        <span class="bp-loop-label">{{ data.label || t('blueprint.nodes.loop') }}</span>
        <span v-if="data.maxIterations" class="bp-loop-count">&times;{{ data.maxIterations }}</span>
      </div>
    </div>
    <Handle type="source" :position="Position.Bottom" class="bp-handle bp-handle-bottom" />
    <Handle type="source" :position="Position.Right" id="loop-back" class="bp-handle bp-handle-right-loop" />
    <div class="bp-handle-label-loop">&#8635;</div>
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
.bp-loop-node {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
}

.bp-loop-ring {
  width: 108px;
  height: 108px;
  border-radius: 50%;
  background: var(--glass-bg);
  backdrop-filter: blur(32px) saturate(1.8);
  -webkit-backdrop-filter: blur(32px) saturate(1.8);
  border: 2px solid color-mix(in srgb, var(--accent) 20%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: var(--shadow-sm);
}

.bp-loop-ring::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px dashed color-mix(in srgb, var(--accent) 15%, transparent);
  animation: loop-rotate 10s linear infinite;
}

@keyframes loop-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.bp-loop-node:hover .bp-loop-ring {
  border-color: color-mix(in srgb, var(--accent) 50%, transparent);
  box-shadow: var(--shadow-md), 0 0 16px color-mix(in srgb, var(--accent) 8%, transparent);
}

.bp-loop-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  color: var(--accent);
}

.bp-loop-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  max-width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bp-loop-count {
  font-size: 9px;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
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

.bp-handle-bottom {
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
}

.bp-handle-right-loop {
  right: -5px;
  top: 50%;
  transform: translateY(-50%);
}

.bp-handle-label-loop {
  position: absolute;
  right: -22px;
  top: calc(50% + 12px);
  font-size: 11px;
  color: var(--accent);
}

.bp-node-status {
  position: absolute;
  top: 4px;
  left: calc(50% + 18px);
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
