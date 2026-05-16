<template>
  <div class="hixns-select-wrap" :class="{ focused, error: !!error, disabled }">
    <label v-if="label" class="hixns-select-label" :for="selectId">{{ label }}</label>
    <div class="hixns-select-inner">
      <select
        :id="selectId"
        ref="selectRef"
        :value="modelValue"
        :disabled="disabled"
        @change="onChange"
        @focus="onFocus"
        @blur="onBlur"
        class="hixns-select"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <slot />
      </select>
      <svg class="hixns-select-arrow" width="12" height="12" viewBox="0 0 1024 1024" fill="currentColor">
        <path d="M256 341.333333a42.666667 42.666667 0 0 0-30.165333 12.501334 42.666667 42.666667 0 0 0 0 60.330666l256 256a42.666667 42.666667 0 0 0 60.330666 0l256-256a42.666667 42.666667 0 0 0 0-60.330666 42.666667 42.666667 0 0 0-60.330666 0L512 579.669333 286.165333 353.834667A42.666667 42.666667 0 0 0 256 341.333333z"/>
      </svg>
    </div>
    <p v-if="error" class="hixns-select-error">{{ error }}</p>
    <p v-else-if="hint" class="hixns-select-hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  error?: string
  hint?: string
  id?: string
}>(), {
  modelValue: '',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: []
  blur: []
}>()

const selectRef = ref<HTMLSelectElement>()
const focused = ref(false)
const selectId = computed(() => props.id || `hx-select-${Math.random().toString(36).slice(2, 8)}`)

function onChange(e: Event) {
  emit('update:modelValue', (e.target as HTMLSelectElement).value)
}
function onFocus() { focused.value = true; emit('focus') }
function onBlur() { focused.value = false; emit('blur') }
</script>

<style scoped>
.hixns-select-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.hixns-select-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  user-select: none;
}

.hixns-select-inner {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
  padding: 0 12px;
  transition: all 0.2s var(--spring-smooth);
}

.hixns-select-wrap.focused .hixns-select-inner {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.hixns-select-wrap.error .hixns-select-inner {
  border-color: var(--color-error);
}

.hixns-select-wrap.disabled .hixns-select-inner {
  opacity: 0.5;
  cursor: not-allowed;
}

.hixns-select {
  flex: 1;
  min-width: 0;
  padding: 8px 24px 8px 0;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-family);
  font-size: 13px;
  color: var(--color-text-primary);
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
}

.hixns-select:disabled {
  cursor: not-allowed;
}

.hixns-select-arrow {
  position: absolute;
  right: 12px;
  color: var(--color-text-tertiary);
  pointer-events: none;
  transition: transform 0.2s var(--spring-bounce);
}

.hixns-select-wrap.focused .hixns-select-arrow {
  transform: rotate(180deg);
  color: var(--color-primary);
}

.hixns-select-error {
  font-size: 11px;
  color: var(--color-error);
  margin: 0;
}

.hixns-select-hint {
  font-size: 11px;
  color: var(--color-text-tertiary);
  margin: 0;
}
</style>
