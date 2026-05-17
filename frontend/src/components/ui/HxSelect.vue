<template>
  <div class="hixns-select" :class="{ 'hixns-select--disabled': disabled, 'hixns-select--open': isOpen }">
    <!-- 触发区域 -->
    <div 
      ref="triggerRef"
      class="hixns-select__trigger"
      :class="{ 'hixns-select__trigger--has-value': modelValue }"
      @click="toggle"
    >
      <span class="hixns-select__value">{{ displayValue || placeholder || '请选择' }}</span>
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
        v-for="option in options"
        :key="option.value"
        class="hixns-select__option"
        :class="{ 'hixns-select__option--selected': option.value === modelValue }"
        @click="selectOption(option)"
      >
        {{ option.label }}
      </div>
    </div>
    
    <!-- 原生 select 隐藏用于表单提交 -->
    <select v-if="name" :name="name" :value="modelValue" style="display:none">
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string | number
  placeholder?: string
  disabled?: boolean
  name?: string
}>(), {
  modelValue: '',
  placeholder: '',
  disabled: false,
  name: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'change': [value: string | number]
}>()

const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const dropdownStyle = ref<Record<string, string>>({})

// 从 slot 获取 options
const slots = defineSlots<{ default?: () => any }>()
const options = computed(() => {
  const children = slots.default?.()
  if (!children || !Array.isArray(children)) return []
  
  return children
    .map((c: any) => {
      // 处理 option 元素
      if (c.props?.value !== undefined) {
        const label = c.props?.label || (c.children && typeof c.children === 'string' ? c.children : String(c.props?.value))
        return {
          value: c.props?.value,
          label: label,
        }
      }
      return null
    })
    .filter((o: any) => o && o.value !== '')
})

const displayValue = computed(() => {
  const selected = options.value.find(o => o.value === props.modelValue)
  return selected?.label || ''
})

function toggle() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    updateDropdownPosition()
  }
}

function selectOption(option: { value: string | number; label: string }) {
  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
}

function updateDropdownPosition() {
  if (!triggerRef.value || !dropdownRef.value) return
  
  const triggerRect = triggerRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  
  // 计算下拉框位置
  const spaceBelow = viewportHeight - triggerRect.bottom
  const spaceAbove = triggerRect.top
  const dropdownHeight = Math.min(options.value.length * 40, 240)
  
  if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
    // 上方空间更多
    dropdownStyle.value = {
      bottom: '100%',
      left: '0',
      right: '0',
      marginBottom: '4px',
    }
  } else {
    // 下方空间足够
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

function handleScroll() {
  if (isOpen.value) {
    updateDropdownPosition()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll, true)
  window.addEventListener('resize', handleScroll)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('resize', handleScroll)
})

watch(isOpen, (val) => {
  if (val) {
    setTimeout(updateDropdownPosition, 0)
  }
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

.hixns-select__trigger--has-value .hixns-select__value {
  color: var(--text-primary);
}

.hixns-select__trigger:not(.hixns-select__trigger--has-value) .hixns-select__value {
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
  z-index: 1000;
  min-width: 100%;
  max-height: 240px;
  overflow-y: auto;
  overflow-x: hidden;
  
  background: var(--glass-strong);
  backdrop-filter: blur(var(--blur-lg)) saturate(var(--saturate));
  -webkit-backdrop-filter: blur(var(--blur-lg)) saturate(var(--saturate));
  
  border: 1px solid var(--border-focus);
  border-radius: var(--radius-md);
  
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(10, 132, 255, 0.1);
  
  padding: 4px;
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

.hixns-select--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hixns-select--disabled .hixns-select__trigger {
  cursor: not-allowed;
}
</style>
