<template>
  <span class="hixns-badge" :class="badgeClass">
    <span v-if="dot" class="hixns-badge-dot" :class="dotClass" />
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
  dot?: boolean
  pill?: boolean
}>(), {
  variant: 'default',
  size: 'sm',
  dot: false,
  pill: false,
})

const badgeClass = computed(() => [
  `hixns-badge--${props.variant}`,
  `hixns-badge--${props.size}`,
  { 'hixns-badge--pill': props.pill },
])

const dotClass = computed(() => `hixns-badge-dot--${props.variant}`)
</script>

<style scoped>
.hixns-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-family);
  font-weight: 500;
  border-radius: 4px;
  white-space: nowrap;
}

.hixns-badge--pill {
  border-radius: 100px;
}

.hixns-badge--sm {
  padding: 2px 6px;
  font-size: 10px;
}

.hixns-badge--md {
  padding: 3px 8px;
  font-size: 11px;
}

/* Variants */
.hixns-badge--default {
  background: var(--color-bg-input);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.hixns-badge--primary {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.hixns-badge--success {
  background: rgba(48,209,88,0.12);
  color: var(--color-success);
}

.hixns-badge--warning {
  background: rgba(255,159,10,0.12);
  color: var(--color-warning);
}

.hixns-badge--error {
  background: rgba(255,69,58,0.12);
  color: var(--color-error);
}

.hixns-badge--info {
  background: rgba(10,132,255,0.12);
  color: var(--color-primary);
}

/* Dot */
.hixns-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.hixns-badge-dot--default { background: var(--color-text-tertiary); }
.hixns-badge-dot--primary { background: var(--color-primary); }
.hixns-badge-dot--success { background: var(--color-success); }
.hixns-badge-dot--warning { background: var(--color-warning); }
.hixns-badge-dot--error { background: var(--color-error); }
.hixns-badge-dot--info { background: var(--color-primary); }
</style>
