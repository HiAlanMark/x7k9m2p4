<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="hixns-modal-overlay" @click.self="onClose">
        <div class="hixns-modal" :class="sizeClass" :style="modalStyle">
          <!-- Header -->
          <div v-if="title || $slots.header" class="hixns-modal-header">
            <slot name="header">
              <h2 class="hixns-modal-title">{{ title }}</h2>
            </slot>
            <button v-if="closable" class="hixns-modal-close" @click="onClose" title="关闭">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
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

const props = withDefaults(defineProps<{
  modelValue?: boolean
  title?: string
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

function onClose() {
  if (props.closable) {
    emit('update:modelValue', false)
    emit('close')
  }
}
</script>

<style scoped>
.hixns-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  padding: 20px;
}

.hixns-modal {
  background: var(--color-bg-card-solid);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  box-shadow: var(--shadow-float);
  width: var(--modal-width, auto);
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalEnter 0.3s var(--spring-bounce);
}

.hixns-modal--sm { --modal-width: 360px; }
.hixns-modal--md { --modal-width: 480px; }
.hixns-modal--lg { --modal-width: 640px; }
.hixns-modal--xl { --modal-width: 800px; }

.hixns-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 12px;
  border-bottom: 1px solid var(--color-border-subtle);
}

.hixns-modal-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.hixns-modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--color-text-tertiary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}
.hixns-modal-close:hover {
  background: var(--color-bg-input);
  color: var(--color-text-primary);
}

.hixns-modal-body {
  padding: 16px 20px;
  overflow-y: auto;
  flex: 1;
}

.hixns-modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 20px 18px;
  border-top: 1px solid var(--color-border-subtle);
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .hixns-modal {
  transform: scale(0.95) translateY(10px);
}
.modal-leave-to .hixns-modal {
  transform: scale(0.95) translateY(10px);
}
@keyframes modalEnter {
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
