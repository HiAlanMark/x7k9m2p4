<template>
  <div ref="container" class="fx-grid" />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  color?: string
  cellSize?: number
  speed?: number
  opacity?: number
  lineWidth?: number
}>(), {
  color: '#0A84FF',
  cellSize: 60,
  speed: 0.3,
  opacity: 0.08,
  lineWidth: 0.5,
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

  const resize = () => {
    w = el.offsetWidth
    h = el.offsetHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)
  }
  window.addEventListener('resize', resize)

  let raf = 0
  const tick = (t: number) => {
    raf = requestAnimationFrame(tick)
    ctx.clearRect(0, 0, w, h)

    const offset = (t * props.speed * 0.01) % props.cellSize
    const cols = Math.ceil(w / props.cellSize) + 2
    const rows = Math.ceil(h / props.cellSize) + 2

    ctx.strokeStyle = props.color
    ctx.lineWidth = props.lineWidth
    ctx.globalAlpha = props.opacity

    // Vertical lines with wave
    for (let i = 0; i < cols; i++) {
      ctx.beginPath()
      const x = i * props.cellSize - props.cellSize + offset
      for (let j = 0; j <= rows; j++) {
        const y = j * props.cellSize
        const wave = Math.sin((x + t * props.speed * 0.002) * 0.01) * 3
        if (j === 0) ctx.moveTo(x + wave, y)
        else ctx.lineTo(x + wave, y)
      }
      ctx.stroke()
    }

    // Horizontal lines with wave
    for (let j = 0; j < rows; j++) {
      ctx.beginPath()
      const y = j * props.cellSize - props.cellSize + offset
      for (let i = 0; i <= cols; i++) {
        const x = i * props.cellSize
        const wave = Math.cos((y + t * props.speed * 0.002) * 0.01) * 3
        if (i === 0) ctx.moveTo(x, y + wave)
        else ctx.lineTo(x, y + wave)
      }
      ctx.stroke()
    }

    // Glowing intersection points
    ctx.globalAlpha = props.opacity * 1.5
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * props.cellSize - props.cellSize + offset
        const y = j * props.cellSize - props.cellSize + offset
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.001 * props.speed + i * 0.3 + j * 0.3)
        ctx.beginPath()
        ctx.arc(x, y, 1 + pulse, 0, Math.PI * 2)
        ctx.fillStyle = props.color
        ctx.globalAlpha = props.opacity * 0.3 * pulse
        ctx.fill()
      }
    }
    ctx.globalAlpha = 1
  }
  raf = requestAnimationFrame(tick)

  cleanup = () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
    if (canvas.parentNode === el) el.removeChild(canvas)
  }
}

onMounted(init)
onBeforeUnmount(() => cleanup?.())
watch(() => [props.color, props.cellSize, props.speed], () => { cleanup?.(); init() })
</script>

<style scoped>
.fx-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}
</style>
