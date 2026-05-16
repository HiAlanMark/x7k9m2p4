<template>
  <div class="aurora-flow" ref="containerRef">
    <div 
      v-for="(band, index) in bands" 
      :key="index"
      class="aurora-band"
      :style="bandStyle(index)"
    ></div>
    <div class="aurora-overlay"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  bandCount?: number
  colors?: string[]
  speed?: number
  blur?: number
  opacity?: number
}>(), {
  bandCount: 3,
  colors: () => ['#0A84FF', '#BF5AF2', '#30D158'],
  speed: 1,
  blur: 60,
  opacity: 0.3,
})

const containerRef = ref<HTMLElement | null>(null)

const bands = computed(() => Array.from({ length: props.bandCount }, (_, i) => i))

const bandStyle = (index: number) => {
  const color = props.colors[index % props.colors.length]
  const delay = index * -20
  const height = 150 + index * 50
  const top = 20 + index * 25
  
  return {
    background: `linear-gradient(90deg, 
      transparent 0%, 
      ${hexToRgba(color, props.opacity * 0.5)} 20%, 
      ${hexToRgba(color, props.opacity)} 50%, 
      ${hexToRgba(color, props.opacity * 0.5)} 80%, 
      transparent 100%)`,
    filter: `blur(${props.blur}px)`,
    height: `${height}px`,
    top: `${top}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${20 / props.speed}s`,
  }
}

const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
</script>

<style scoped>
.aurora-flow {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.aurora-band {
  position: absolute;
  left: -50%;
  right: -50%;
  opacity: 0.8;
  animation: aurora-flow linear infinite;
  will-change: transform;
  mix-blend-mode: screen;
}

@keyframes aurora-flow {
  0% {
    transform: translateX(-25%) skewX(-15deg) rotate(-5deg);
  }
  50% {
    transform: translateX(25%) skewX(15deg) rotate(5deg);
  }
  100% {
    transform: translateX(-25%) skewX(-15deg) rotate(-5deg);
  }
}

.aurora-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 30% 50%,
    transparent 0%,
    var(--color-bg-page) 70%
  );
  pointer-events: none;
}
</style>
