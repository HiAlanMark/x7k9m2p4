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
  background: var(--glass-bg);
  border: 1px solid var(--border-base);
  border-radius: 13px;
  transition: background 0.3s var(--ease-out-expo), border-color 0.3s var(--ease-out-expo);
  flex-shrink: 0;
  overflow: hidden;
}

/* 亮色主题 - 轨道默认蓝色 */
[data-theme="light"] .hixns-toggle-track {
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  border-color: color-mix(in srgb, var(--accent) 30%, transparent);
}

.hixns-toggle-track::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    var(--glass-bg-hover) 0%,
    transparent 50%,
    var(--shadow-sm) 100%
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
  background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface) 100%);
  border-radius: 50%;
  box-shadow: 
    var(--shadow-sm),
    0 1px 2px rgba(0, 0, 0, 0.1),
    inset 0 1px 2px rgba(255, 255, 255, 0.8);
  transition: transform 0.4s cubic-bezier(.16, 1, .3, 1), background 0.4s cubic-bezier(.16, 1, .3, 1);
  z-index: 1;
}

.hixns-toggle-input:checked + .hixns-toggle-track {
  background: var(--accent);
  border-color: var(--accent);
  box-shadow: 
    0 0 12px color-mix(in srgb, var(--accent) 50%, transparent),
    0 0 24px color-mix(in srgb, var(--accent) 30%, transparent),
    inset 0 0 8px var(--glass-bg-hover);
}

/* 亮色主题 - 选中状态蓝色 */
[data-theme="light"] .hixns-toggle-input:checked + .hixns-toggle-track {
  background: color-mix(in srgb, var(--accent) 90%, transparent);
  border-color: var(--accent);
  box-shadow: 
    0 0 12px color-mix(in srgb, var(--accent) 40%, transparent),
    0 0 24px color-mix(in srgb, var(--accent) 20%, transparent),
    inset 0 0 8px rgba(255, 255, 255, 0.3);
}

.hixns-toggle-input:checked + .hixns-toggle-track .hixns-toggle-thumb {
  left: 21px;
  background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface) 100%);
  box-shadow: 
    0 2px 6px color-mix(in srgb, var(--accent) 40%, transparent),
    0 1px 3px color-mix(in srgb, var(--accent) 20%, transparent),
    inset 0 1px 2px rgba(255, 255, 255, 0.9);
}

/* 亮色主题 - 选中时滑块带蓝色 */
[data-theme="light"] .hixns-toggle-input:checked + .hixns-toggle-track .hixns-toggle-thumb {
  background: linear-gradient(135deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 70%, var(--bg-surface)) 100%);
  box-shadow: 
    0 2px 6px color-mix(in srgb, var(--accent) 50%, transparent),
    0 1px 3px color-mix(in srgb, var(--accent) 30%, transparent),
    inset 0 1px 2px rgba(255, 255, 255, 0.4);
}

.hixns-toggle:hover .hixns-toggle-track {
  border-color: color-mix(in srgb, var(--accent) 40%, transparent);
}

.hixns-toggle:hover .hixns-toggle-thumb {
  transform: scale(1.05);
}

.hixns-toggle-input:checked + .hixns-toggle-track:hover {
  box-shadow: 
    0 0 16px color-mix(in srgb, var(--accent) 60%, transparent),
    0 0 28px color-mix(in srgb, var(--accent) 40%, transparent),
    inset 0 0 10px var(--glass-bg-hover);
}

.hixns-toggle-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  letter-spacing: 0.2px;
}
</style>
