import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system'

export const useAppStore = defineStore('app', () => {
  const agentRunning = ref(false)
  const agentPort = ref<number | null>(null)
  const sidebarCollapsed = ref(false)
  const currentView = ref('chat')

  // 主题管理
  const themeMode = ref<ThemeMode>(
    (localStorage.getItem('hermes_theme') as ThemeMode) || 'light'
  )
  const isDark = ref(false)

  function resolveTheme() {
    if (themeMode.value === 'system') {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    } else {
      isDark.value = themeMode.value === 'dark'
    }
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  }

  function setTheme(mode: ThemeMode) {
    themeMode.value = mode
    localStorage.setItem('hermes_theme', mode)
    resolveTheme()
  }

  function toggleTheme() {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  // 监听系统主题变化
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (themeMode.value === 'system') resolveTheme()
    })
    resolveTheme()
  }

  return {
    agentRunning, agentPort, sidebarCollapsed, currentView,
    themeMode, isDark, setTheme, toggleTheme,
  }
})
