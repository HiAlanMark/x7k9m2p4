import { ref, watch } from 'vue'

/**
 * Composable for managing tool trace panel visibility.
 *
 * - toolTraceVisible ref (default false, persisted to localStorage)
 * - toggleToolTrace() function
 *
 * This replaces any inline tool trace visibility logic.
 */

const STORAGE_KEY = 'hixns_tool_trace_visible'

function loadFromStorage(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw !== null) return raw === 'true'
  } catch { /* ignore */ }
  return false
}

// Module-level singleton so state is shared across all callers
const toolTraceVisible = ref<boolean>(loadFromStorage())

// Persist to localStorage whenever it changes
watch(toolTraceVisible, (val) => {
  try {
    localStorage.setItem(STORAGE_KEY, String(val))
  } catch { /* ignore */ }
})

// Listen for storage changes from other tabs/windows
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue !== null) {
      const parsed = e.newValue === 'true'
      if (toolTraceVisible.value !== parsed) {
        toolTraceVisible.value = parsed
      }
    }
  })
}

export function useToolTrace() {
  /**
   * Toggle the tool trace panel visibility.
   */
  function toggleToolTrace() {
    toolTraceVisible.value = !toolTraceVisible.value
  }

  /**
   * Explicitly set tool trace visibility.
   */
  function setToolTraceVisible(visible: boolean) {
    toolTraceVisible.value = visible
  }

  return {
    toolTraceVisible,
    toggleToolTrace,
    setToolTraceVisible,
  }
}
