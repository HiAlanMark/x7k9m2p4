<template>
  <div class="hixns-input" :class="{ 'hixns-input--error': error }">
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
      :class="['hixns-input__field', { 'hixns-input__field--has-right': showClear || $slots.right }]"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @keydown.enter="onEnter"
    />
    
    <textarea
      v-else
      ref="textareaRef"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      class="hixns-textarea"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
    />
    
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
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
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
  emit('update:modelValue', target.value)
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
