<template>
  <div class="fx-ripple-container" @mousedown="onDown">
    <span
      v-for="ripple in ripples"
      :key="ripple.id"
      class="fx-ripple"
      :style="ripple.style"
    />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  color?: string
  duration?: number
  disabled?: boolean
}>(), {
  color: 'rgba(255,255,255,0.25)',
  duration: 600,
  disabled: false,
})

interface Ripple {
  id: number
  style: Record<string, string>
}

const ripples = ref<Ripple[]>([])
let counter = 0

function onDown(e: MouseEvent) {
  if (props.disabled) return
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 2
  const x = e.clientX - rect.left - size / 2
  const y = e.clientY - rect.top - size / 2
  const id = ++counter

  ripples.value.push({
    id,
    style: {
      width: `${size}px`,
      height: `${size}px`,
      left: `${x}px`,
      top: `${y}px`,
      background: props.color,
      animationDuration: `${props.duration}ms`,
    },
  })

  setTimeout(() => {
    ripples.value = ripples.value.filter(r => r.id !== id)
  }, props.duration)
}
</script>

<style scoped>
.fx-ripple-container {
  position: relative;
  overflow: hidden;
}
.fx-ripple {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  transform: scale(0);
  animation: rippleExpand var(--duration, 600ms) ease-out forwards;
}
@keyframes rippleExpand {
  to {
    transform: scale(1);
    opacity: 0;
  }
}
</style>
