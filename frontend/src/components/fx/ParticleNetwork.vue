<template>
  <div ref="container" class="fx-particles" />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  count?: number
  color?: string
  speed?: number
  connectDistance?: number
  particleSize?: number
  opacity?: number
}>(), {
  count: 80,
  color: '#0A84FF',
  speed: 0.5,
  connectDistance: 150,
  particleSize: 1.5,
  opacity: 0.6,
})

const container = ref<HTMLElement>()
let cleanup: (() => void) | null = null

function init() {
  const el = container.value
  if (!el) return

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none'
  el.appendChild(canvas)

  let w = el.offsetWidth
  let h = el.offsetHeight
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = w * dpr
  canvas.height = h * dpr
  ctx.scale(dpr, dpr)

  interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    r: number
    o: number
  }

  const particles: Particle[] = []
  for (let i = 0; i < props.count; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * props.speed * 0.8,
      vy: (Math.random() - 0.5) * props.speed * 0.8,
      r: props.particleSize * (0.5 + Math.random() * 0.8),
      o: props.opacity * (0.3 + Math.random() * 0.7),
    })
  }

  // Mouse interaction
  let mouse = { x: -9999, y: -9999 }
  const onMouse = (e: MouseEvent) => {
    const rect = el.getBoundingClientRect()
    mouse.x = e.clientX - rect.left
    mouse.y = e.clientY - rect.top
  }
  const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }
  el.addEventListener('mousemove', onMouse)
  el.addEventListener('mouseleave', onLeave)

  const resize = () => {
    w = el.offsetWidth
    h = el.offsetHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)
  }
  window.addEventListener('resize', resize)

  let raf = 0
  const tick = () => {
    raf = requestAnimationFrame(tick)
    ctx.clearRect(0, 0, w, h)

    // Update positions
    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0) p.x = w
      if (p.x > w) p.x = 0
      if (p.y < 0) p.y = h
      if (p.y > h) p.y = 0

      // Mouse repulsion
      const dx = p.x - mouse.x
      const dy = p.y - mouse.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 120) {
        const force = (120 - dist) / 120 * 0.02
        p.vx += dx / dist * force
        p.vy += dy / dist * force
      }

      // Damping
      p.vx *= 0.999
      p.vy *= 0.999
    }

    // Draw connections
    const maxDist = props.connectDistance
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.15 * props.opacity
          ctx.strokeStyle = props.color + Math.round(alpha * 255).toString(16).padStart(2, '0')
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }

    // Draw particles
    for (const p of particles) {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = props.color + Math.round(p.o * 255).toString(16).padStart(2, '0')
      ctx.fill()
    }
  }
  raf = requestAnimationFrame(tick)

  cleanup = () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
    el.removeEventListener('mousemove', onMouse)
    el.removeEventListener('mouseleave', onLeave)
    if (canvas.parentNode === el) el.removeChild(canvas)
  }
}

onMounted(init)
onBeforeUnmount(() => cleanup?.())
watch(() => [props.count, props.color, props.speed], () => { cleanup?.(); init() })
</script>

<style scoped>
.fx-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}
</style>
