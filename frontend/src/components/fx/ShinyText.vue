<template>
  <span class="fx-shiny" :style="style">
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  text?: string
  color?: string
  shineColor?: string
  speed?: number
  spread?: number
}>(), {
  text: '',
  color: 'rgba(255,255,255,0.4)',
  shineColor: '#ffffff',
  speed: 3,
  spread: 120
})

const progress = ref(0)
let raf = 0
let start = 0

function tick(t: number) {
  if (!start) start = t
  const elapsed = t - start
  const cycle = props.speed * 1000
  progress.value = ((elapsed % cycle) / cycle) * 100
  raf = requestAnimationFrame(tick)
}

onMounted(() => { raf = requestAnimationFrame(tick) })
onUnmounted(() => cancelAnimationFrame(raf))

const style = computed(() => ({
  backgroundImage: `linear-gradient(${props.spread}deg, ${props.color} 0%, ${props.color} 35%, ${props.shineColor} 50%, ${props.color} 65%, ${props.color} 100%)`,
  backgroundSize: '200% auto',
  backgroundPosition: `${150 - progress.value * 2}% center`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'inline-block',
}))
</script>

<style scoped>
.fx-shiny { will-change: background-position; }
</style>
