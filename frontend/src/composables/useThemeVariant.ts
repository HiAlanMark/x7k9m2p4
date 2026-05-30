import { ref, watch } from 'vue'

/**
 * Composable for managing theme variant (glass / comic).
 *
 * - themeVariant ref: 'glass' | 'comic' (default 'glass', persisted to localStorage)
 * - setThemeVariant(variant) function
 * - Applies CSS class to document.documentElement: 'theme-glass' or 'theme-comic'
 */

export type ThemeVariant = 'glass' | 'comic'

const STORAGE_KEY = 'hixns_theme_variant'

function loadFromStorage(): ThemeVariant {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'glass' || raw === 'comic') return raw
  } catch { /* ignore */ }
  return 'glass'
}

function applyVariant(variant: ThemeVariant) {
  const el = document.documentElement
  el.classList.remove('theme-glass', 'theme-comic')
  el.classList.add(`theme-${variant}`)
}

// Module-level singleton
const themeVariant = ref<ThemeVariant>(loadFromStorage())

// Apply on initial load
if (typeof document !== 'undefined') {
  applyVariant(themeVariant.value)
}

// Persist & apply whenever it changes
watch(themeVariant, (val) => {
  try {
    localStorage.setItem(STORAGE_KEY, val)
  } catch { /* ignore */ }
  applyVariant(val)
})

// Listen for storage changes from other tabs/windows
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue !== null) {
      const parsed = e.newValue as ThemeVariant
      if (parsed === 'glass' || parsed === 'comic') {
        if (themeVariant.value !== parsed) {
          themeVariant.value = parsed
        }
      }
    }
  })
}

export function useThemeVariant() {
  function setThemeVariant(variant: ThemeVariant) {
    themeVariant.value = variant
  }

  function toggleThemeVariant() {
    themeVariant.value = themeVariant.value === 'glass' ? 'comic' : 'glass'
  }

  return {
    themeVariant,
    setThemeVariant,
    toggleThemeVariant,
  }
}
