<template>
  <div class="hixns-select" :class="{ 'hixns-select--disabled': disabled }">
    <select
      ref="selectRef"
      :value="modelValue"
      :disabled="disabled"
      :class="['hixns-select__field', { 'hixns-select__field--has-value': modelValue }]"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <slot></slot>
    </select>
    
    <span class="hixns-select__arrow">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string | number
  placeholder?: string
  disabled?: boolean
}>(), {
  modelValue: '',
  placeholder: '',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'focus': [e: FocusEvent]
  'blur': [e: FocusEvent]
  'change': [value: string]
}>()

const selectRef = ref<HTMLSelectElement | null>(null)

function onChange(e: Event) {
  const target = e.target as HTMLSelectElement
  emit('update:modelValue', target.value)
  emit('change', target.value)
}

function onFocus(e: FocusEvent) {
  emit('focus', e)
}

function onBlur(e: FocusEvent) {
  emit('blur', e)
}

defineExpose({
  focus: () => {
    if (selectRef.value) selectRef.value.focus()
  },
  blur: () => {
    if (selectRef.value) selectRef.value.blur()
  },
})
</script>

<style scoped>
/* Styles are in enhancements.css */
</style>
