import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { ChatMessage, ToolCallInfo } from '@/types'

export type ProviderMode = 'gfw' | 'custom'

export interface CustomProvider {
  name: string
  baseUrl: string
  apiKey: string
  model: string
}

const DEFAULT_GFW_BASE = 'https://api.gfw.net/v1'

export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([])
  const isStreaming = ref(false)
  const currentResponse = ref('')
  const currentToolCalls = ref<ToolCallInfo[]>([])
  const selectedModel = ref('gpt-4o-mini')

  // Provider 模式
  const providerMode = ref<ProviderMode>(
    (localStorage.getItem('hermes_provider_mode') as ProviderMode) || 'gfw'
  )

  const customProvider = ref<CustomProvider>({
    name: localStorage.getItem('hermes_custom_name') || '',
    baseUrl: localStorage.getItem('hermes_custom_base_url') || '',
    apiKey: localStorage.getItem('hermes_custom_api_key') || '',
    model: localStorage.getItem('hermes_custom_model') || '',
  })

  // 获取当前生效的 API 配置
  function getActiveConfig() {
    if (providerMode.value === 'custom' && customProvider.value.baseUrl && customProvider.value.apiKey) {
      return {
        baseUrl: customProvider.value.baseUrl,
        apiKey: customProvider.value.apiKey,
        model: customProvider.value.model || 'gpt-4o-mini',
      }
    }
    return {
      baseUrl: DEFAULT_GFW_BASE,
      apiKey: localStorage.getItem('gfw_api_key') || '',
      model: selectedModel.value,
    }
  }

  function setProviderMode(mode: ProviderMode) {
    providerMode.value = mode
    localStorage.setItem('hermes_provider_mode', mode)
  }

  function setCustomProvider(provider: CustomProvider) {
    customProvider.value = { ...provider }
    localStorage.setItem('hermes_custom_name', provider.name)
    localStorage.setItem('hermes_custom_base_url', provider.baseUrl)
    localStorage.setItem('hermes_custom_api_key', provider.apiKey)
    localStorage.setItem('hermes_custom_model', provider.model)
  }

  function addUserMessage(content: string) {
    messages.value.push({
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    })
  }

  function addSystemMessage(content: string) {
    messages.value.push({
      id: generateId(),
      role: 'system',
      content,
      timestamp: new Date().toISOString(),
    })
  }

  function startAssistantResponse() {
    isStreaming.value = true
    currentResponse.value = ''
    currentToolCalls.value = []
  }

  function appendToResponse(content: string) {
    currentResponse.value += content
  }

  function addToolCall(tool: string, input: Record<string, unknown>) {
    currentToolCalls.value.push({ tool, input, status: 'running' })
  }

  function completeToolCall(index: number, output: string, status: 'completed' | 'failed') {
    if (currentToolCalls.value[index]) {
      currentToolCalls.value[index].output = output
      currentToolCalls.value[index].status = status
    }
  }

  function finishResponse(tokenUsage?: Record<string, number>, model?: string, durationMs?: number) {
    messages.value.push({
      id: generateId(),
      role: 'assistant',
      content: currentResponse.value,
      timestamp: new Date().toISOString(),
      tool_calls: currentToolCalls.value.length > 0 ? [...currentToolCalls.value] : undefined,
      token_usage: tokenUsage,
      model,
      duration_ms: durationMs,
    })
    isStreaming.value = false
    currentResponse.value = ''
    currentToolCalls.value = []
  }

  function clearMessages() {
    messages.value = []
  }

  return {
    messages, isStreaming, currentResponse, currentToolCalls, selectedModel,
    providerMode, customProvider,
    getActiveConfig, setProviderMode, setCustomProvider,
    addUserMessage, addSystemMessage, startAssistantResponse, appendToResponse,
    addToolCall, completeToolCall, finishResponse, clearMessages,
  }
})

function generateId() {
  return 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
}
