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
  gap: 10px;
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
  width: 44px;
  height: 26px;
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: 13px;
  transition: all 0.3s var(--ease-out-expo);
  flex-shrink: 0;
  overflow: hidden;
}

.hixns-toggle-track::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.05) 100%
  );
  border-radius: 13px;
  pointer-events: none;
}

.hixns-toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  border-radius: 50%;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.15),
    0 1px 2px rgba(0, 0, 0, 0.1),
    inset 0 1px 2px rgba(255, 255, 255, 0.8);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 1;
}

.hixns-toggle-input:checked + .hixns-toggle-track {
  background: var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: 
    0 0 12px rgba(10, 132, 255, 0.5),
    0 0 24px rgba(10, 132, 255, 0.3),
    inset 0 0 8px rgba(255, 255, 255, 0.1);
}

.hixns-toggle-input:checked + .hixns-toggle-track .hixns-toggle-thumb {
  left: 21px;
  background: linear-gradient(135deg, #ffffff 0%, #e8f4ff 100%);
  box-shadow: 
    0 2px 6px rgba(10, 132, 255, 0.4),
    0 1px 3px rgba(10, 132, 255, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.9);
}

.hixns-toggle:hover .hixns-toggle-track {
  border-color: rgba(10, 132, 255, 0.4);
}

.hixns-toggle:hover .hixns-toggle-thumb {
  transform: scale(1.05);
}

.hixns-toggle-input:checked + .hixns-toggle-track:hover {
  box-shadow: 
    0 0 16px rgba(10, 132, 255, 0.6),
    0 0 28px rgba(10, 132, 255, 0.4),
    inset 0 0 10px rgba(255, 255, 255, 0.15);
}

.hixns-toggle-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  letter-spacing: 0.2px;
}
</style>
