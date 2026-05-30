<template>
  <Teleport to="body">
    <transition name="search-modal">
      <div v-if="isOpen" class="session-search-overlay" @click.self="closeSearch">
        <div class="session-search-modal">
          <!-- Search Input -->
          <div class="search-input-wrap">
            <IconSearch :size="20" class="search-icon" />
            <input
              ref="searchInputRef"
              v-model="localQuery"
              type="text"
              class="search-input"
              :placeholder="t('search.placeholder')"
              @input="onInput"
              @keydown.down.prevent="navigateDown"
              @keydown.up.prevent="navigateUp"
              @keydown.enter.prevent="onEnter"
              @keydown.escape.prevent="closeSearch"
            />
            <kbd class="search-kbd">ESC</kbd>
          </div>

          <!-- Results -->
          <div class="search-results" ref="resultsRef">
            <!-- Loading -->
            <div v-if="loading" class="search-empty">
              <div class="search-spinner"></div>
              <span>{{ t('common.loading') }}</span>
            </div>

            <!-- No results -->
            <div v-else-if="results.length === 0 && localQuery.trim()" class="search-empty">
              <IconSearch :size="32" class="search-empty-icon" />
              <span>{{ t('search.no_results') }}</span>
            </div>

            <!-- Results list -->
            <div v-else-if="results.length > 0">
              <div class="results-header">
                <span class="results-count">{{ t('search.sessions_count', { n: results.length }) }}</span>
              </div>
              <div
                v-for="(result, idx) in results"
                :key="result.session.id"
                class="search-result-item"
                :class="{ active: idx === selectedIndex }"
                @click="onSelect(result)"
                @mouseenter="selectResult(idx)"
              >
                <div class="result-main">
                  <div class="result-title-row">
                    <span class="result-title">{{ result.session.title || t('app.renamePlaceholder') }}</span>
                    <span v-if="result.session.messages.length > 0" class="result-model-badge">
                      {{ getModelBadge(result.session) }}
                    </span>
                  </div>
                  <div v-if="result.preview" class="result-preview">{{ result.preview }}</div>
                </div>
                <div class="result-meta">
                  <span class="result-date">{{ formatDate(result.session.updatedAt) }}</span>
                  <span class="result-count">{{ result.session.messages.filter(m => m.role === 'user').length }}</span>
                </div>
              </div>
            </div>

            <!-- Empty initial state (no query yet, no sessions) -->
            <div v-else-if="!localQuery.trim()" class="search-empty">
              <span>{{ t('search.no_results') }}</span>
            </div>
          </div>

          <!-- Footer hint -->
          <div class="search-footer">
            <span class="search-hint">
              <kbd>↑↓</kbd> {{ t('search.navigate', 'Navigate') }}
              <kbd>↵</kbd> {{ t('search.open', 'Open') }}
              <kbd>Esc</kbd> {{ t('search.close', 'Close') }}
            </span>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import { useSessionSearch } from '@/composables/useSessionSearch'
import IconSearch from '@/components/icons/IconSearch.vue'

const { t } = useI18n()
const router = useRouter()
const chatStore = useChatStore()

const {
  isOpen,
  query,
  results,
  loading,
  selectedIndex,
  closeSearch,
  debouncedSearch,
  selectResult,
  navigateUp,
  navigateDown,
  confirmSelection,
} = useSessionSearch()

const searchInputRef = ref<HTMLInputElement | null>(null)
const resultsRef = ref<HTMLElement | null>(null)
const localQuery = ref('')

// Sync query from composable to local
watch(query, (val) => {
  if (val !== localQuery.value) {
    localQuery.value = val
  }
})

// Focus input when modal opens
watch(isOpen, (val) => {
  if (val) {
    localQuery.value = query.value
    nextTick(() => {
      searchInputRef.value?.focus()
    })
  }
})

function onInput() {
  debouncedSearch(localQuery.value)
}

function onEnter() {
  const session = confirmSelection()
  if (session) {
    onSelectDirect(session)
  }
}

function onSelect(result: { session: { id: string } }) {
  chatStore.switchSession(result.session.id)
  router.push('/')
  closeSearch()
}

function onSelectDirect(session: { id: string }) {
  chatStore.switchSession(session.id)
  router.push('/')
  closeSearch()
}

function getModelBadge(session: any): string {
  // Find the last assistant message to get model info
  const msgs = session.messages || []
  for (let i = msgs.length - 1; i >= 0; i--) {
    if (msgs[i].role === 'assistant' && msgs[i].model) {
      return msgs[i].model.split('/').pop() || msgs[i].model
    }
  }
  return ''
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return t('inbox.justNow', 'Just now')
  if (diffMins < 60) return t('inbox.minutesAgo', '{n}m ago').replace('{n}', String(diffMins))
  if (diffHours < 24) return t('inbox.hoursAgo', '{n}h ago').replace('{n}', String(diffHours))
  if (diffDays < 7) return t('inbox.daysAgo', '{n}d ago').replace('{n}', String(diffDays))

  return d.toLocaleDateString()
}

// Scroll active item into view
watch(selectedIndex, () => {
  nextTick(() => {
    if (!resultsRef.value) return
    const activeEl = resultsRef.value.querySelector('.search-result-item.active') as HTMLElement
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  })
})
</script>

<style scoped>
/* ════════════════════════════════════════════════════════════
   Session Search Modal — Ctrl+K Global Search
   ════════════════════════════════════════════════════════════ */

.session-search-overlay {
  position: fixed;
  inset: 0;
  z-index: calc(var(--z-modal) + 100);
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(32px) saturate(1.5);
  -webkit-backdrop-filter: blur(32px) saturate(1.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 12vh;
  font-family: var(--font-sans);
}

.session-search-modal {
  width: 560px;
  max-width: 90vw;
  max-height: 70vh;
  background: var(--bg-elevated);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-2xl);
  box-shadow:
    0 0 0 1px rgba(90, 200, 250, 0.08),
    0 24px 64px rgba(0, 0, 0, 0.5),
    0 0 48px rgba(90, 200, 250, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: searchModalIn var(--duration-200) var(--ease-expo);
}

@keyframes searchModalIn {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(-8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Search Input */
.search-input-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--border-base);
  background: var(--glass-weak);
}

.search-icon {
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: var(--text-lg);
  font-family: var(--font-sans);
  color: var(--text-primary);
  caret-color: var(--accent);
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.search-kbd {
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  background: var(--glass-strong);
  border: 1px solid var(--border-light);
  color: var(--text-tertiary);
  flex-shrink: 0;
}

/* Results Container */
.search-results {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: var(--space-1) 0;
}

/* Results Header */
.results-header {
  padding: var(--space-2) var(--space-5);
}

.results-count {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  font-weight: var(--font-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Result Item */
.search-result-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-5);
  cursor: pointer;
  border-left: 2px solid transparent;
  transition:
    background var(--fast),
    border-color var(--fast),
    box-shadow var(--fast);
}

.search-result-item:hover {
  background: var(--glass-base);
}

.search-result-item.active {
  background: var(--accent-light);
  border-left-color: var(--accent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 12%, transparent);
}

.result-main {
  flex: 1;
  min-width: 0;
}

.result-title-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.result-title {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-model-badge {
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 1px 6px;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--accent) 15%, transparent);
  color: var(--accent);
  border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
  flex-shrink: 0;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-preview {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
}

.result-date {
  font-size: 10px;
  color: var(--text-tertiary);
  white-space: nowrap;
}

.result-count {
  font-size: 10px;
  color: var(--text-tertiary);
  background: var(--glass-base);
  padding: 1px 5px;
  border-radius: var(--radius-sm);
}

/* Empty / Loading State */
.search-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-10) var(--space-5);
  color: var(--text-tertiary);
  font-size: var(--text-sm);
}

.search-empty-icon {
  opacity: 0.3;
}

.search-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-light);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Footer */
.search-footer {
  padding: var(--space-2) var(--space-5);
  border-top: 1px solid var(--border-base);
  background: var(--glass-weak);
}

.search-hint {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 11px;
  color: var(--text-tertiary);
}

.search-hint kbd {
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 3px;
  background: var(--glass-strong);
  border: 1px solid var(--border-base);
  color: var(--text-secondary);
}

/* Transition */
.search-modal-enter-active {
  transition: opacity var(--duration-200) var(--ease-expo);
}

.search-modal-leave-active {
  transition: opacity var(--duration-150) var(--ease-expo);
}

.search-modal-enter-from,
.search-modal-leave-to {
  opacity: 0;
}

.search-modal-enter-from .session-search-modal {
  transform: scale(0.96) translateY(-8px);
}

/* Scrollbar */
.search-results::-webkit-scrollbar {
  width: 4px;
}

.search-results::-webkit-scrollbar-track {
  background: transparent;
}

.search-results::-webkit-scrollbar-thumb {
  background: var(--border-light);
  border-radius: var(--radius-full);
}

.search-results::-webkit-scrollbar-thumb:hover {
  background: var(--border-strong);
}
</style>
