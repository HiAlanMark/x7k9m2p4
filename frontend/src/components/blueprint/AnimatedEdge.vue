<template>
  <BaseEdge :id="id" :style="edgeStyle" :path="path[0]" :marker-end="markerEnd" />
  <path
    :d="path[0]"
    class="bp-animated-edge-bg"
    fill="none"
    stroke-width="2"
  />
  <path
    :d="path[0]"
    class="bp-animated-edge-flow"
    fill="none"
    stroke-width="2"
    :stroke-dasharray="'8 4'"
    :stroke-dashoffset="dashOffset"
  />
  <EdgeText
    v-if="data?.label"
    :x="path[1]"
    :y="path[2]"
    :label="data.label"
    :label-style="{ fill: 'rgba(255,255,255,0.5)', fontSize: '10px', fontWeight: 600 }"
    :label-show-bg="true"
    :label-bg-style="{ fill: 'rgba(15,15,20,0.8)', rx: 4, ry: 4 }"
    :label-bg-padding="[4, 6]"
  />
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { BaseEdge, EdgeText, getBezierPath, type EdgeProps } from '@vue-flow/core'

const props = defineProps<EdgeProps>()

const path = computed(() =>
  getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition,
  })
)

const edgeStyle = computed(() => ({
  stroke: 'rgba(90, 200, 250, 0.25)',
  strokeWidth: 2,
}))

const dashOffset = ref(0)
let animFrame = 0

onMounted(() => {
  function animate() {
    dashOffset.value -= 0.5
    animFrame = requestAnimationFrame(animate)
  }
  animate()
})

onUnmounted(() => {
  cancelAnimationFrame(animFrame)
})
</script>

<style scoped>
.bp-animated-edge-bg {
  stroke: color-mix(in srgb, var(--accent) 12%, transparent);
}

.bp-animated-edge-flow {
  stroke: color-mix(in srgb, var(--accent) 50%, transparent);
  animation: none;
}
</style>
