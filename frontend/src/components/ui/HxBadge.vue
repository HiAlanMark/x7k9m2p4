<template>
  <span class="hixns-badge" :class="badgeClass">
    <span v-if="variant !== 'default'" class="hixns-badge-dot" :style="{ backgroundColor: dotColor }" />
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'xs' | 'sm' | 'md' | 'lg'
}>(), {
  variant: 'default',
  size: 'sm',
})

const badgeClass = computed(() => [
  `hixns-badge--${props.variant}`,
  `hixns-badge--${props.size}`,
])

const dotColor = computed(() => {
  const colors: Record<string, string> = {
    primary: 'var(--primary)',
    success: 'var(--success)',
    warning: 'var(--warning)',
    error: 'var(--error)',
    info: 'var(--info)',
  }
  return colors[props.variant] || 'var(--text-secondary)'
})
</script>

<style scoped>
/* Base styles from enhancements.css */
</style>
