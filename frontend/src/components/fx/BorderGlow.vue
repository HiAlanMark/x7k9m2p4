<template>
  <div
    ref="containerRef"
    class="fx-border-glow"
    :class="{ 'fx-border-glow--active': isActive }"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <div class="fx-border-glow__border" :style="borderStyle"></div>
    <div class="fx-border-glow__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  glowColor?: string
  glowIntensity?: number
  active?: boolean
}>(), {
  glowColor: 'rgba(10,132,255,0.6)',
  glowIntensity: 1,
  active: false,
})

const containerRef = ref<HTMLElement>()
const isHovered = ref(false)

const isActive = computed(() => props.active || isHovered.value)

const borderStyle = computed(() => {
  if (!isActive.value) {
    return {
      opacity: '0.3',
      background: `linear-gradient(90deg, 
        rgba(255,255,255,0.1) 0%, 
        rgba(255,255,255,0.05) 50%, 
        rgba(255,255,255,0.1) 100%)`,
    }
  }
  
  const intensity = props.glowIntensity
  return {
    opacity: '1',
    background: `linear-gradient(
      ${Date.now() % 360}deg,
      ${props.glowColor} 0%,
      rgba(255,255,255,0.3) 25%,
      ${props.glowColor} 50%,
      rgba(255,255,255,0.3) 75%,
      ${props.glowColor} 100%
    )`,
    boxShadow: `
      0 0 ${10 * intensity}px ${props.glowColor},
      0 0 ${20 * intensity}px ${props.glowColor}40,
      inset 0 0 ${10 * intensity}px ${props.glowColor}20
    `,
  }
})

function onEnter() {
  isHovered.value = true
}

function onLeave() {
  isHovered.value = false
}
</script>

<style scoped>
.fx-border-glow {
  position: relative;
  display: inline-block;
  border-radius: inherit;
  overflow: hidden;
}

.fx-border-glow__border {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.3;
}

.fx-border-glow--active .fx-border-glow__border {
  animation: border-glow-rotate 3s linear infinite;
}

@keyframes border-glow-rotate {
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
}

.fx-border-glow__content {
  position: relative;
  z-index: 1;
}
</style>
