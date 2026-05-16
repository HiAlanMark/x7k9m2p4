<template>
  <div class="hixns-textarea-wrap" :class="{ focused, error: !!error, disabled }">
    <label v-if="label" class="hixns-textarea-label" :for="areaId">{{ label }}</label>
    <div class="hixns-textarea-inner">
      <textarea
        :id="areaId"
        ref="areaRef"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :rows="rows"
        :maxlength="maxlength"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        class="hixns-textarea"
      />
      <span v-if="maxlength" class="hixns-textarea-count">
        {{ (modelValue || '').length }}/{{ maxlength }}
      </span>
    </div>
    <p v-if="error" class="hixns-textarea-error">{{ error }}</p>
    <p v-else-if="hint" class="hixns-textarea-hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  error?: string
  hint?: string
  rows?: number
  maxlength?: number
  id?: string
}>(), {
  modelValue: '',
  disabled: false,
  readonly: false,
  rows: 3,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: []
  blur: []
}>()

const areaRef = ref<HTMLTextAreaElement>()
const focused = ref(false)
const areaId = computed(() => props.id || `hx-textarea-${Math.random().toString(36).slice(2, 8)}`)

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
}
function onFocus() { focused.value = true; emit('focus') }
function onBlur() { focused.value = false; emit('blur') }

defineExpose({ focus: () => areaRef.value?.focus(), blur: () => areaRef.value?.blur() })
</script>

<style scoped>
.hixns-textarea-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.hixns-textarea-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  user-select: none;
}

.hixns-textarea-inner {
  position: relative;
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
  padding: 10px 12px;
  transition: all 0.3s var(--ease-out-expo);
}

.hixns-textarea-wrap.focused .hixns-textarea-inner {
  border-color: var(--color-border-glow);
  box-shadow: var(--shadow-glow-sm);
  background: var(--color-bg-card);
}

.hixns-textarea-wrap.error .hixns-textarea-inner {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(255,69,58,0.1);
}

.hixns-textarea-wrap.disabled .hixns-textarea-inner {
  opacity: 0.5;
  cursor: not-allowed;
}

.hixns-textarea {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-family);
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text-primary);
  resize: vertical;
  min-height: 0;
}

.hixns-textarea::placeholder {
  color: var(--color-text-tertiary);
}

.hixns-textarea:disabled {
  cursor: not-allowed;
}

.hixns-textarea-count {
  position: absolute;
  bottom: 6px;
  right: 10px;
  font-size: 10px;
  font-family: var(--font-mono);
  color: var(--color-text-tertiary);
  pointer-events: none;
}

.hixns-textarea-error {
  font-size: 11px;
  color: var(--color-error);
  margin: 0;
}

.hixns-textarea-hint {
  font-size: 11px;
  color: var(--color-text-tertiary);
  margin: 0;
}
</style>
