<template>
  <div class="tech-grid" ref="gridRef" :key="themeKey">
    <canvas ref="canvasRef" class="tech-grid-canvas"></canvas>
    <div class="tech-grid-overlay"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  gridSize?: number
  lineColor?: string
  lineOpacity?: number
  glowColor?: string
  speed?: number
  perspective?: boolean
}>(), {
  gridSize: 40,
  lineColor: '#0A84FF',
  lineOpacity: 0.15,
  glowColor: '#0A84FF',
  speed: 0.5,
  perspective: true,
})

// Force re-render on theme change
const themeKey = computed(() => `${props.lineColor}-${props.glowColor}-${props.lineOpacity}`)

const gridRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null
let time = 0

const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  // Full clear with explicit reset
  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, width, height)
  ctx.restore()
  
  const { gridSize, lineColor, lineOpacity, glowColor, speed, perspective } = props
  const baseColor = hexToRgba(lineColor, lineOpacity)
  const glowRgb = hexToRgba(glowColor, lineOpacity * 0.5)
  
  ctx.strokeStyle = baseColor
  ctx.lineWidth = 1
  ctx.shadowBlur = 0 // Reset shadow first
  
  // Draw moving horizontal lines
  const offset = (time * speed * 50) % gridSize
  
  if (perspective) {
    // Perspective grid effect
    const centerX = width / 2
    const horizonY = height * 0.3
    
    // Vertical lines (converging to center)
    const verticalLines = Math.ceil(width / gridSize) + 2
    for (let i = -verticalLines; i <= verticalLines; i++) {
      const x = centerX + i * gridSize * 2
      ctx.beginPath()
      ctx.moveTo(x, height)
      ctx.lineTo(centerX + (x - centerX) * 0.1, horizonY)
      ctx.stroke()
    }
    
    // Horizontal lines (moving)
    for (let y = offset; y < height; y += gridSize) {
      const progress = y / height
      const lineY = horizonY + Math.pow(progress, 2) * (height - horizonY)
      
      ctx.beginPath()
      ctx.moveTo(0, lineY)
      ctx.lineTo(width, lineY)
      
      // Fade out near horizon
      const alpha = Math.min(1, (lineY - horizonY) / (height * 0.5))
      ctx.strokeStyle = hexToRgba(lineColor, lineOpacity * alpha)
      ctx.stroke()
    }
    
    // Glow effect at bottom
    const gradient = ctx.createLinearGradient(0, height * 0.7, 0, height)
    gradient.addColorStop(0, 'transparent')
    gradient.addColorStop(1, hexToRgba(glowColor, 0.1))
    ctx.fillStyle = gradient
    ctx.fillRect(0, height * 0.7, width, height * 0.3)
  } else {
    // Flat grid
    for (let x = offset; x < width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    
    for (let y = offset; y < height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
  }
  
  // Add subtle pulse glow
  const pulse = Math.sin(time * 2) * 0.5 + 0.5
  ctx.shadowColor = hexToRgba(glowColor, pulse * 0.3)
  ctx.shadowBlur = 20
}

const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const animate = () => {
  time += 0.016
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * window.devicePixelRatio
  canvas.height = rect.height * window.devicePixelRatio
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
  
  drawGrid(ctx, rect.width, rect.height)
  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  animate()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.tech-grid {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.tech-grid-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.tech-grid-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 0%,
    var(--color-bg-page) 100%
  );
  pointer-events: none;
}
</style>
