<template>
  <div class="hixns-skeleton" :class="skeletonClass" :style="skeletonStyle">
    <div class="hixns-skeleton-shimmer" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'text' | 'rect' | 'circle' | 'avatar'
  width?: string
  height?: string
  radius?: string
  lines?: number
  animate?: boolean
}>(), {
  variant: 'text',
  width: '100%',
  height: undefined,
  radius: '4px',
  lines: 1,
  animate: true,
})

const skeletonClass = computed(() => [
  `hixns-skeleton--${props.variant}`,
  { 'hixns-skeleton--animate': props.animate },
])

const skeletonStyle = computed(() => ({
  width: props.width,
  height: props.height || (props.variant === 'text' ? '14px' : props.variant === 'circle' || props.variant === 'avatar' ? '40px' : undefined),
  borderRadius: props.variant === 'circle' || props.variant === 'avatar' ? '50%' : props.radius,
}))
</script>

<style scoped>
.hixns-skeleton {
  position: relative;
  background: var(--color-bg-input);
  overflow: hidden;
}

.hixns-skeleton--text {
  height: 14px;
  margin-bottom: 8px;
}

.hixns-skeleton--rect {
  min-height: 40px;
}

.hixns-skeleton--avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.hixns-skeleton--animate .hixns-skeleton-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
  animation: shimmer 1.5s ease-in-out infinite;
}

[data-theme="light"] .hixns-skeleton--animate .hixns-skeleton-shimmer {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
