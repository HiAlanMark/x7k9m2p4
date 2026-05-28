<template>
  <div class="bp-node bp-agent-node" :class="[statusClass, { 'bp-node-disabled': data.disabled }]">
    <Handle type="target" :position="Position.Top" class="bp-handle bp-handle-top" />
    <div class="bp-node-glow" />
    <div class="bp-node-inner">
      <div class="bp-node-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
          <path d="M19 13v1a7 7 0 0 1-14 0v-1"/>
          <line x1="12" y1="18" x2="12" y2="22"/>
          <line x1="8" y1="22" x2="16" y2="22"/>
        </svg>
      </div>
      <div class="bp-node-label">{{ data.label || t('blueprint.nodes.agent') }}</div>
      <div v-if="data.model" class="bp-node-meta">{{ data.model }}</div>
      <div v-if="data.skills && data.skills.length" class="bp-node-meta bp-node-skills-count">
        {{ data.skills.length }} {{ t('blueprint.nodeConfig.skills') }}
      </div>
    </div>
    <div v-if="data.prompt" class="bp-node-preview">{{ data.prompt }}</div>
    <div class="bp-node-status" :class="statusClass">
      <!-- idle -->
      <svg v-if="!data.status || data.status === 'idle'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10" stroke-dasharray="4 4" /></svg>
      <!-- running -->
      <svg v-else-if="data.status === 'running'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" class="bp-status-spin"><circle cx="12" cy="12" r="10" stroke-dasharray="4 4" /></svg>
      <!-- succeeded -->
      <svg v-else-if="data.status === 'succeeded'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
      <!-- failed -->
      <svg v-else-if="data.status === 'failed'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
      <!-- waiting_approval -->
      <svg v-else-if="data.status === 'waiting_approval'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
      <!-- fallback dot -->
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
.bp-agent-node {
  min-width: 170px;
  max-width: 220px;
  background: var(--glass-bg);
  backdrop-filter: blur(32px) saturate(1.8);
  -webkit-backdrop-filter: blur(32px) saturate(1.8);
  border: 1px solid var(--border-light);
  border-radius: 14px;
  position: relative;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: grab;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
}

.bp-agent-node:hover {
  border-color: color-mix(in srgb, var(--accent) 40%, transparent);
  box-shadow: var(--shadow-md), 0 0 16px color-mix(in srgb, var(--accent) 8%, transparent);
}

.bp-node-glow {
  position: absolute;
  inset: -1px;
  border-radius: 14px;
  opacity: 0;
  transition: opacity 0.3s ease;
  background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 15%, transparent), color-mix(in srgb, var(--info) 10%, transparent));
  z-index: -1;
}

.bp-agent-node:hover .bp-node-glow {
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
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--accent);
  margin-bottom: 2px;
}

.bp-node-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.bp-node-meta {
  font-size: 10px;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.bp-node-skills-count {
  display: flex;
  align-items: center;
  gap: 3px;
}

.bp-node-preview {
  font-size: 9px;
  color: var(--text-secondary);
  line-height: 1.3;
  max-height: 26px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-top: 2px;
  padding-top: 4px;
  border-top: 1px solid var(--border-base);
  width: 100%;
}

.bp-node-status {
  position: absolute;
  top: 6px;
  right: 6px;
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

.status-idle .bp-node-status {
  opacity: 0.4;
}

.status-running .bp-node-status {
  color: var(--info);
  opacity: 1;
}

.status-succeeded .bp-node-status {
  color: var(--success);
  opacity: 1;
}

.status-failed .bp-node-status {
  color: var(--error);
  opacity: 1;
}

.status-waiting_approval .bp-node-status {
  color: var(--accent);
  opacity: 1;
}

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
}

.bp-handle-bottom {
  bottom: -5px;
}

/* Status border overlay */
.status-running {
  border-color: color-mix(in srgb, var(--info) 40%, transparent);
  box-shadow: var(--shadow-sm), 0 0 12px color-mix(in srgb, var(--info) 15%, transparent);
}

.status-succeeded {
  border-color: color-mix(in srgb, var(--success) 40%, transparent);
  box-shadow: var(--shadow-sm), 0 0 8px color-mix(in srgb, var(--success) 10%, transparent);
}

.status-failed {
  border-color: color-mix(in srgb, var(--error) 40%, transparent);
  box-shadow: var(--shadow-sm), 0 0 8px color-mix(in srgb, var(--error) 10%, transparent);
}

.status-waiting_approval {
  border-color: color-mix(in srgb, var(--accent) 40%, transparent);
  box-shadow: var(--shadow-sm), 0 0 8px color-mix(in srgb, var(--accent) 10%, transparent);
}

/* Disabled state */
.bp-node-disabled {
  opacity: 0.48;
  filter: saturate(0.72);
  pointer-events: none;
}

.bp-node-disabled .bp-node-status {
  display: none;
}
</style>
