<template>
  <div
    class="hixns-card"
    :class="{ 'hixns-card--hover': hover, 'hixns-card--glass': glass, 'hixns-card--no-pad': noPad }"
    :style="cardStyle"
  >
    <div v-if="$slots.header || title" class="hixns-card-header">
      <slot name="header">
        <h3 class="hixns-card-title">{{ title }}</h3>
      </slot>
    </div>
    <div class="hixns-card-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="hixns-card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  hover?: boolean
  glass?: boolean
  noPad?: boolean
  radius?: number
}>(), {
  hover: false,
  glass: false,
  noPad: false,
  radius: undefined,
})

const cardStyle = computed(() => ({
  '--card-radius': props.radius ? `${props.radius}px` : undefined,
}))
</script>

<style scoped>
.hixns-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--card-radius, var(--radius-card));
  box-shadow: var(--shadow-card);
  transition: all 0.35s var(--ease-out-expo);
  overflow: hidden;
}

.hixns-card--glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border-color: var(--glass-border);
  box-shadow: var(--glass-shadow-inset), var(--shadow-card);
}

.hixns-card--hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
  border-color: var(--color-border-light);
}

.hixns-card--glass.hixns-card--hover:hover {
  background: var(--glass-bg-strong);
  border-color: var(--glass-border-strong);
  box-shadow: var(--glass-shadow-inset), var(--shadow-card-hover);
}

.hixns-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px 0;
}

.hixns-card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.hixns-card-body {
  padding: var(--card-radius, 16px);
}

.hixns-card--no-pad .hixns-card-body {
  padding: 0;
}

.hixns-card-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px 14px;
}
</style>
