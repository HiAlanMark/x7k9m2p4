import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GroupChat, GroupAgent, GroupMessage } from '@/types'
import { useChatStore } from './chat'
import {
  groupChatsList,
  groupChatsCreate,
  groupChatDetail,
  groupChatDelete,
  groupChatAddAgent,
  groupChatRemoveAgent,
  groupChatMessages,
  groupChatSendMessage,
} from '@/api'

function mapGroup(g: any): GroupChat {
  return {
    id: g.id,
    name: g.name,
    createdAt: g.created_at,
    updatedAt: g.updated_at,
    agentCount: g.agent_count,
  }
}

function mapAgent(a: any): GroupAgent {
  return {
    id: a.id,
    groupId: a.group_id ?? '',
    name: a.name,
    model: a.model,
    provider: a.provider ?? '',
    systemPrompt: a.system_prompt,
    color: a.color,
    createdAt: a.created_at,
  }
}

function mapMessage(m: any): GroupMessage {
  return {
    id: m.id,
    groupId: m.group_id,
    agentId: m.agent_id,
    role: m.role,
    content: m.content,
    timestamp: m.timestamp,
    mentions: m.mentions,
  }
}

export const useGroupChatStore = defineStore('groupChat', () => {
  // ── State ──
  const groups = ref<GroupChat[]>([])
  const activeGroupId = ref<string | null>(null)
  const agents = ref<GroupAgent[]>([])
  const messages = ref<GroupMessage[]>([])
  const loading = ref(false)
  const sending = ref(false)
  const error = ref<string | null>(null)

  // ── Computed ──
  const activeGroup = computed(() =>
    groups.value.find(g => g.id === activeGroupId.value) ?? null,
  )

  const agentMap = computed(() => {
    const map = new Map<string, GroupAgent>()
    for (const a of agents.value) {
      map.set(a.id, a)
    }
    return map
  })

  // ── Actions ──
  async function fetchGroups() {
    loading.value = true
    error.value = null
    try {
      const res = await groupChatsList()
      groups.value = res.groups.map(mapGroup)
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch groups'
    } finally {
      loading.value = false
    }
  }

  async function createGroup(
    name: string,
    agentDefs: Array<{ name: string; model: string; provider: string; system_prompt: string; color?: string }>,
  ) {
    loading.value = true
    error.value = null
    try {
      const res = await groupChatsCreate(name, agentDefs)
      const newGroup: GroupChat = {
        id: res.group.id,
        name: res.group.name,
        createdAt: res.group.created_at,
        updatedAt: res.group.updated_at,
        agentCount: res.group.agents.length,
        agents: res.group.agents.map(mapAgent),
      }
      groups.value.unshift(newGroup)
      activeGroupId.value = newGroup.id
      agents.value = newGroup.agents ?? []
      messages.value = []
      return newGroup
    } catch (e: any) {
      error.value = e.message || 'Failed to create group'
      return null
    } finally {
      loading.value = false
    }
  }

  async function selectGroup(id: string) {
    activeGroupId.value = id
    loading.value = true
    error.value = null
    try {
      const res = await groupChatDetail(id)
      agents.value = res.group.agents.map(mapAgent)
      messages.value = res.group.messages.map(mapMessage)
      // Update group in list
      const idx = groups.value.findIndex(g => g.id === id)
      if (idx >= 0) {
        groups.value[idx] = {
          id: res.group.id,
          name: res.group.name,
          createdAt: res.group.created_at,
          updatedAt: res.group.updated_at,
          agentCount: res.group.agents.length,
        }
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to load group'
    } finally {
      loading.value = false
    }
  }

  async function deleteGroup(id: string) {
    loading.value = true
    try {
      await groupChatDelete(id)
      groups.value = groups.value.filter(g => g.id !== id)
      if (activeGroupId.value === id) {
        activeGroupId.value = groups.value.length > 0 ? groups.value[0].id : null
        agents.value = []
        messages.value = []
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to delete group'
    } finally {
      loading.value = false
    }
  }

  async function addAgent(
    groupId: string,
    agent: { name: string; model: string; provider: string; system_prompt: string; color?: string },
  ) {
    try {
      const res = await groupChatAddAgent(groupId, agent)
      const newAgent = mapAgent(res.agent)
      newAgent.groupId = groupId
      agents.value.push(newAgent)
      // Update agent count
      const g = groups.value.find(g => g.id === groupId)
      if (g) g.agentCount = (g.agentCount ?? 0) + 1
      return newAgent
    } catch (e: any) {
      error.value = e.message || 'Failed to add agent'
      return null
    }
  }

  async function removeAgent(groupId: string, agentId: string) {
    try {
      await groupChatRemoveAgent(groupId, agentId)
      agents.value = agents.value.filter(a => a.id !== agentId)
      const g = groups.value.find(g => g.id === groupId)
      if (g) g.agentCount = Math.max(0, (g.agentCount ?? 1) - 1)
    } catch (e: any) {
      error.value = e.message || 'Failed to remove agent'
    }
  }

  async function sendMessage(content: string, mentions: string[] = []) {
    if (!activeGroupId.value || !content.trim()) return
    sending.value = true
    error.value = null

    // Add user message optimistically
    const userMsg: GroupMessage = {
      id: 'local-' + Date.now(),
      groupId: activeGroupId.value,
      agentId: null,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      mentions: mentions.join(','),
    }
    messages.value.push(userMsg)

    try {
      const chatStore = useChatStore()
      const config = chatStore.getActiveConfig()
      const response = await groupChatSendMessage(activeGroupId.value, content, mentions, config)
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No stream body')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed) continue
          if (trimmed.startsWith(':')) continue  // heartbeat comment
          if (!trimmed.startsWith('data: ')) continue
          const data = trimmed.slice(6).trim()
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'agent_response') {
              const agentMsg: GroupMessage = {
                id: 'agent-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
                groupId: activeGroupId.value!,
                agentId: parsed.agent_id,
                role: 'assistant',
                content: parsed.content,
                timestamp: new Date().toISOString(),
                mentions: '',
              }
              messages.value.push(agentMsg)
            }
          } catch {
            // incomplete JSON, skip
          }
        }
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to send message'
    } finally {
      sending.value = false
    }
  }

  async function fetchMessages(groupId: string, limit = 50, offset = 0) {
    try {
      const res = await groupChatMessages(groupId, limit, offset)
      messages.value = res.messages.map(mapMessage)
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch messages'
    }
  }

  function clearActive() {
    activeGroupId.value = null
    agents.value = []
    messages.value = []
  }

  return {
    groups,
    activeGroupId,
    agents,
    messages,
    loading,
    sending,
    error,
    activeGroup,
    agentMap,
    fetchGroups,
    createGroup,
    selectGroup,
    deleteGroup,
    addAgent,
    removeAgent,
    sendMessage,
    fetchMessages,
    clearActive,
  }
})
