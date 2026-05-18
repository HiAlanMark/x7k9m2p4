<template>
  <div class="hixns-select" :class="{ 'hixns-select--disabled': disabled, 'hixns-select--open': isOpen }">
    <!-- 触发区域 -->
    <div 
      ref="triggerRef"
      class="hixns-select__trigger"
      @click="toggle"
    >
      <span class="hixns-select__value">{{ displayValue }}</span>
      <span class="hixns-select__arrow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </span>
    </div>
    
    <!-- 下拉选项 -->
    <div 
      v-if="isOpen"
      ref="dropdownRef"
      class="hixns-select__dropdown"
      :style="dropdownStyle"
    >
      <div
        v-for="opt in options"
        :key="opt.value"
        class="hixns-select__option"
        :class="{ 'hixns-select__option--selected': opt.value === modelValue }"
        @click="selectOption(opt)"
      >
        {{ opt.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

interface Option {
  value: string | number
  label: string
}

const props = withDefaults(defineProps<{
  modelValue?: string | number
  options?: Option[]
  placeholder?: string
  disabled?: boolean
}>(), {
  modelValue: '',
  options: () => [],
  placeholder: '请选择',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'change': [value: string | number]
}>()

const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const dropdownStyle = ref<Record<string, string>>({})

const displayValue = computed(() => {
  if (!props.modelValue) return props.placeholder
  const selected = props.options.find(o => o.value === props.modelValue)
  return selected?.label || props.placeholder
})

function toggle() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    setTimeout(updateDropdownPosition, 0)
  }
}

function selectOption(option: Option) {
  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
}

function updateDropdownPosition() {
  if (!triggerRef.value || !dropdownRef.value) return
  
  const triggerRect = triggerRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const dropdownHeight = Math.min(props.options.length * 40, 240)
  
  const spaceBelow = viewportHeight - triggerRect.bottom
  const spaceAbove = triggerRect.top
  
  if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
    dropdownStyle.value = {
      bottom: '100%',
      left: '0',
      right: '0',
      marginBottom: '4px',
    }
  } else {
    dropdownStyle.value = {
      top: '100%',
      left: '0',
      right: '0',
      marginTop: '4px',
    }
  }
}

function handleClickOutside(e: MouseEvent) {
  if (triggerRef.value && !triggerRef.value.contains(e.target as Node) &&
      dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.hixns-select {
  position: relative;
  width: 100%;
}

.hixns-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  min-height: 38px;
  padding: 8px 12px;
  
  background: var(--glass-bg);
  backdrop-filter: blur(var(--blur-base)) saturate(var(--saturate));
  -webkit-backdrop-filter: blur(var(--blur-base)) saturate(var(--saturate));
  
  border: 1px solid var(--border-base);
  border-radius: var(--radius-md);
  
  cursor: pointer;
  transition: all var(--fast);
  
  user-select: none;
}

.hixns-select__trigger:hover {
  background: var(--glass-bg-hover);
  border-color: var(--border-light);
}

.hixns-select--open .hixns-select__trigger {
  border-color: var(--border-focus);
  box-shadow: 
    0 0 0 1px rgba(10, 132, 255, 0.1),
    0 0 8px rgba(10, 132, 255, 0.2),
    inset 0 0 8px rgba(10, 132, 255, 0.05);
  background: var(--glass-strong);
}

.hixns-select__value {
  flex: 1;
  font-family: var(--font-sans);
  font-size: var(--text-base);
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hixns-select__trigger:not(:has(.hixns-select__value:not(:empty))) .hixns-select__value,
.hixns-select__value:has(+ .hixns-select__arrow):empty {
  color: var(--text-tertiary);
}

.hixns-select__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: transform var(--fast);
  flex-shrink: 0;
}

.hixns-select--open .hixns-select__arrow {
  transform: rotate(180deg);
  color: var(--primary);
}

.hixns-select__dropdown {
  position: absolute;
  z-index: 99999;
  min-width: 100%;
  max-height: 240px;
  overflow-y: auto;
  overflow-x: hidden;
  
  /* 增强的高斯模糊背景 - 暗色主题 */
  background: rgba(15, 15, 22, 0.95);
  backdrop-filter: blur(40px) saturate(1.8);
  -webkit-backdrop-filter: blur(40px) saturate(1.8);
  
  border: 1px solid var(--border-focus);
  border-radius: var(--radius-md);
  
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(10, 132, 255, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  
  padding: 4px;
}

/* 亮色主题适配 */
[data-theme="light"] .hixns-select__dropdown {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(10, 132, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.hixns-select__dropdown::-webkit-scrollbar {
  width: 4px;
}

.hixns-select__dropdown::-webkit-scrollbar-track {
  background: transparent;
}

.hixns-select__dropdown::-webkit-scrollbar-thumb {
  background: var(--border-light);
  border-radius: 2px;
}

.hixns-select__option {
  padding: 8px 12px;
  font-family: var(--font-sans);
  font-size: var(--text-base);
  color: var(--text-primary);
  border-radius: 4px;
  cursor: pointer;
  transition: all var(--fast);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hixns-select__option:hover {
  background: var(--primary-light);
  color: var(--text-primary);
}

.hixns-select__option--selected {
  background: var(--primary);
  color: #fff;
  font-weight: var(--font-medium);
}

/* 亮色主题适配 */
[data-theme="light"] .hixns-select__option:hover {
  background: rgba(10, 132, 255, 0.15);
}

[data-theme="light"] .hixns-select__option--selected {
  background: var(--primary);
  color: #fff;
}

.hixns-select--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hixns-select--disabled .hixns-select__trigger {
  cursor: not-allowed;
}
</style>
