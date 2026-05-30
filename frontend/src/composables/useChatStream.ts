import { ref, onBeforeUnmount } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useAppStore } from '@/stores/app'
import { isBrowserMode, browserChat, hermesCancel, generateTitle } from '@/api'
import * as api from '@/api'
import type { ToolCallInfo } from '@/types'

/**
 * Composable for managing chat streaming state and lifecycle.
 *
 * Extracts SSE/streaming logic from ChatView, including:
 * - isConnecting / agentStatus / agentIteration / agentMaxIter refs
 * - pendingApproval state
 * - startStreaming / stopStreaming functions
 * - Tool call tracking via chat store
 */
export function useChatStream() {
  const chatStore = useChatStore()
  const appStore = useAppStore()

  // Local reactive state
  const isConnecting = ref(false)
  const agentStatus = ref('')
  const agentIteration = ref(0)
  const agentMaxIter = ref(0)
  const pendingApproval = ref<{ id: string; tool: string; command: string; reason: string } | null>(null)
  const approvalReply = ref('')

  // Streaming timing
  const streamElapsed = ref('0.0')
  let streamTimer: ReturnType<typeof setInterval> | null = null

  // Start the stream timer when streaming begins
  function startStreamTimer() {
    stopStreamTimer()
    streamTimer = setInterval(() => {
      if (chatStore.streamStartTime) {
        streamElapsed.value = ((Date.now() - chatStore.streamStartTime) / 1000).toFixed(1)
      }
    }, 100)
  }

  function stopStreamTimer() {
    if (streamTimer) {
      clearInterval(streamTimer)
      streamTimer = null
    }
    streamElapsed.value = '0.0'
  }

  /**
   * Start a streaming chat request.
   * @param content  The user message text
   * @param selectedModel  The model to use
   * @param options  Callbacks and context
   */
  async function startStreaming(
    content: string,
    selectedModel: string,
    options?: {
      history?: Array<{ role: string; content: string }>
      onDone?: (fullText: string, usage: Record<string, number>, config: { baseUrl: string; apiKey: string; model: string }) => void
      onError?: (err: string) => void
      onAutoTitle?: (userText: string, aiReply: string, config: { baseUrl: string; apiKey: string; model: string }) => void
    },
  ) {
    const config = chatStore.getActiveConfig()

    // If agent is not running in non-browser mode, start it
    if (!isBrowserMode() && !appStore.agentRunning) {
      isConnecting.value = true
      try {
        await api.agentStart('')
        appStore.agentRunning = true
      } catch (e: unknown) {
        chatStore.addSystemMessage('Agent start failed: ' + e)
        isConnecting.value = false
        options?.onError?.(String(e))
        return
      }
      isConnecting.value = false
    }

    chatStore.startAssistantResponse()
    startStreamTimer()

    if (isBrowserMode()) {
      await browserChat(
        content,
        selectedModel,
        // onChunk
        (chunk) => chatStore.appendToResponse(chunk),
        // onDone
        (fullText, usage) => {
          agentStatus.value = ''
          agentIteration.value = 0
          stopStreamTimer()
          chatStore.finishResponse(usage, config.model, undefined, fullText)
          options?.onDone?.(fullText, usage, config)
          // Auto-generate title on first message
          if (options?.onAutoTitle) {
            options.onAutoTitle(content, fullText, config)
          }
        },
        // onError
        (err) => {
          agentStatus.value = ''
          stopStreamTimer()
          chatStore.finishResponse()
          chatStore.addSystemMessage(`Error: ${err}`)
          options?.onError?.(err)
        },
        config,
        // onToolCall
        (tool, args) => { chatStore.addToolCall(tool, args) },
        // onToolResult
        (tool, result, duration) => {
          const idx = chatStore.currentToolCalls.findIndex(tc => tc.tool === tool && tc.status === 'running')
          if (idx >= 0) chatStore.completeToolCall(idx, result.substring(0, 500), 'completed')
        },
        options?.history || [],
        // onStatus
        (message, iteration, maxIterations) => {
          agentStatus.value = message
          agentIteration.value = iteration
          agentMaxIter.value = maxIterations
        },
        // onApproval
        (id, tool, command, reason) => {
          pendingApproval.value = { id, tool, command, reason }
        },
        // sessionId
        chatStore.getHermesSessionId(),
        // onSessionId
        (sid) => { chatStore.setHermesSessionId(sid) },
      )
    } else {
      try {
        await api.agentSendMessage(content, selectedModel)
      } catch (e) {
        console.warn('[useChatStream] agentSendMessage failed:', e)
        stopStreamTimer()
        chatStore.finishResponse()
        options?.onError?.(String(e))
      }
    }
  }

  /**
   * Stop the current streaming request.
   */
  async function stopStreaming() {
    try {
      await hermesCancel()
    } catch { /* ignore */ }
    agentStatus.value = ''
    stopStreamTimer()
    chatStore.finishResponse()
  }

  /**
   * Approve the current pending command.
   */
  async function approveCommand() {
    if (!pendingApproval.value) return
    const { id } = pendingApproval.value
    pendingApproval.value = null
    try {
      await api.agentPost('/v1/agent/approve', { id, approved: true })
    } catch (e) { console.warn('[useChatStream] approveCommand failed:', e) }
  }

  /**
   * Deny the current pending command.
   */
  async function denyCommand() {
    if (!pendingApproval.value) return
    const { id } = pendingApproval.value
    const reason = approvalReply.value.trim() || 'User denied'
    pendingApproval.value = null
    approvalReply.value = ''
    try {
      await api.agentPost('/v1/agent/approve', { id, approved: false, reason })
    } catch (e) { console.warn('[useChatStream] denyCommand failed:', e) }
    chatStore.addSystemMessage(reason)
  }

  /**
   * Reply to approval with feedback (doesn't clear pendingApproval for multi-round iteration).
   */
  async function replyApproval() {
    if (!pendingApproval.value || !approvalReply.value.trim()) return
    const { id } = pendingApproval.value
    const reason = approvalReply.value.trim()
    approvalReply.value = ''
    try {
      await api.agentPost('/v1/agent/approve', { id, approved: false, reason })
    } catch (e) { console.warn('[useChatStream] replyApproval failed:', e) }
    chatStore.addSystemMessage('Reply feedback: ' + reason)
  }

  /**
   * Cancel the execution entirely, including denying any pending approval.
   */
  async function cancelExecution(systemMessage: string = 'Execution stopped') {
    try {
      if (pendingApproval.value) {
        const { id } = pendingApproval.value
        pendingApproval.value = null
        api.agentPost('/v1/agent/approve', { id, approved: false, reason: 'User cancelled' }).catch(() => {})
      }
      await hermesCancel()
      agentStatus.value = ''
      stopStreamTimer()
      chatStore.finishResponse()
      chatStore.addSystemMessage(systemMessage)
    } catch (e) { console.warn('[useChatStream] cancelExecution failed:', e) }
  }

  /**
   * Auto-generate a session title after the first assistant response.
   */
  async function autoGenerateTitle(userText: string, aiReply: string, config: { baseUrl: string; apiKey: string; model: string }) {
    const session = chatStore.currentSession
    if (!session) return
    const userCount = session.messages.filter(m => m.role === 'user').length
    if (userCount !== 1) return
    const firstUser = session.messages.find(m => m.role === 'user')
    if (!firstUser) return
    const defaultTitle = firstUser.content.trim().length > 30
      ? firstUser.content.trim().substring(0, 30) + '...'
      : firstUser.content.trim()
    if (session.title !== defaultTitle && session.title !== '新会话') return
    try {
      const title = await generateTitle(userText, aiReply, config)
      if (title && title.length >= 2) {
        chatStore.renameSession(session.id, title)
      }
    } catch (e) { console.warn('[useChatStream] autoGenerateTitle failed:', e) }
  }

  // Cleanup on unmount
  onBeforeUnmount(() => {
    stopStreamTimer()
  })

  return {
    // Reactive state
    isConnecting,
    agentStatus,
    agentIteration,
    agentMaxIter,
    pendingApproval,
    approvalReply,
    streamElapsed,

    // Methods
    startStreaming,
    stopStreaming,
    approveCommand,
    denyCommand,
    replyApproval,
    cancelExecution,
    autoGenerateTitle,
  }
}
