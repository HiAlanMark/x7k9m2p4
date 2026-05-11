import type { AgentMessage } from '@/types'

export class WebSocketManager {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private messageHandlers: Map<string, (msg: AgentMessage) => void> = new Map()
  private pendingMessages: string[] = []

  onConnect: (() => void) | null = null
  onDisconnect: (() => void) | null = null
  onError: ((error: Event) => void) | null = null

  async connect(port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = `ws://127.0.0.1:${port}/ws`

      this.ws = new WebSocket(url)

      this.ws.onopen = () => {
        console.log('[WS] Connected to agent')
        this.reconnectAttempts = 0
        this.onConnect?.()
        // 发送待处理消息
        while (this.pendingMessages.length > 0) {
          const msg = this.pendingMessages.shift()
          if (msg && this.ws) {
            this.ws.send(msg)
          }
        }
        resolve()
      }

      this.ws.onmessage = (event) => {
        try {
          const msg: AgentMessage = JSON.parse(event.data)
          this.handleMessage(msg)
        } catch (e) {
          console.error('[WS] Failed to parse message:', e)
        }
      }

      this.ws.onclose = () => {
        console.log('[WS] Disconnected')
        this.onDisconnect?.()
        this.scheduleReconnect(port)
      }

      this.ws.onerror = (error) => {
        console.error('[WS] Error:', error)
        this.onError?.(error)
        reject(error)
      }
    })
  }

  private scheduleReconnect(port: number) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('[WS] Max reconnect attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
    console.log(`[WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`)

    setTimeout(() => {
      this.connect(port).catch(() => {})
    }, delay)
  }

  send(content: string, model?: string): string {
    const msgId = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
    const message = JSON.stringify({
      type: 'chat',
      id: msgId,
      content,
      model,
      attachments: [],
    })

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(message)
    } else {
      this.pendingMessages.push(message)
    }

    return msgId
  }

  cancel(msgId: string) {
    const message = JSON.stringify({ type: 'cancel', id: msgId })
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(message)
    }
  }

  private handleMessage(msg: AgentMessage) {
    const handler = this.messageHandlers.get(msg.id || 'global')
    if (handler) {
      handler(msg)
    }
    // 全局处理器
    this.messageHandlers.get('global')?.(msg)
  }

  onMessage(id: string, handler: (msg: AgentMessage) => void) {
    this.messageHandlers.set(id, handler)
  }

  disconnect() {
    this.ws?.close()
    this.ws = null
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// 单例
export const wsManager = new WebSocketManager()
