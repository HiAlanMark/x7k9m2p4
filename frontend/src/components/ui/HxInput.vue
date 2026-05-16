<template>
  <div class="hixns-input-wrap" :class="{ focused, error: !!error, disabled }">
    <label v-if="label" class="hixns-input-label" :for="inputId">{{ label }}</label>
    <div class="hixns-input-inner">
      <span v-if="$slots.prefix" class="hixns-input-prefix">
        <slot name="prefix" />
      </span>
      <input
        :id="inputId"
        ref="inputRef"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
        class="hixns-input"
      />
      <span v-if="$slots.suffix || clearable" class="hixns-input-suffix">
        <button
          v-if="clearable && modelValue"
          class="hixns-input-clear"
          @click="onClear"
          type="button"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <slot name="suffix" />
      </span>
    </div>
    <p v-if="error" class="hixns-input-error">{{ error }}</p>
    <p v-else-if="hint" class="hixns-input-hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  label?: string
  placeholder?: string
  type?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  error?: string
  hint?: string
  maxlength?: number
  id?: string
}>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  readonly: false,
  clearable: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: []
  blur: []
  keydown: [e: KeyboardEvent]
  clear: []
}>()

const inputRef = ref<HTMLInputElement>()
const focused = ref(false)
const inputId = computed(() => props.id || `hx-input-${Math.random().toString(36).slice(2, 8)}`)

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
function onFocus() { focused.value = true; emit('focus') }
function onBlur() { focused.value = false; emit('blur') }
function onKeydown(e: KeyboardEvent) { emit('keydown', e) }
function onClear() { emit('update:modelValue', ''); emit('clear'); inputRef.value?.focus() }

defineExpose({ focus: () => inputRef.value?.focus(), blur: () => inputRef.value?.blur() })
</script>

<style scoped>
.hixns-input-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.hixns-input-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  user-select: none;
}

.hixns-input-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
  padding: 0 12px;
  transition: all 0.3s var(--ease-out-expo);
}

.hixns-input-wrap.focused .hixns-input-inner {
  border-color: var(--color-border-glow);
  box-shadow: var(--shadow-glow-sm);
  background: var(--color-bg-card);
}

.hixns-input-wrap.error .hixns-input-inner {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(255,69,58,0.1);
}

.hixns-input-wrap.disabled .hixns-input-inner {
  opacity: 0.5;
  cursor: not-allowed;
}

.hixns-input {
  flex: 1;
  min-width: 0;
  padding: 8px 0;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-family);
  font-size: 13px;
  color: var(--color-text-primary);
}

.hixns-input::placeholder {
  color: var(--color-text-tertiary);
}

.hixns-input:disabled {
  cursor: not-allowed;
}

.hixns-input-prefix,
.hixns-input-suffix {
  display: flex;
  align-items: center;
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

.hixns-input-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: none;
  background: var(--color-border);
  color: var(--color-text-tertiary);
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
  transition: all 0.15s;
}
.hixns-input-clear:hover {
  background: var(--color-text-tertiary);
  color: var(--color-text-primary);
}

.hixns-input-error {
  font-size: 11px;
  color: var(--color-error);
  margin: 0;
}

.hixns-input-hint {
  font-size: 11px;
  color: var(--color-text-tertiary);
  margin: 0;
}
</style>
