<template>
  <div class="hixns-input" :class="[{ 'hixns-input--error': error }, { 'hixns-input--number': type === 'number' }]">
    <span v-if="$slots.left || leftIcon" class="hixns-input__icon">
      <slot name="left">
        <span v-if="leftIcon">{{ leftIcon }}</span>
      </slot>
    </span>
    
    <input
      v-if="type !== 'textarea'"
      ref="inputRef"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="['hixns-input__field', { 
        'hixns-input__field--has-right': showClear || $slots.right || showNumberControls 
      }]"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @keydown.enter="onEnter"
    />
    
    <!-- Number controls -->
    <div v-if="type === 'number' && showNumberControls" class="hixns-input__number-controls">
      <button 
        type="button" 
        class="hixns-input__number-btn"
        @click="decrement"
        :disabled="disabled || (min !== null && Number(modelValue) <= min)"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
      <button 
        type="button" 
        class="hixns-input__number-btn"
        @click="increment"
        :disabled="disabled || (max !== null && Number(modelValue) >= max)"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>
    
    <button
      v-if="showClear && modelValue"
      type="button"
      class="hixns-input__clear"
      @click="onClear"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    
    <span v-if="$slots.right || rightIcon" class="hixns-input__icon">
      <slot name="right">
        <span v-if="rightIcon">{{ rightIcon }}</span>
      </slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string | number
  type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'textarea' | 'tel' | 'url'
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  leftIcon?: string
  rightIcon?: string
  rows?: number
  error?: string
  autofocus?: boolean
  min?: number | null
  max?: number | null
  step?: number
  showNumberControls?: boolean
}>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  clearable: false,
  leftIcon: '',
  rightIcon: '',
  rows: 3,
  error: '',
  autofocus: false,
  min: null,
  max: null,
  step: 1,
  showNumberControls: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'focus': [e: FocusEvent]
  'blur': [e: FocusEvent]
  'enter': [e: KeyboardEvent]
  'clear': []
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const showClear = computed(() => props.clearable && props.modelValue)

function onInput(e: Event) {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', props.type === 'number' ? Number(target.value) : target.value)
}

function onFocus(e: FocusEvent) {
  emit('focus', e)
}

function onBlur(e: FocusEvent) {
  emit('blur', e)
}

function onEnter(e: KeyboardEvent) {
  emit('enter', e)
}

function onClear() {
  emit('update:modelValue', '')
  emit('clear')
  nextTick(() => {
    if (inputRef.value) inputRef.value.focus()
    if (textareaRef.value) textareaRef.value.focus()
  })
}

function increment() {
  if (props.type === 'number') {
    const current = Number(props.modelValue) || 0
    const newValue = current + props.step
    if (props.max === null || newValue <= props.max) {
      emit('update:modelValue', newValue)
    }
  }
}

function decrement() {
  if (props.type === 'number') {
    const current = Number(props.modelValue) || 0
    const newValue = current - props.step
    if (props.min === null || newValue >= props.min) {
      emit('update:modelValue', newValue)
    }
  }
}

defineExpose({
  focus: () => {
    if (inputRef.value) inputRef.value.focus()
    if (textareaRef.value) textareaRef.value.focus()
  },
  blur: () => {
    if (inputRef.value) inputRef.value.blur()
    if (textareaRef.value) textareaRef.value.blur()
  },
})
</script>

<style scoped>
/* Styles are in enhancements.css */
.hixns-input--error {
  border-color: var(--error);
}

.hixns-input--error:focus-within {
  box-shadow: 0 0 8px rgba(255, 69, 58, 0.3), inset 0 0 8px rgba(255, 69, 58, 0.05);
}

.hixns-input__field--has-right {
  padding-right: var(--space-1);
}
</style>
