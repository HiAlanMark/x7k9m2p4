<template>
  <component
    :is="tag"
    :class="btnClass"
    :disabled="disabled || loading"
    @click="onClick"
  >
    <span v-if="loading" class="btn-spinner" />
    <span class="btn-content">
      <slot />
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'text'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  tag?: string
  icon?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
  tag: 'button',
  icon: false,
})

const emit = defineEmits<{ click: [e: MouseEvent] }>()

const btnClass = computed(() => [
  'hixns-btn',
  `hixns-btn--${props.variant}`,
  `hixns-btn--${props.size}`,
  {
    'hixns-btn--disabled': props.disabled,
    'hixns-btn--loading': props.loading,
    'hixns-btn--full': props.fullWidth,
    'hixns-btn--icon': props.icon,
  },
])

function onClick(e: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', e)
  }
}
</script>

<style scoped>
.hixns-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: var(--font-family);
  font-weight: 500;
  border: none;
  border-radius: var(--radius-btn);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition: all 0.3s var(--ease-out-expo);
  position: relative;
  overflow: hidden;
  outline: none;
}

/* Sizes */
.hixns-btn--xs { padding: 4px 10px; font-size: 11px; border-radius: 6px; }
.hixns-btn--sm { padding: 6px 14px; font-size: 12px; border-radius: 8px; }
.hixns-btn--md { padding: 8px 18px; font-size: 13px; }
.hixns-btn--lg { padding: 12px 24px; font-size: 15px; border-radius: 14px; }
.hixns-btn--icon { padding: 8px; aspect-ratio: 1; }

/* Primary - VueBits style */
.hixns-btn--primary {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(10, 132, 255, 0.12);
}
.hixns-btn--primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(10, 132, 255, 0.18);
}
.hixns-btn--primary:active {
  transform: translateY(0) scale(0.97);
}

/* Secondary - VueBits glass */
.hixns-btn--secondary {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--color-text-primary);
  border: 1px solid var(--glass-border);
}
.hixns-btn--secondary:hover {
  background: var(--glass-bg-strong);
  border-color: var(--glass-border-strong);
  transform: translateY(-1px);
}
.hixns-btn--secondary:active {
  transform: translateY(0) scale(0.97);
}

/* Danger */
.hixns-btn--danger {
  background: var(--color-error);
  color: #fff;
}
.hixns-btn--danger:hover {
  background: #FF3B30;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(255, 69, 58, 0.18);
}
.hixns-btn--danger:active {
  transform: translateY(0) scale(0.97);
}

/* Ghost */
.hixns-btn--ghost {
  background: transparent;
  color: var(--color-text-secondary);
}
.hixns-btn--ghost:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}

/* Text */
.hixns-btn--text {
  background: transparent;
  color: var(--color-primary);
  padding: 4px 8px;
}
.hixns-btn--text:hover {
  background: var(--color-primary-light);
}

/* Disabled */
.hixns-btn--disabled {
  opacity: 0.35;
  cursor: not-allowed;
  pointer-events: none;
}

/* Loading */
.hixns-btn--loading .btn-content {
  opacity: 0;
}

/* Full width */
.hixns-btn--full {
  width: 100%;
}

/* Spinner */
.btn-spinner {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-top-color: #fff;
  border-radius: 50%;
  animation: btnSpin 0.6s linear infinite;
}
.hixns-btn--secondary .btn-spinner,
.hixns-btn--ghost .btn-spinner {
  border-color: var(--color-border);
  border-top-color: var(--color-primary);
}
@keyframes btnSpin {
  to { transform: rotate(360deg); }
}
</style>
