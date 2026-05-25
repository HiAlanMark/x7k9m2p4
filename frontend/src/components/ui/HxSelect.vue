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
    
    <!-- 下拉选项 - 使用 Teleport 渲染到 body 避免父容器影响 -->
    <Teleport to="body" :disabled="false">
      <div 
        v-show="isOpen"
        ref="dropdownRef"
        class="hixns-select__dropdown"
        :style="dropdownStyle"
        @click.stop
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
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

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
    nextTick(() => {
      updateDropdownPosition()
    })
  }
}

function selectOption(option: Option) {
  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
}

function updateDropdownPosition() {
  if (!triggerRef.value || !dropdownRef.value) return
  
  const rect = triggerRef.value.getBoundingClientRect()
  const dropdownHeight = Math.min(props.options.length * 40, 240)
  const spaceBelow = window.innerHeight - rect.bottom
  
  // 计算位置：相对于视口
  let top: number
  if (spaceBelow < dropdownHeight && rect.top > dropdownHeight + 8) {
    // 向上展开
    top = rect.top - dropdownHeight - 4
  } else {
    // 向下展开
    top = rect.bottom + 4
  }
  
  // 确保不超出视口
  top = Math.max(8, Math.min(top, window.innerHeight - dropdownHeight - 8))
  
  dropdownStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    maxWidth: '400px',
  }
}

function handleClickOutside(e: MouseEvent) {
  if (isOpen.value && triggerRef.value && !triggerRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', updateDropdownPosition, true)
  window.addEventListener('resize', updateDropdownPosition)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', updateDropdownPosition, true)
  window.removeEventListener('resize', updateDropdownPosition)
})
</script>
