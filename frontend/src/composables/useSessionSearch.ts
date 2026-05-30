import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useChatStore } from '@/stores/chat'
import { sessionSearch as apiSessionSearch, type SessionSearchResponse } from '@/api'
import type { ChatSession } from '@/types'

export interface SessionSearchResult {
  session: ChatSession
  preview: string
  matchType: 'title' | 'content'
}

const isOpen = ref(false)
const query = ref('')
const results = ref<SessionSearchResult[]>([])
const loading = ref(false)
const selectedIndex = ref(0)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

export function useSessionSearch() {
  const chatStore = useChatStore()

  const filteredResults = computed(() => results.value)

  async function searchSessions(q: string) {
    const trimmed = q.trim()
    if (!trimmed) {
      // When query is empty, show all sessions sorted by update time
      results.value = chatStore.sortedSessions.map(s => ({
        session: s,
        preview: getLastMessagePreview(s),
        matchType: 'title' as const,
      }))
      selectedIndex.value = 0
      return
    }

    loading.value = true
    try {
      // ── P0: Use backend FTS5 search first (283+ sessions, full-text indexed) ──
      try {
        const data: SessionSearchResponse = await apiSessionSearch(trimmed, 20, 0)
        if (data.sessions && data.sessions.length > 0) {
          // Map backend results to local session objects
          const mapped: SessionSearchResult[] = []
          for (const srv of data.sessions) {
            // Find matching local session or create a stub
            const local = chatStore.sortedSessions.find(s => s.serverId === srv.id || s.id === srv.id)
            const session: ChatSession = local || {
              id: srv.id,
              serverId: srv.id,
              title: srv.title || '',
              messages: [],
              createdAt: srv.started_at,
              updatedAt: srv.started_at,
            }
            mapped.push({
              session,
              preview: srv.snippet || srv.title || '',
              matchType: srv.snippet ? 'content' : 'title',
            })
          }
          results.value = mapped
          selectedIndex.value = 0
          return  // Backend search succeeded, skip local fallback
        }
      } catch {
        // Backend FTS5 failed — fall back to local search
      }

      // ── Fallback: client-side search over loaded sessions ──
      const lowerQuery = trimmed.toLowerCase()
      try {
        await chatStore.fetchServerSessions()
      } catch {
        // ignore
      }

      const allSessions = chatStore.sortedSessions
      const matched: SessionSearchResult[] = []

      for (const session of allSessions) {
        const titleMatch = session.title.toLowerCase().includes(lowerQuery)
        const contentMatch = session.messages.some(m =>
          m.content.toLowerCase().includes(lowerQuery)
        )

        if (titleMatch || contentMatch) {
          matched.push({
            session,
            preview: getLastMessagePreview(session),
            matchType: titleMatch ? 'title' : 'content',
          })
        }
      }

      results.value = matched
      selectedIndex.value = 0
    } finally {
      loading.value = false
    }
  }

  function getLastMessagePreview(session: ChatSession): string {
    const msgs = session.messages
    if (msgs.length === 0) return ''
    const last = msgs[msgs.length - 1]
    const text = last.content.trim()
    return text.length > 80 ? text.substring(0, 80) + '...' : text
  }

  function debouncedSearch(q: string) {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      searchSessions(q)
    }, 300)
  }

  function openSearch() {
    isOpen.value = true
    query.value = ''
    results.value = []
    selectedIndex.value = 0
    // Show all sessions initially
    searchSessions('')
  }

  function closeSearch() {
    isOpen.value = false
    query.value = ''
    results.value = []
    selectedIndex.value = 0
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
  }

  function selectResult(index: number) {
    selectedIndex.value = index
  }

  function navigateUp() {
    if (selectedIndex.value > 0) {
      selectedIndex.value--
    }
  }

  function navigateDown() {
    if (selectedIndex.value < results.value.length - 1) {
      selectedIndex.value++
    }
  }

  function confirmSelection(): ChatSession | null {
    const result = results.value[selectedIndex.value]
    if (result) {
      return result.session
    }
    return null
  }

  // Global keyboard handler
  function handleGlobalKeydown(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      e.stopPropagation()
      if (isOpen.value) {
        closeSearch()
      } else {
        openSearch()
      }
    }
    if (e.key === 'Escape' && isOpen.value) {
      e.preventDefault()
      closeSearch()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleGlobalKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleGlobalKeydown)
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
  })

  return {
    isOpen,
    query,
    results: filteredResults,
    loading,
    selectedIndex,
    openSearch,
    closeSearch,
    debouncedSearch,
    selectResult,
    navigateUp,
    navigateDown,
    confirmSelection,
  }
}
