<template>
  <div class="hixns-textarea-wrap" :class="[variantClass, { focused, error: !!error, disabled, 'auto-resize': autoResize }]">
    <label v-if="label" class="hixns-textarea-label" :for="areaId">{{ label }}</label>
    <div class="hixns-textarea-inner" :class="{ 'inline-inner': inline }">
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
        @keydown="onKeydown"
        class="hixns-textarea"
      />
      <span v-if="maxlength" class="hixns-textarea-count">
        {{ (modelValue || '').length }}/{{ maxlength }}
      </span>
    </div>
    <p v-if="error" class="hixns-textarea-error">{{ error }}</p>
    <p v-else-if="hint && !inline" class="hixns-textarea-hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'

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
  autoResize?: boolean
  maxHeight?: number
  inline?: boolean
  variant?: 'default' | 'chat'
}>(), {
  modelValue: '',
  disabled: false,
  readonly: false,
  rows: 3,
  autoResize: false,
  maxHeight: 200,
  inline: false,
  variant: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: []
  blur: []
  keydown: [e: KeyboardEvent]
}>()

const areaRef = ref<HTMLTextAreaElement>()
const focused = ref(false)
const areaId = computed(() => props.id || `hx-textarea-${Math.random().toString(36).slice(2, 8)}`)

const variantClass = computed(() => `variant-${props.variant}`)

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
  if (props.autoResize) adjustHeight()
}

function onFocus() { focused.value = true; emit('focus') }
function onBlur() { focused.value = false; emit('blur') }
function onKeydown(e: KeyboardEvent) { emit('keydown', e) }

function adjustHeight() {
  const el = areaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, props.maxHeight) + 'px'
}

watch(() => props.modelValue, () => {
  if (props.autoResize) nextTick(adjustHeight)
})

onMounted(() => {
  if (props.autoResize) adjustHeight()
})

defineExpose({ 
  focus: () => areaRef.value?.focus(), 
  blur: () => areaRef.value?.blur(),
  textarea: areaRef 
})
</script>

<style scoped>
.hixns-textarea-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.hixns-textarea-wrap.inline {
  width: auto;
}

.hixns-textarea-wrap.auto-resize .hixns-textarea {
  resize: none;
  overflow-y: auto;
}

/* Default variant */
.hixns-textarea-inner {
  position: relative;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--blur-base)) saturate(var(--saturate));
  -webkit-backdrop-filter: blur(var(--blur-base)) saturate(var(--saturate));
  border: 1px solid var(--border-base);
  border-radius: var(--radius-md);
  padding: 10px 12px;
  transition: border-color var(--fast), box-shadow var(--fast);
}

/* Inline variant - no wrapper styling, for embedding in custom containers */
.hixns-textarea-inner.inline-inner {
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border: none;
  border-radius: 0;
  padding: 0;
  transition: none;
}

.hixns-textarea-wrap.focused .hixns-textarea-inner:not(.inline-inner) {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 10%, transparent);
}

.hixns-textarea-wrap.error .hixns-textarea-inner {
  border-color: var(--error);
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
  color: var(--text-primary);
  resize: vertical;
  min-height: 0;
}

.hixns-textarea::placeholder {
  color: var(--text-tertiary);
}

.hixns-textarea:disabled {
  cursor: not-allowed;
}

/* Chat variant - larger text, Noto Sans SC, specific sizing */
.variant-chat .hixns-textarea {
  font-size: 14px;
  font-family: 'Noto Sans SC', var(--font-sans), sans-serif;
  line-height: 1.5;
  padding: 0;
  resize: none;
  min-height: 22px;
  max-height: 120px;
}

.variant-chat .hixns-textarea::placeholder {
  font-family: 'Noto Sans SC', var(--font-sans), sans-serif;
}

.hixns-textarea-count {
  position: absolute;
  bottom: 6px;
  right: 10px;
  font-size: 10px;
  font-family: var(--font-mono);
  color: var(--text-tertiary);
  pointer-events: none;
}

.hixns-textarea-error {
  font-size: 11px;
  color: var(--error);
  margin: 0;
}

.hixns-textarea-hint {
  font-size: 11px;
  color: var(--text-tertiary);
  margin: 0;
}
</style>
