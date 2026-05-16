<template>
  <div ref="containerRef" class="vue-bits-prism" :style="containerStyle"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, ref, computed, type CSSProperties } from 'vue'
import * as THREE from 'three'

interface PrismProps {
  className?: string
  style?: CSSProperties
  colors?: string[]
  speed?: number
  scale?: number
  rotationSpeed?: number
  opacity?: number
  transparent?: boolean
}

const props = withDefaults(defineProps<PrismProps>(), {
  colors: () => ['#0A84FF', '#BF5AF2', '#30D158'],
  speed: 0.3,
  scale: 1,
  rotationSpeed: 0.2,
  opacity: 0.6,
  transparent: true
})

const containerRef = ref<HTMLDivElement | null>(null)
const rendererRef = ref<THREE.WebGLRenderer | null>(null)
const rafRef = ref<number | null>(null)
const materialRef = ref<THREE.ShaderMaterial | null>(null)
const groupRef = ref<THREE.Group | null>(null)

const containerStyle = computed(() => ({
  opacity: props.opacity,
  transition: 'opacity 0.5s ease'
}))

const vert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`

const frag = `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColors[3];
uniform float uScale;
uniform float uRotationSpeed;
varying vec2 vUv;

vec3 rotate2D(vec2 p, float a) {
  float c = cos(a);
  float s = sin(a);
  return vec3(p.x * c - p.y * s, p.x * s + p.y * c, 0.0);
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;
  
  float time = uTime * 0.5;
  
  // Create prism-like triangular patterns
  vec2 p = uv * uScale;
  
  // Rotating triangular grid
  float angle = uRotationSpeed * time;
  vec3 rotated = rotate2D(p, angle);
  
  // Triangular distance field
  vec2 hex = rotated.xy;
  float d = length(hex);
  
  // Create prism facets
  float facet = sin(d * 3.0 - time) * 0.5 + 0.5;
  
  // Color mixing based on position and time
  vec3 col = uColors[0] * (0.5 + 0.5 * sin(time + p.x * 2.0));
  col += uColors[1] * (0.5 + 0.5 * sin(time * 1.3 + p.y * 2.0));
  col += uColors[2] * (0.5 + 0.5 * sin(time * 0.7 + (p.x + p.y) * 2.0));
  
  // Add prism refraction effect
  float refraction = sin(uv.x * 10.0 + time) * sin(uv.y * 10.0 + time * 1.2);
  col += vec3(refraction) * 0.2;
  
  // Soften and blend
  col = smoothstep(-0.2, 1.0, col);
  
  // Fade edges
  float edgeFade = 1.0 - smoothstep(0.0, 1.5, length(uv));
  col *= edgeFade;
  
  gl_FragColor = vec4(col, facet * 0.5);
}
`

let cleanup: (() => void) | null = null

const setup = () => {
  const container = containerRef.value
  if (!container) return

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  const geometry = new THREE.PlaneGeometry(2, 2)

  const toVec3 = (hex: string): THREE.Vector3 => {
    const h = hex.replace('#', '').trim()
    const v = h.length === 3
      ? [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)]
      : [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
    return new THREE.Vector3(v[0] / 255, v[1] / 255, v[2] / 255)
  }

  const colorsArray = props.colors.map(toVec3)

  const material = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uColors: { value: colorsArray },
      uScale: { value: props.scale },
      uRotationSpeed: { value: props.rotationSpeed }
    },
    transparent: true,
    premultipliedAlpha: true,
    depthWrite: false,
    blending: THREE.NormalBlending
  })
  materialRef.value = material

  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: 'high-performance',
    alpha: true
  })
  rendererRef.value = renderer
  const outputColorSpace = (THREE as any).SRGBColorSpace
  if (outputColorSpace) {
    ;(renderer as any).outputColorSpace = outputColorSpace
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setClearColor(0x000000, 0)
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  renderer.domElement.style.display = 'block'
  container.appendChild(renderer.domElement)

  const clock = new THREE.Clock()

  const handleResize = () => {
    const w = container.clientWidth || 1
    const h = container.clientHeight || 1
    renderer.setSize(w, h, false)
    ;(material.uniforms.uResolution.value as THREE.Vector2).set(w, h)
  }

  handleResize()

  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(handleResize)
    ro.observe(container)
  } else {
    window.addEventListener('resize', handleResize)
  }

  const loop = () => {
    const elapsed = clock.getElapsedTime()
    material.uniforms.uTime.value = elapsed * props.speed
    material.uniforms.uScale.value = props.scale
    material.uniforms.uRotationSpeed.value = props.rotationSpeed
    renderer.render(scene, camera)
    rafRef.value = requestAnimationFrame(loop)
  }
  rafRef.value = requestAnimationFrame(loop)

  cleanup = () => {
    if (rafRef.value !== null) cancelAnimationFrame(rafRef.value)
    geometry.dispose()
    material.dispose()
    renderer.dispose()
    if (renderer.domElement && renderer.domElement.parentElement === container) {
      container.removeChild(renderer.domElement)
    }
  }
}

onMounted(setup)
onBeforeUnmount(() => cleanup?.())

watch(
  () => ({ ...props }),
  () => {
    const material = materialRef.value
    const renderer = rendererRef.value
    if (!material) return

    material.uniforms.uSpeed.value = props.speed
    material.uniforms.uScale.value = props.scale
    material.uniforms.uRotationSpeed.value = props.rotationSpeed

    const toVec3 = (hex: string) => {
      const h = hex.replace('#', '').trim()
      const v =
        h.length === 3
          ? [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)]
          : [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
      return new THREE.Vector3(v[0] / 255, v[1] / 255, v[2] / 255)
    }

    const arr = (props.colors || []).slice(0, 3).map(toVec3)
    for (let i = 0; i < 3; i++) {
      ;(material.uniforms.uColors.value as THREE.Vector3[])[i].copy(arr[i] || new THREE.Vector3(0, 0, 0))
    }
  },
  { deep: true }
)
</script>

<style scoped>
.vue-bits-prism {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

:deep(canvas) {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}
</style>
