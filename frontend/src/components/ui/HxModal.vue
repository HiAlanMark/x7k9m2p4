<template>
  <Teleport to="body">
    <Transition name="hixns-modal">
      <div v-if="modelValue" class="hixns-modal-overlay" @click.self="onClose">
        <div class="hixns-modal" :class="sizeClass" :style="modalStyle">
          <!-- Header -->
          <div v-if="title || icon || $slots.header" class="hixns-modal-header">
            <slot name="header">
              <div class="hixns-modal-title-row">
                <div v-if="icon" class="hixns-modal-icon" :style="iconStyle">
                  <component :is="icon" v-if="typeof icon === 'object'" />
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" v-html="iconSvg"></svg>
                </div>
                <h2 class="hixns-modal-title">{{ title }}</h2>
              </div>
            </slot>
            <button v-if="closable" class="hixns-modal-close" @click="onClose" :title="t('common.close')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="hixns-modal-body">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="hixns-modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  modelValue?: boolean
  title?: string
  icon?: string
  iconColor?: string
  iconBg?: string
  closable?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  width?: string
}>(), {
  modelValue: false,
  closable: true,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const sizeClass = computed(() => `hixns-modal--${props.size}`)
const modalStyle = computed(() => props.width ? { '--modal-width': props.width } : {})

const iconStyle = computed(() => {
  const s: Record<string, string> = {}
  if (props.iconColor) s.color = props.iconColor
  if (props.iconBg) s.background = props.iconBg
  return s
})

// Named icon SVG paths — maps icon name to inner SVG content
const iconMap: Record<string, string> = {
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
  key: '<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>',
  'alert-triangle': '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
}

const iconSvg = computed(() => iconMap[props.icon || ''] || props.icon || '')
</script>

<style scoped>
.hixns-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-overlay);
  backdrop-filter: blur(var(--blur-sm));
  -webkit-backdrop-filter: blur(var(--blur-sm));
  padding: var(--space-6);
}

.hixns-modal {
  background: var(--bg-surface);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  width: var(--modal-width, auto);
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: hixnsModalEnter 0.3s var(--spring-bounce);
}

.hixns-modal--sm { --modal-width: 360px; }
.hixns-modal--md { --modal-width: 480px; }
.hixns-modal--lg { --modal-width: 640px; }
.hixns-modal--xl { --modal-width: 800px; }

.hixns-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-base);
}

.hixns-modal-title-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.hixns-modal-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-elevated);
  border-radius: var(--radius-md);
  color: var(--primary-text);
  flex-shrink: 0;
}

.hixns-modal-icon :deep(svg) {
  display: block;
  width: 22px;
  height: 22px;
}

.hixns-modal-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.hixns-modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-elevated);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  flex-shrink: 0;
  align-self: center;
  transition: all 0.15s;
}
.hixns-modal-close:hover {
  background: var(--bg-surface);
  border-color: var(--border-light);
  color: var(--text-primary);
}

.hixns-modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.hixns-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  padding: 16px 24px;
  border-top: 1px solid var(--border-base);
}

/* Transitions */
.hixns-modal-enter-active,
.hixns-modal-leave-active {
  transition: opacity 0.25s ease;
}
.hixns-modal-enter-from,
.hixns-modal-leave-to {
  opacity: 0;
}
.hixns-modal-enter-from .hixns-modal {
  transform: scale(0.95) translateY(10px);
}
.hixns-modal-leave-to .hixns-modal {
  transform: scale(0.95) translateY(10px);
}
@keyframes hixnsModalEnter {
  from {
    transform: scale(0.95) translateY(10px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}
</style>
