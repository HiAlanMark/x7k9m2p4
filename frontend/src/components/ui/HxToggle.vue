<template>
  <label class="hixns-toggle" :class="{ 'hixns-toggle--disabled': disabled }">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="onChange"
      class="hixns-toggle-input"
    />
    <span class="hixns-toggle-track">
      <span class="hixns-toggle-thumb" />
    </span>
    <span v-if="label || $slots.default" class="hixns-toggle-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: boolean
  label?: string
  disabled?: boolean
}>(), {
  modelValue: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function onChange(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).checked)
}
</script>

<style scoped>
.hixns-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.hixns-toggle--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.hixns-toggle-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.hixns-toggle-track {
  position: relative;
  width: 38px;
  height: 22px;
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: 11px;
  transition: all 0.25s var(--spring-bounce);
  flex-shrink: 0;
}

.hixns-toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  transition: all 0.25s var(--spring-bounce);
}

.hixns-toggle-input:checked + .hixns-toggle-track {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.hixns-toggle-input:checked + .hixns-toggle-track .hixns-toggle-thumb {
  left: 18px;
}

.hixns-toggle-input:focus-visible + .hixns-toggle-track {
  box-shadow: 0 0 0 2px var(--color-primary-light);
}

.hixns-toggle-label {
  font-size: 13px;
  color: var(--color-text-primary);
}
</style>
