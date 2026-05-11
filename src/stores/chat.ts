import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ChatMessage, ToolCallInfo } from '@/types'

export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([])
  const isStreaming = ref(false)
  const currentResponse = ref('')
  const currentToolCalls = ref<ToolCallInfo[]>([])
  const selectedModel = ref('gpt-4o-mini')

  function addUserMessage(content: string) {
    const msg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }
    messages.value.push(msg)
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
    currentToolCalls.value.push({
      tool,
      input,
      status: 'running',
    })
  }

  function completeToolCall(index: number, output: string, status: 'completed' | 'failed') {
    if (currentToolCalls.value[index]) {
      currentToolCalls.value[index].output = output
      currentToolCalls.value[index].status = status
    }
  }

  function finishResponse(tokenUsage?: Record<string, number>, model?: string, durationMs?: number) {
    const msg: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: currentResponse.value,
      timestamp: new Date().toISOString(),
      tool_calls: currentToolCalls.value.length > 0 ? [...currentToolCalls.value] : undefined,
      token_usage: tokenUsage,
      model,
      duration_ms: durationMs,
    }
    messages.value.push(msg)
    isStreaming.value = false
    currentResponse.value = ''
    currentToolCalls.value = []
  }

  function clearMessages() {
    messages.value = []
  }

  return {
    messages, isStreaming, currentResponse, currentToolCalls, selectedModel,
    addUserMessage, startAssistantResponse, appendToResponse,
    addToolCall, completeToolCall, finishResponse, clearMessages,
  }
})

function generateId() {
  return 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
}
