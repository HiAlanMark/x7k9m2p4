<template>
  <div class="bp-node bp-note-node">
    <div class="bp-note-inner">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="bp-note-pin">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
      <div class="bp-note-content">{{ data.label || data.content || t('blueprint.nodes.note') }}</div>
    </div>
    <Handle type="target" :position="Position.Top" class="bp-handle bp-handle-top" />
    <Handle type="source" :position="Position.Bottom" class="bp-handle bp-handle-bottom" />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { useI18n } from 'vue-i18n'

defineProps<{
  id: string
  data: Record<string, any>
}>()

const { t } = useI18n()
</script>

<style scoped>
.bp-note-node {
  min-width: 120px;
  max-width: 200px;
  min-height: 48px;
  background: color-mix(in srgb, var(--warning) 8%, transparent);
  backdrop-filter: blur(12px) saturate(1.4);
  -webkit-backdrop-filter: blur(12px) saturate(1.4);
  border: 1px dashed color-mix(in srgb, var(--warning) 30%, transparent);
  border-radius: 10px;
  padding: 10px 14px;
  cursor: grab;
  transition: all 0.3s ease;
  overflow: hidden;
}

/* Type color bar — yellow stripe */
.bp-note-node::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  border-radius: 0 2px 2px 0;
  background: var(--yellow, #ffd60a);
  opacity: 0.5;
  transition: opacity 0.2s, box-shadow 0.2s;
}

.bp-note-node:hover::before {
  opacity: 1;
  box-shadow: 0 0 8px color-mix(in srgb, var(--yellow, #ffd60a) 40%, transparent);
}

.bp-note-node:hover {
  border-color: color-mix(in srgb, var(--warning) 50%, transparent);
  background: color-mix(in srgb, var(--warning) 12%, transparent);
}

.bp-note-inner {
  display: flex;
  gap: 6px;
  align-items: flex-start;
}

.bp-note-pin {
  color: color-mix(in srgb, var(--warning) 60%, transparent);
  flex-shrink: 0;
  margin-top: 1px;
}

.bp-note-content {
  font-size: 11px;
  color: var(--text-primary, #e0e0e0);
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
  font-style: italic;
  opacity: 0.8;
}

.bp-handle {
  width: 8px;
  height: 8px;
  background: color-mix(in srgb, var(--warning) 50%, transparent);
  border: 2px solid transparent;
  border-radius: 50%;
  opacity: 0.6;
}

.bp-handle-top {
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
}

.bp-handle-bottom {
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
