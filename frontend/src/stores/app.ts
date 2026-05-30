import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
import { getAgentStatus, type AgentStatus } from '@/api'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ConnectionState = 'connected' | 'connecting' | 'disconnected'

export const useAppStore = defineStore('app', () => {
  const agentRunning = ref(false)
  const agentPort = ref<number | null>(null)
  const sidebarCollapsed = ref(false)
  const currentView = ref('chat')

  // 连接状态
  const connectionState = ref<ConnectionState>('disconnected')
  const agentStatus = ref<AgentStatus | null>(null)
  const connectionError = ref('')

  // 主题管理 — 默认跟随系统
  const savedTheme = localStorage.getItem('hermes_theme') as ThemeMode | null
  const themeMode = ref<ThemeMode>(savedTheme || 'system')
  const isDark = ref(false)

  // 计算属性：Hermes 状态
  const hermesStatus = computed(() => {
    if (!agentStatus.value) return null
    return agentStatus.value.hermes
  })

  // 计算属性：格式化 uptime
  const uptimeText = computed(() => {
    if (!agentStatus.value?.uptime) return ''
    const seconds = Math.floor(agentStatus.value.uptime)
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  })

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
    const next = isDark.value ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('hixns_theme_manual', '1')  // 标记手动设置
  }

  // 检测后端连接状态
  async function checkConnection() {
    connectionState.value = 'connecting'
    connectionError.value = ''
    
    try {
      const status = await getAgentStatus()
      
      if (status) {
        connectionState.value = 'connected'
        agentStatus.value = status
        agentRunning.value = true
      } else {
        connectionState.value = 'disconnected'
        connectionError.value = '后端服务未响应'
      }
    } catch (err: any) {
      connectionState.value = 'disconnected'
      connectionError.value = err?.message || '连接失败'
    }
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
    connectionState, agentStatus, connectionError, hermesStatus, uptimeText,
    checkConnection,
  }
})
