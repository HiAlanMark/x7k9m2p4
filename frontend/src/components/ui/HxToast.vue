<template>
  <Teleport to="body">
    <div class="hixns-toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="hixns-toast"
          :class="`hixns-toast--${toast.variant}`"
          @mouseenter="pauseTimer(toast.id)"
          @mouseleave="resumeTimer(toast.id)"
        >
          <span class="hixns-toast-icon" v-html="toastIcon(toast.variant)" />
          <div class="hixns-toast-body">
            <div class="hixns-toast-title">{{ toast.title }}</div>
            <div v-if="toast.message" class="hixns-toast-message">{{ toast.message }}</div>
          </div>
          <button class="hixns-toast-close" @click="remove(toast.id)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface Toast {
  id: number
  title: string
  message?: string
  variant: 'success' | 'error' | 'warning' | 'info'
  duration: number
  timer?: ReturnType<typeof setTimeout>
}

const toasts = ref<Toast[]>([])
let counter = 0
const timers = new Map<number, ReturnType<typeof setTimeout>>()

function show(options: Omit<Toast, 'id'>) {
  const id = ++counter
  const toast: Toast = { id, ...options }
  toasts.value.push(toast)
  startTimer(id, toast.duration)
  return id
}

function remove(id: number) {
  toasts.value = toasts.value.filter(t => t.id !== id)
  clearTimeout(timers.get(id))
  timers.delete(id)
}

function startTimer(id: number, duration: number) {
  if (duration <= 0) return
  const timer = setTimeout(() => remove(id), duration)
  timers.set(id, timer)
}

function pauseTimer(id: number) {
  clearTimeout(timers.get(id))
}

function resumeTimer(id: number) {
  const toast = toasts.value.find(t => t.id === id)
  if (toast) startTimer(id, toast.duration)
}

function success(title: string, message?: string, duration = 4000) {
  return show({ title, message, variant: 'success', duration })
}
function error(title: string, message?: string, duration = 5000) {
  return show({ title, message, variant: 'error', duration })
}
function warning(title: string, message?: string, duration = 4000) {
  return show({ title, message, variant: 'warning', duration })
}
function info(title: string, message?: string, duration = 3000) {
  return show({ title, message, variant: 'info', duration })
}

function toastIcon(variant: string): string {
  switch (variant) {
    case 'success':
      return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>'
    case 'error':
      return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
    case 'warning':
      return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
    case 'info':
      return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    default:
      return ''
  }
}

onBeforeUnmount(() => {
  timers.forEach(t => clearTimeout(t))
  timers.clear()
})

defineExpose({ show, remove, success, error, warning, info })
</script>

<style scoped>
.hixns-toast-container {
  position: fixed;
  top: 40px;
  right: 20px;
  z-index: 10002;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.hixns-toast {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  background: var(--color-bg-card-solid);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: var(--shadow-float);
  min-width: 280px;
  max-width: 400px;
  pointer-events: auto;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.hixns-toast--success { border-left: 3px solid var(--color-success); }
.hixns-toast--error { border-left: 3px solid var(--color-error); }
.hixns-toast--warning { border-left: 3px solid var(--color-warning); }
.hixns-toast--info { border-left: 3px solid var(--color-primary); }

.hixns-toast-icon {
  flex-shrink: 0;
  margin-top: 1px;
}
.hixns-toast--success .hixns-toast-icon { color: var(--color-success); }
.hixns-toast--error .hixns-toast-icon { color: var(--color-error); }
.hixns-toast--warning .hixns-toast-icon { color: var(--color-warning); }
.hixns-toast--info .hixns-toast-icon { color: var(--color-primary); }

.hixns-toast-body {
  flex: 1;
  min-width: 0;
}

.hixns-toast-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.hixns-toast-message {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: 2px;
  line-height: 1.4;
}

.hixns-toast-close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: var(--color-text-tertiary);
  border-radius: 4px;
  cursor: pointer;
  padding: 0;
  transition: all 0.15s;
}
.hixns-toast-close:hover {
  background: var(--color-bg-input);
  color: var(--color-text-primary);
}

/* Transitions */
.toast-enter-active {
  transition: all 0.3s var(--spring-bounce);
}
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}
.toast-move {
  transition: transform 0.3s var(--spring-smooth);
}
</style>
