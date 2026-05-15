<template>
  <div class="fx-glass" :class="{ 'fx-glass--hover': hover }" :style="cssVars">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  blur?: number
  opacity?: number
  saturation?: number
  border?: boolean
  hover?: boolean
  radius?: number
  tint?: string
}>(), {
  blur: 20,
  opacity: 0.06,
  saturation: 1.6,
  border: true,
  hover: false,
  radius: 20,
  tint: '255,255,255'
})

const cssVars = computed(() => ({
  '--gp-blur': `${props.blur}px`,
  '--gp-bg': `rgba(${props.tint}, ${props.opacity})`,
  '--gp-saturate': props.saturation,
  '--gp-border': props.border ? `1px solid rgba(${props.tint}, ${props.opacity + 0.06})` : 'none',
  '--gp-radius': `${props.radius}px`,
  '--gp-shadow-inset': `inset 0 1px 0 0 rgba(${props.tint}, ${props.opacity + 0.04}), inset 0 -1px 0 0 rgba(0,0,0,0.06)`,
  '--gp-shadow-outer': '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
}))
</script>

<style scoped>
.fx-glass {
  background: var(--gp-bg);
  backdrop-filter: blur(var(--gp-blur)) saturate(var(--gp-saturate));
  -webkit-backdrop-filter: blur(var(--gp-blur)) saturate(var(--gp-saturate));
  border: var(--gp-border);
  border-radius: var(--gp-radius);
  box-shadow: var(--gp-shadow-inset), var(--gp-shadow-outer);
  transition: transform 0.35s cubic-bezier(.34,1.56,.64,1),
              box-shadow 0.35s ease,
              background 0.3s ease;
}
.fx-glass--hover:hover {
  transform: translateY(-2px) scale(1.005);
  box-shadow: var(--gp-shadow-inset),
              0 12px 40px rgba(0,0,0,0.12),
              0 4px 12px rgba(0,0,0,0.06);
}
</style>
