<template>
  <div class="hx-spinner" :class="sizeClass">
    <div class="spinner-ring"></div>
    <span v-if="label" class="spinner-label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const sizeClass = computed(() => `size-${props.size}`)
</script>

<style scoped>
.hx-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px;
}

.spinner-ring {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.size-sm .spinner-ring {
  width: 18px;
  height: 18px;
  border-width: 2px;
}

.size-lg .spinner-ring {
  width: 48px;
  height: 48px;
  border-width: 4px;
}

.spinner-label {
  font-size: 13px;
  color: var(--color-text-secondary);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
