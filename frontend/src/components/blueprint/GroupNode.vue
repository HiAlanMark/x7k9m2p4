<template>
  <div class="bp-node bp-group-node" :style="groupStyle">
    <Handle type="target" :position="Position.Top" class="bp-handle bp-handle-top" />
    <div class="bp-node-inner">
      <div class="bp-node-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <div class="bp-node-label">{{ data.label || t('blueprint.nodes.group') }}</div>
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

const groupStyle = computed(() => {
  const color = props.data?.color || '#5AC8FA'
  return {
    borderLeftColor: color,
    borderLeftWidth: '3px',
  }
})
</script>

<style scoped>
.bp-group-node {
  min-width: 240px;
  min-height: 120px;
  background: color-mix(in srgb, var(--glass-bg) 70%, transparent);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px dashed color-mix(in srgb, var(--yellow, #ffd60a) 30%, transparent);
  border-left: 3px solid #5AC8FA;
  border-radius: 14px;
  position: relative;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: grab;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
  opacity: 0.85;
}

.bp-group-node:hover {
  border-color: color-mix(in srgb, var(--yellow, #ffd60a) 50%, transparent);
  opacity: 1;
  box-shadow: var(--shadow-md), 0 0 20px color-mix(in srgb, var(--yellow, #ffd60a) 6%, transparent);
}

.bp-node-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
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
  background: color-mix(in srgb, var(--yellow, #ffd60a) 12%, transparent);
  color: var(--yellow, #ffd60a);
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
  max-width: 200px;
}

.bp-handle {
  width: 10px;
  height: 10px;
  background: color-mix(in srgb, var(--yellow, #ffd60a) 50%, transparent);
  border: 2px solid var(--border-strong);
  border-radius: 50%;
  transition: all 0.2s ease;
}

.bp-handle:hover {
  background: var(--yellow, #ffd60a);
  box-shadow: 0 0 8px color-mix(in srgb, var(--yellow, #ffd60a) 50%, transparent);
  transform: scale(1.3);
}

.bp-handle-top {
  top: -5px;
}

.bp-handle-bottom {
  bottom: -5px;
}
</style>
