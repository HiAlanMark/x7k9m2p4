<template>
  <component
    :is="tag"
    :class="btnClass"
    :disabled="disabled || loading"
    @click="onClick"
  >
    <span v-if="loading" class="btn-spinner" />
    <span v-if="$slots.icon || icon" class="btn-icon">
      <slot name="icon" />
    </span>
    <span class="btn-content">
      <slot />
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

const slots = useSlots()

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'text'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  tag?: string
  icon?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
  tag: 'button',
  icon: false,
})

const emit = defineEmits<{ click: [e: MouseEvent] }>()

const btnClass = computed(() => [
  'hixns-btn',
  `hixns-btn--${props.variant}`,
  `hixns-btn--${props.size}`,
  {
    'hixns-btn--disabled': props.disabled,
    'hixns-btn--loading': props.loading,
    'hixns-btn--full': props.fullWidth,
    'hixns-btn--icon': props.icon || !!slots.icon,
  },
])

function onClick(e: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', e)
  }
}
</script>

<style scoped>
/* Styles are now in enhancements.css */
/* This component uses the global Hixns button classes */
</style>

<style scoped>
.hixns-btn--success { background: rgba(81,207,102,.16); border-color: rgba(81,207,102,.35); color: #51cf66; }
</style>
