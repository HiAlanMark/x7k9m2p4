<template>
  <div
    ref="cardRef"
    class="fx-spotlight"
    @mousemove="onMove"
    @mouseenter="opacity = 0.6"
    @mouseleave="opacity = 0"
  >
    <div
      class="fx-spotlight__glow"
      :style="{
        opacity,
        background: `radial-gradient(circle at ${pos.x}px ${pos.y}px, ${color}, transparent 80%)`
      }"
    />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  color?: string
}>(), {
  color: 'rgba(255,255,255,0.12)'
})

const cardRef = ref<HTMLElement>()
const pos = ref({ x: 0, y: 0 })
const opacity = ref(0)

function onMove(e: MouseEvent) {
  if (!cardRef.value) return
  const r = cardRef.value.getBoundingClientRect()
  pos.value = { x: e.clientX - r.left, y: e.clientY - r.top }
}
</script>

<style scoped>
.fx-spotlight {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-card, 16px);
}
.fx-spotlight__glow {
  pointer-events: none;
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 1;
}
.fx-spotlight > :deep(*:not(.fx-spotlight__glow)) {
  position: relative;
  z-index: 2;
}
</style>
