import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const agentRunning = ref(false)
  const agentPort = ref<number | null>(null)
  const sidebarCollapsed = ref(false)
  const currentView = ref('chat')

  return {
    agentRunning, agentPort, sidebarCollapsed, currentView,
  }
})
