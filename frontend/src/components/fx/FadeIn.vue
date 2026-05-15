<template>
  <div ref="el" class="fx-fadein" :style="style">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  blur?: boolean
  duration?: number
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
  scale?: number
}>(), {
  blur: true,
  duration: 600,
  delay: 0,
  direction: 'up',
  distance: 24,
  scale: 1
})

const visible = ref(false)
const el = ref<HTMLElement>()
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!el.value) return
  observer = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      setTimeout(() => { visible.value = true }, props.delay)
      observer?.unobserve(el.value!)
    }
  }, { threshold: 0.08 })
  observer.observe(el.value)
})

onUnmounted(() => observer?.disconnect())

const translate = computed(() => {
  if (visible.value) return 'translate(0, 0)'
  const d = props.distance
  switch (props.direction) {
    case 'up': return `translate(0, ${d}px)`
    case 'down': return `translate(0, ${-d}px)`
    case 'left': return `translate(${d}px, 0)`
    case 'right': return `translate(${-d}px, 0)`
    default: return 'translate(0, 0)'
  }
})

const style = computed(() => ({
  opacity: visible.value ? 1 : 0,
  filter: props.blur ? (visible.value ? 'blur(0px)' : 'blur(8px)') : 'none',
  transform: `${translate.value} scale(${visible.value ? 1 : props.scale})`,
  transition: `opacity ${props.duration}ms cubic-bezier(.16,1,.3,1), filter ${props.duration}ms cubic-bezier(.16,1,.3,1), transform ${props.duration}ms cubic-bezier(.16,1,.3,1)`
}))
</script>

<style scoped>
.fx-fadein { will-change: opacity, filter, transform; }
</style>
