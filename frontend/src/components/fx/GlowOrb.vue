<template>
  <div class="fx-glow-orb" :style="orbStyle">
    <div class="fx-glow-orb__inner" :style="innerStyle" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  color?: string
  size?: number
  x?: string
  y?: string
  blur?: number
  opacity?: number
  animate?: boolean
  duration?: number
}>(), {
  color: '#0A84FF',
  size: 300,
  x: '50%',
  y: '50%',
  blur: 80,
  opacity: 0.3,
  animate: true,
  duration: 8,
})

const orbStyle = computed(() => ({
  position: 'absolute' as const,
  left: props.x,
  top: props.y,
  width: `${props.size}px`,
  height: `${props.size}px`,
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none' as const,
  zIndex: 0,
  animation: props.animate ? `orbFloat ${props.duration}s ease-in-out infinite` : 'none',
}))

const innerStyle = computed(() => ({
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  background: `radial-gradient(circle, ${props.color} 0%, transparent 70%)`,
  filter: `blur(${props.blur}px)`,
  opacity: props.opacity,
}))
</script>

<style scoped>
.fx-glow-orb {
  will-change: transform;
}
.fx-glow-orb__inner {
  will-change: opacity;
}
@keyframes orbFloat {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  25% { transform: translate(-48%, -52%) scale(1.05); }
  50% { transform: translate(-52%, -48%) scale(0.95); }
  75% { transform: translate(-50%, -50%) scale(1.02); }
}
</style>
