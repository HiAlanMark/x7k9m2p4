<template>
  <div class="hixns-tooltip-wrap" @mouseenter="show = true" @mouseleave="show = false">
    <slot />
    <Teleport to="body">
      <Transition name="tooltip">
        <div v-if="show" class="hixns-tooltip" :class="`hixns-tooltip--${placement}`" :style="tooltipStyle">
          <div class="hixns-tooltip-content">
            <slot name="content">{{ content }}</slot>
          </div>
          <div class="hixns-tooltip-arrow" :class="`hixns-tooltip-arrow--${placement}`" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{
  content?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}>(), {
  content: '',
  placement: 'top',
  delay: 200,
})

const show = ref(false)
const triggerEl = ref<HTMLElement>()
let timer: ReturnType<typeof setTimeout> | null = null

const tooltipStyle = computed(() => {
  if (!triggerEl.value) return {}
  const rect = triggerEl.value.getBoundingClientRect()
  const base: Record<string, string> = { position: 'fixed', zIndex: '10001' }

  switch (props.placement) {
    case 'top':
      return { ...base, bottom: `${window.innerHeight - rect.top + 8}px`, left: `${rect.left + rect.width / 2}px`, transform: 'translateX(-50%)' }
    case 'bottom':
      return { ...base, top: `${rect.bottom + 8}px`, left: `${rect.left + rect.width / 2}px`, transform: 'translateX(-50%)' }
    case 'left':
      return { ...base, right: `${window.innerWidth - rect.left + 8}px`, top: `${rect.top + rect.height / 2}px`, transform: 'translateY(-50%)' }
    case 'right':
      return { ...base, left: `${rect.right + 8}px`, top: `${rect.top + rect.height / 2}px`, transform: 'translateY(-50%)' }
  }
})

onMounted(() => {
  triggerEl.value = (triggerEl.value as any)?.$el || triggerEl.value?.parentElement?.querySelector(':scope > *:not(.hixns-tooltip)') as HTMLElement
})
</script>

<style scoped>
.hixns-tooltip-wrap {
  display: inline-flex;
  position: relative;
}

.hixns-tooltip {
  background: var(--color-text-primary);
  color: var(--color-bg-page);
  font-size: 11px;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 6px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  pointer-events: none;
}

.hixns-tooltip-arrow {
  position: absolute;
  width: 6px;
  height: 6px;
  background: var(--color-text-primary);
  transform: rotate(45deg);
}

.hixns-tooltip-arrow--top { bottom: -3px; left: 50%; margin-left: -3px; }
.hixns-tooltip-arrow--bottom { top: -3px; left: 50%; margin-left: -3px; }
.hixns-tooltip-arrow--left { right: -3px; top: 50%; margin-top: -3px; }
.hixns-tooltip-arrow--right { left: -3px; top: 50%; margin-top: -3px; }

.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
