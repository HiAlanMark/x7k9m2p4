<template>
  <!-- Splash Screen -->
  <SplashScreen v-if="showSplash" @done="showSplash = false" />

  <!-- Auth Login Modal -->
  <LoginModal ref="loginModalRef" @connected="onAuthConnected" />

  <!-- Session Search Modal (Ctrl+K) -->
  <SessionSearchModal />

  <div v-show="!showSplash" class="app">
    <!-- 窗口拖拽区域 (顶部 32px) -->
    <div class="window-drag-area"></div>
    <!-- 窗口控制按钮 -->
    <TitleBar />
    
    <!-- VueBits 背景动画 -->
    <VueBitsBg />
    
    <!-- Toast 通知 -->
    <HxToast ref="toastRef" />
    
    <!-- Context Menu (moved outside sidebar) -->
    <div v-if="contextMenu.visible" class="context-menu" :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }" @click.stop>
      <div class="context-menu-item" @click="startRename">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
        <span>{{ t('app.rename') }}</span>
      </div>
      <div class="context-menu-item" @click="exportSession">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span>导出</span>
      </div>
      <div class="context-menu-item danger" @click="deleteFromMenu">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
        <span>{{ t('common.delete') }}</span>
      </div>
    </div>
    <div v-if="contextMenu.visible" class="context-menu-overlay" @click="closeContextMenu"></div>
    
    <!-- Rename Modal (moved outside sidebar) -->
    <div v-if="renameModal.visible" class="rename-modal-overlay" @click="closeRenameModal" @contextmenu.prevent>
      <div class="rename-modal" @click.stop>
        <h3 class="rename-title">{{ t('app.renameSession') }}</h3>
        <input
          ref="renameInputRef"
          v-model="renameValue"
          type="text"
          class="rename-input"
          :placeholder="t('app.renamePlaceholder')"
          @keydown.enter="confirmRename"
          @keydown.escape="closeRenameModal"
          @contextmenu.prevent="showRenameCtxMenu"
        />
        <!-- Rename context menu -->
        <div v-if="renameCtx.show" class="ctx-menu" :style="{ top: renameCtx.y + 'px', left: renameCtx.x + 'px' }" @click.stop @contextmenu.prevent>
          <button v-if="renameCtx.hasSelection" @click="renameCtxCopy" class="ctx-item">复制</button>
          <button @click="renameCtxPaste" class="ctx-item">粘贴</button>
        </div>
        <div class="rename-actions">
          <button class="rename-cancel" @click="closeRenameModal">取消</button>
          <button class="rename-confirm" @click="confirmRename">确定</button>
        </div>
      </div>
    </div>
    
    <!-- Sidebar -->
    <aside class="sidebar glass" @contextmenu.prevent>
      <!-- Brand -->
      <div class="sidebar-brand">
        <IconBrandLogo :width="120" :height="24" :dark="appStore.isDark" />
        <span class="brand-version">{{ appVersion }}</span>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
          <span class="nav-icon"><IconChat :size="18" /></span>
          <span class="nav-label">{{ $t('nav.chat') }}</span>
          <kbd class="nav-shortcut">1</kbd>
        </router-link>
        <router-link to="/inbox" class="nav-item" :class="{ active: $route.path === '/inbox' }">
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>
            <span v-if="inboxBadge > 0" class="nav-badge">{{ inboxBadge > 99 ? '99+' : inboxBadge }}</span>
          </span>
          <span class="nav-label">{{ $t('nav.inbox') }}</span>
          <kbd class="nav-shortcut">3</kbd>
        </router-link>
        <router-link to="/history" class="nav-item" :class="{ active: $route.path === '/history' }">
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span v-if="historyRunsCount > 0" class="nav-badge nav-badge--running">{{ historyRunsCount > 99 ? '99+' : historyRunsCount }}</span>
          </span>
          <span class="nav-label">{{ $t('nav.history') }}</span>
          <kbd class="nav-shortcut">4</kbd>
        </router-link>
        <router-link to="/skills" class="nav-item" :class="{ active: $route.path === '/skills' }">
          <span class="nav-icon"><IconStore :size="18" /></span>
          <span class="nav-label">{{ $t('nav.skills') }}</span>
          <kbd class="nav-shortcut">5</kbd>
        </router-link>
        <router-link to="/tasks" class="nav-item" :class="{ active: $route.path === '/tasks' }">
          <span class="nav-icon"><IconStar :size="18" /></span>
          <span class="nav-label">{{ $t('nav.tasks') }}</span>
          <kbd class="nav-shortcut">6</kbd>
        </router-link>
        <router-link to="/files" class="nav-item" :class="{ active: $route.path === '/files' }">
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          </span>
          <span class="nav-label">{{ $t('nav.files') }}</span>
        </router-link>
        <router-link to="/group-chat" class="nav-item" :class="{ active: $route.path === '/group-chat' }">
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </span>
          <span class="nav-label">{{ $t('nav.groupChat') }}</span>
        </router-link>
        <router-link to="/settings" class="nav-item" :class="{ active: $route.path === '/settings' }">
          <span class="nav-icon"><IconSettings :size="18" /></span>
          <span class="nav-label">{{ $t('nav.settings') }}</span>
          <kbd class="nav-shortcut">9</kbd>
        </router-link>
      </nav>

      <!-- Session List -->
      <div class="session-list">
        <div class="session-list-header">
          <span class="session-list-title">会话</span>
          <div class="session-list-actions">
            <button v-if="!batchMode" class="new-session-btn" @click="chatStore.newSession(); router.push('/')" title="新建会话">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <button v-if="!batchMode" class="batch-mode-btn" @click="batchMode = true; batchSelected = new Set()" title="批量管理">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
              </svg>
            </button>
            <template v-if="batchMode">
              <button class="batch-select-all-btn" @click="toggleSelectAll" :title="isAllSelected ? '取消全选' : '全选'">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path v-if="isAllSelected" d="M9 11l3 3L22 4"></path>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
                <span>{{ isAllSelected ? '取消' : '全选' }}</span>
              </button>
              <button class="batch-delete-btn" :disabled="batchSelected.size === 0" @click="batchDeleteSelected" title="删除选中">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
                <span v-if="batchSelected.size">{{ batchSelected.size }}</span>
              </button>
              <button class="batch-cancel-btn" @click="batchMode = false; batchSelected = new Set()" title="取消">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </template>
          </div>
        </div>
        <div class="session-items">
          <transition-group name="session-anim" tag="div">
            <div
              v-for="s in chatStore.sortedSessions"
              :key="s.id"
              class="session-item"
              :class="{ active: s.id === chatStore.activeSessionId, 'batch-selected': batchSelected.has(s.id) }"
              @click="batchMode ? toggleBatchSelect(s.id) : (chatStore.switchSession(s.id), router.push('/'))"
              @contextmenu.prevent="batchMode ? null : openContextMenu($event, s)"
            >
              <label v-if="batchMode" class="batch-checkbox" @click.stop>
                <input type="checkbox" :checked="batchSelected.has(s.id)" @change="toggleBatchSelect(s.id)" />
                <span class="checkmark"></span>
              </label>
              <span class="session-item-title">{{ truncateTitle(s.title) }}</span>
              <div class="session-item-actions">
                <span class="session-item-count">{{ s.messages.filter(m => m.role === 'user').length }}</span>
                <button
                  v-if="chatStore.sessions.length > 1 && confirmDeleteId !== s.id"
                  class="session-delete-btn"
                  @click.stop="confirmDeleteId = s.id"
                  title="删除会话"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
              <span v-if="confirmDeleteId === s.id" class="confirm-delete" @click.stop>
                <button class="confirm-yes" @click.stop="chatStore.deleteSession(s.id); confirmDeleteId = ''">删除</button>
                <button class="confirm-no" @click.stop="confirmDeleteId = ''">取消</button>
              </span>
            </div>
          </transition-group>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="sidebar-footer">
        <!-- Session Info -->
        <div class="session-block">
          <div class="session-row">
            <span class="session-dot" :class="chatStore.providerMode === 'custom' ? 'dot-blue' : 'dot-green'"></span>
            <span class="session-label">{{ providerLabel }}</span>
          </div>
        </div>

        <!-- Balance -->
        <div v-if="chatStore.providerMode !== 'custom'" class="balance-line">
          <span class="balance-label">余额</span>
          <span class="balance-value" :class="{ 'balance-loading': appStore.connectionState === 'connecting' }">
            {{ appStore.connectionState === 'connecting' ? '...' : (appStore.connectionState === 'disconnected' || balance <= 0) ? '--' : balance.toFixed(2) + ' G' }}
          </span>
        </div>

        <!-- Model Selector -->
        <div class="model-select-wrap">
          <div class="model-dropdown" :class="{ open: modelDropdownOpen }">
            <button class="model-dropdown-trigger" @click.stop="openModelDropdown">
              <span class="model-dropdown-value">{{ selectedModelDisplay }}</span>
              <svg class="model-dropdown-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div v-if="modelDropdownOpen" class="model-dropdown-panel" @click.stop>
              <div
                v-for="m in dropdownModels"
                :key="m.model_code"
                class="model-dropdown-item"
                :class="{ active: isModelActive(m.model_code) }"
                @click="selectModel(m.model_code)"
              >
                <span class="model-item-name">{{ m.model_name }}</span>
                <svg v-if="isModelActive(m.model_code)" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div v-if="!dropdownModels.length" class="model-dropdown-empty">暂无模型</div>
            </div>
          </div>
        </div>

        <!-- Theme & Lang & Variant -->
        <div class="theme-row">
          <button class="theme-btn" @click="appStore.toggleTheme" :title="appStore.isDark ? $t('settings.light') : $t('settings.dark')">
            <IconSun v-if="appStore.isDark" :size="14" />
            <IconMoon v-else :size="14" />
            <span>{{ appStore.isDark ? $t('settings.light') : $t('settings.dark') }}</span>
          </button>
          <button class="theme-btn" @click="toggleLang" :title="locale === 'zh-CN' ? 'English' : '中文'">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
            <span>{{ locale === 'zh-CN' ? 'EN' : '中' }}</span>
          </button>
        </div>
      </div>
    </aside>
    
    <!-- Main Content -->
    <main class="main-content">
      <!-- Connection Status Banner -->
      <transition name="banner-slide">
        <div v-if="appStore.connectionState === 'disconnected'" class="connection-banner disconnected">
          <div class="banner-content">
            <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor">
              <path d="M511.914667 85.333333c-235.52 0-426.666667 191.146667-426.666667 426.666667s191.146667 426.666667 426.666667 426.666667 426.666667-191.146667 426.666666-426.666667-191.146667-426.666667-426.666666-426.666667z m0 768c-188.586667 0-341.333333-152.746667-341.333334-341.333333s152.746667-341.333333 341.333334-341.333333 341.333333 152.746667 341.333333 341.333333-152.746667 341.333333-341.333333 341.333333z"></path>
              <path d="M512 640c-35.2 0-64 28.8-64 64S476.8 768 512 768s64-28.8 64-64S547.2 640 512 640z"></path>
              <path d="M512 256c-36.906667 0-66.176 29.269333-63.872 63.872l15.616 234.88c1.621333 23.936 22.741333 42.581333 48.256 42.581333s46.634667-18.645333 48.213333-42.581333l15.658667-234.88C578.176 285.269333 548.906667 256 512 256z"></path>
            </svg>
            <span>后端服务未连接 — 部分功能可能不可用</span>
            <button class="banner-retry" @click="appStore.checkConnection()">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              重试
            </button>
          </div>
        </div>
      </transition>
      <transition name="banner-slide">
        <div v-if="appStore.connectionState === 'connecting'" class="connection-banner connecting">
          <div class="banner-content">
            <div class="banner-spinner"></div>
            <span>正在连接后端服务...</span>
          </div>
        </div>
      </transition>
      
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, reactive, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { setLocale } from './i18n'

import { useGfwStore } from './stores/gfw'
import { useChatStore } from './stores/chat'
import { useAppStore } from './stores/app'
/* REMOVED: import { useBlueprintStore } from './stores/blueprint' */
import { storeToRefs } from 'pinia'
import IconChat from './components/icons/IconChat.vue'
import IconStore from './components/icons/IconStore.vue'
import IconSettings from './components/icons/IconSettings.vue'
import IconStar from './components/icons/IconStar.vue'
import IconSun from './components/icons/IconSun.vue'
import IconMoon from './components/icons/IconMoon.vue'
import IconBrandLogo from './components/icons/IconBrandLogo.vue'
import SplashScreen from './components/SplashScreen.vue'
import TitleBar from './components/TitleBar.vue'
import VueBitsBg from './components/fx/VueBitsBg.vue'
import { HxToast } from './components/ui'
import LoginModal from './components/auth/LoginModal.vue'
import SessionSearchModal from './components/SessionSearchModal.vue'
import { getAuthToken, setAuthToken, hermesAuthStatus, hermesAuthAutoLogin, sessionExport as apiSessionExport, sessionBatchDelete } from './api'
import HistoryView from './views/HistoryView.vue'
import { useThemeVariant } from './composables/useThemeVariant'

const router = useRouter()
const gfwStore = useGfwStore()
const chatStore = useChatStore()
const appStore = useAppStore()
/* REMOVED: const blueprintStore = useBlueprintStore() */
const { t, locale } = useI18n()
const { balance } = storeToRefs(gfwStore)
const { themeVariant, toggleThemeVariant } = useThemeVariant()

// Inbox pending badge for sidebar
const inboxBadge = computed(() =>
  0 /* Blueprint removed */
)

// Running tasks badge for history sidebar
const historyRunsCount = ref(0)
const historyPollTimer = ref<ReturnType<typeof setInterval> | null>(null)

async function fetchHistoryBadge() {
  try {
    const { agentJson } = await import('./api')
    const data = await agentJson('/v1/agent/runs')
    const allRuns: any[] = Array.isArray(data) ? data : (data?.runs || data?.data || [])
    historyRunsCount.value = allRuns.filter((r: any) => r.status === 'running' || r.status === 'queued').length
  } catch (e) {
    console.warn('[App] Failed to fetch history runs:', e)
    historyRunsCount.value = 0
  }
}

// ── Auth check ──
const loginModalRef = ref<InstanceType<typeof LoginModal> | null>(null)

function onAuthConnected() {
  // After successful login, retry fetching data
  chatStore.fetchServerSessions()
  fetchHistoryBadge()
}

async function checkAuth() {
  // 1. Try auto-login first (localhost → Vite proxy → same machine → zero-config)
  const autoResult = await hermesAuthAutoLogin()
  if (autoResult.success && autoResult.token) {
    setAuthToken(autoResult.token)
    console.log('[App] Auto-login success')
    return
  }

  // 2. Already have a stored token? Verify it still works
  const storedToken = getAuthToken()
  if (storedToken) {
    try {
      const status = await hermesAuthStatus()
      if (status.has_token) {
        const { agentJson } = await import('./api')
        await agentJson('/v1/agent/health')
        return // Stored token valid
      }
    } catch (e) {
      // Stored token invalid — fall through
    }
  }

  // 3. Server requires auth but we have no valid token — show manual login
  try {
    const status = await hermesAuthStatus()
    if (status.has_token) {
      loginModalRef.value?.show()
    }
    // If server has no token configured, no auth needed — proceed freely
  } catch (e) {
    console.warn('[App] Auth status check failed:', e)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('click', closeContextMenu)
  gfwStore.fetchBalance()
  gfwStore.fetchModels()
  appStore.checkConnection()
  checkAuth()
  fetchHistoryBadge()
  historyPollTimer.value = setInterval(fetchHistoryBadge, 5000)
  chatStore.fetchServerSessions()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('click', closeContextMenu)
  document.removeEventListener('click', renameCtxDismiss)
  if (historyPollTimer.value) clearInterval(historyPollTimer.value)
})

const appVersion = __APP_VERSION__

function toggleLang() {
  const newLang = locale.value === 'zh-CN' ? 'en' : 'zh-CN'
  setLocale(newLang as 'zh-CN' | 'en')
}
const showSplash = ref(true)
const confirmDeleteId = ref('')
const batchMode = ref(false)
const batchSelected = ref<Set<string>>(new Set())
const modelDropdownOpen = ref(false)

// Context Menu & Rename
const contextMenu = ref({ visible: false, x: 0, y: 0, sessionId: '' })
const renameModal = ref({ visible: false })
const renameValue = ref('')
const renameInputRef = ref<HTMLInputElement | null>(null)

// Rename input context menu
const renameCtx = reactive({ show: false, x: 0, y: 0, hasSelection: false })
const renameCtxDismiss = () => { renameCtx.show = false }

function showRenameCtxMenu(e: MouseEvent) {
  const inp = renameInputRef.value
  renameCtx.hasSelection = !!(inp && inp.selectionStart !== inp.selectionEnd)
  renameCtx.x = e.clientX
  renameCtx.y = e.clientY
  renameCtx.show = true
  nextTick(() => {
    document.addEventListener('click', renameCtxDismiss, { once: true })
  })
}

function renameCtxCopy() {
  try { document.execCommand('copy') } catch {}
  renameCtx.show = false
}

function renameCtxPaste() {
  const inp = renameInputRef.value
  if (!inp) return
  renameCtx.show = false
  if (navigator.clipboard?.readText) {
    navigator.clipboard.readText().then(text => {
      if (text) {
        inp.focus()
        const start = inp.selectionStart || 0
        const end = inp.selectionEnd || 0
        const val = renameValue.value
        renameValue.value = val.substring(0, start) + text + val.substring(end)
        nextTick(() => {
          inp.selectionStart = inp.selectionEnd = start + text.length
        })
      }
    }).catch(() => {})
  }
}

const { selectedModel, providerMode: storeProviderMode, customProvider } = storeToRefs(chatStore)

const activeModelDisplay = computed(() => {
  const config = chatStore.getActiveConfig()
  return config?.model ? config.model.split('/').pop() || config.model : '未选择模型'
})

const selectedModelDisplay = computed(() => {
  if (storeProviderMode.value === 'custom') {
    return customProvider.value.model || '选择模型'
  }
  const m = gfwStore.models.find(m => m.model_code === selectedModel.value)
  return m ? m.model_name : (selectedModel.value || '选择模型')
})

const dropdownModels = computed(() => {
  if (storeProviderMode.value === 'custom') return customModels.value
  return gfwStore.models
})

function isModelActive(code: string): boolean {
  if (storeProviderMode.value === 'custom') return customProvider.value.model === code
  return selectedModel.value === code
}

function selectModel(code: string) {
  if (storeProviderMode.value === 'custom') {
    chatStore.setCustomProvider({ ...customProvider.value, model: code })
  } else {
    selectedModel.value = code
  }
  modelDropdownOpen.value = false
}

function openModelDropdown() {
  modelDropdownOpen.value = !modelDropdownOpen.value
  if (modelDropdownOpen.value) {
    if (storeProviderMode.value === 'custom') fetchCustomModels()
    else gfwStore.fetchModels(true)
  }
}
const customModels = ref<{model_code: string; model_name: string}[]>([])
const customModelsLoading = ref(false)

async function fetchCustomModels() {
  if (storeProviderMode.value !== 'custom') return
  const cp = customProvider.value
  if (!cp.baseUrl || !cp.apiKey) return
  customModelsLoading.value = true
  try {
    const base = cp.baseUrl.replace(/\/$/, '')
    const headers: Record<string, string> = {
      'Authorization': 'Bearer ' + cp.apiKey,
    }
    let fetchUrl = base + '/models'
    // Wails 模式或开发模式下通过 Go 后端代理避免跨域
    if (base.startsWith('http')) {
      try {
        const targetOrigin = new URL(base).origin
        if (targetOrigin !== window.location.origin) {
          headers['x-proxy-target'] = base
          fetchUrl = '/proxy/custom/models'
        }
      } catch (e) { console.warn('[App] URL parse failed for custom provider:', e) }
    }
    const r = await fetch(fetchUrl, { headers })
    const data = await r.json()
    const list = data.data || data || []
    customModels.value = (Array.isArray(list) ? list : []).map((m: any) => ({
      model_code: m.id || m.model || '',
      model_name: m.id || m.model || '',
    })).filter(m => m.model_code)
  } catch (e) { console.warn('[App] Failed to fetch custom models:', e); customModels.value = [] }
  customModelsLoading.value = false
}

const providerLabel = computed(() => {
  if (storeProviderMode.value === 'custom') {
    return customProvider.value.name || '自定义 API'
  }
  return 'G网（GFW.NET）'
})

const truncateTitle = (title: string) => {
  if (!title) return '新会话'
  return title.length > 18 ? title.slice(0, 18) + '...' : title
}

// Keyboard shortcuts
function handleKeydown(e: KeyboardEvent) {
  if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return
  if (e.target && (e.target as HTMLElement).tagName === 'TEXTAREA') return
  
  switch (e.key) {
    case '1': router.push('/'); break
    case '2': router.push('/skills'); break
    case '3': router.push('/tasks'); break
    case '4': router.push('/settings'); break
  }
}

// Context Menu functions
function openContextMenu(e: MouseEvent, session: { id: string, title: string }) {
  contextMenu.value = {
    visible: true,
    x: Math.min(e.clientX, window.innerWidth - 160),
    y: Math.min(e.clientY, window.innerHeight - 80),
    sessionId: session.id,
  }
}

function closeContextMenu() {
  contextMenu.value.visible = false
}

function startRename() {
  const session = chatStore.sessions.find(s => s.id === contextMenu.value.sessionId)
  if (session) {
    renameValue.value = session.title
    renameModal.value.visible = true
    contextMenu.value.visible = false
    setTimeout(() => renameInputRef.value?.focus(), 100)
  }
}

function closeRenameModal() {
  renameModal.value.visible = false
  renameValue.value = ''
}

function confirmRename() {
  if (renameValue.value.trim()) {
    chatStore.renameSession(contextMenu.value.sessionId, renameValue.value.trim())
  }
  closeRenameModal()
}

function deleteFromMenu() {
  if (contextMenu.value.sessionId && chatStore.sessions.length > 1) {
    chatStore.deleteSession(contextMenu.value.sessionId)
  }
  closeContextMenu()
}

// ── Batch Operations ──
const isAllSelected = computed(() => chatStore.sessions.length > 0 && batchSelected.value.size === chatStore.sessions.length)

function toggleSelectAll() {
  if (isAllSelected.value) {
    batchSelected.value = new Set()
  } else {
    batchSelected.value = new Set(chatStore.sessions.map(s => s.id))
  }
}

function toggleBatchSelect(id: string) {
  const next = new Set(batchSelected.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  batchSelected.value = next
}

async function batchDeleteSelected() {
  if (batchSelected.value.size === 0) return
  const ids = Array.from(batchSelected.value)
  // Collect serverIds for batch API call
  const serverIds = chatStore.sessions
    .filter(s => ids.includes(s.id) && s.serverId)
    .map(s => s.serverId as string)
  // Delete locally first
  for (const id of ids) {
    if (chatStore.sessions.length <= 1) break // keep at least 1 session
    chatStore.deleteSession(id)
  }
  // Batch delete on server
  if (serverIds.length > 0) {
    try {
      await sessionBatchDelete(serverIds)
    } catch (e) {
      console.warn('[batch-delete] server batch delete failed:', e)
    }
  }
  batchMode.value = false
  batchSelected.value = new Set()
}

async function exportSession() {
  const sid = contextMenu.value.sessionId
  if (!sid) return
  try {
    const blob = await apiSessionExport(sid, 'markdown')
    // Convert to data URL to avoid WebView2/Chrome blob:HTTPS security block
    const buffer = await blob.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    const binary = bytes.reduce((acc, b) => acc + String.fromCharCode(b), '')
    const base64 = btoa(binary)
    const url = `data:text/markdown;base64,${base64}`
    const a = document.createElement('a')
    a.href = url
    a.download = `session_${sid}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    closeContextMenu()
  } catch (e: any) {
    alert('导出失败: ' + (e.message || String(e)))
  }
}
</script>

<style scoped>
/* ════════════════════════════════════════════════════════════
   App Layout
   ════════════════════════════════════════════════════════════ */
.app {
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: transparent; /* VueBitsBg provides background */
}

/* Window drag area */
.window-drag-area {
  position: fixed;
  top: 0;
  left: 0;
  right: 138px;
  height: 32px;
  -webkit-app-region: drag;
  z-index: 99998;
  pointer-events: auto;
}

/* ════════════════════════════════════════════════════════════
   Sidebar — VueBits Glass
   ════════════════════════════════════════════════════════════ */
.sidebar {
  width: 240px;
  min-width: 240px;
  display: flex;
  flex-direction: column;
  z-index: var(--z-surface);
  transition: width var(--normal), min-width var(--normal), opacity var(--normal);
}

@media (max-width: 768px) {
  .sidebar {
    width: 64px;
    min-width: 64px;
  }
  .sidebar .nav-label,
  .sidebar .nav-shortcut,
  .sidebar .brand-version,
  .sidebar .session-item-count,
  .sidebar .session-list-title,
  .sidebar .sidebar-footer .session-label,
  .sidebar .sidebar-footer .balance-row {
    display: none;
  }
}

/* Brand */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-4);
  border-bottom: 1px solid var(--border-base);
}

.brand-version {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  background: var(--glass-base);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  margin-left: auto;
}

/* Navigation */
.sidebar-nav {
  padding: var(--space-2);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  text-decoration: none;
  margin-bottom: 2px;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border: 1px solid transparent;
  position: relative;
  transition: color var(--fast), border-color var(--fast), box-shadow var(--fast), transform var(--fast);
  cursor: pointer;
}

.nav-item::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--accent) 20%, transparent) 0%,
    color-mix(in srgb, var(--accent) 12%, transparent) 100%
  );
  opacity: 0;
  transition: opacity var(--fast);
  pointer-events: none;
}

.nav-item.active::before {
  opacity: 1;
}

.nav-item:hover {
  background: var(--glass-bg-hover);
  color: var(--text-primary);
  transform: translateX(2px);
}

.nav-item:focus {
  outline: none;
}

.nav-item.active {
  color: var(--accent);
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
  border-left-color: color-mix(in srgb, var(--accent) 50%, transparent);
  box-shadow: 
    inset 0 0 0 1px color-mix(in srgb, var(--accent) 10%, transparent),
    0 0 12px color-mix(in srgb, var(--accent) 15%, transparent);
}

.nav-item.active .nav-icon {
  color: var(--accent);
}

.nav-item.active .nav-shortcut {
  background: color-mix(in srgb, var(--accent) 20%, transparent);
  color: var(--accent);
  border-color: color-mix(in srgb, var(--accent) 30%, transparent);
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.nav-shortcut {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-tertiary);
  background: var(--glass-base);
  padding: 2px 5px;
  border-radius: var(--radius-sm);
}

/* Session List */
.session-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-2);
  margin: var(--space-2) 0;
}

.session-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  margin-bottom: var(--space-2);
}

.session-list-title {
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.new-session-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--glass-base);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: background var(--fast), border-color var(--fast), color var(--fast);
}

.new-session-btn:hover {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.session-list-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.batch-mode-btn,
.batch-select-all-btn,
.batch-delete-btn,
.batch-cancel-btn {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 2px 6px;
  background: var(--glass-base);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 11px;
  transition: background var(--fast), border-color var(--fast), color var(--fast);
}

.batch-mode-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.batch-select-all-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.batch-delete-btn:not(:disabled):hover {
  color: var(--error);
  border-color: var(--error);
}

.batch-delete-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.batch-cancel-btn:hover {
  color: var(--error);
  border-color: var(--error);
}

.batch-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 2px;
}

.batch-checkbox input {
  display: none;
}

.batch-checkbox .checkmark {
  width: 16px;
  height: 16px;
  border: 1.5px solid var(--border-base);
  border-radius: 3px;
  background: var(--glass-base);
  transition: background var(--fast), border-color var(--fast);
  position: relative;
}

.batch-checkbox input:checked + .checkmark {
  background: var(--accent);
  border-color: var(--accent);
}

.batch-checkbox input:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.session-item.batch-selected {
  background: rgba(90, 200, 250, 0.08);
  border-color: rgba(90, 200, 250, 0.3);
}

.session-items {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.session-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  cursor: pointer;
  border: 1px solid transparent;
  transition: color var(--fast), border-color var(--fast), box-shadow var(--fast);
  position: relative;
}

.session-item::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--accent) 25%, transparent) 0%,
    color-mix(in srgb, var(--accent) 15%, transparent) 100%
  );
  opacity: 0;
  transition: opacity var(--fast);
  pointer-events: none;
}

.session-item.active::before {
  opacity: 1;
}

.session-item:hover {
  background: var(--glass-bg-hover);
}

.session-item:focus {
  outline: none;
}

.session-item.active {
  border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
  border-left-color: color-mix(in srgb, var(--accent) 60%, transparent);
  box-shadow: 
    inset 0 0 0 1px color-mix(in srgb, var(--accent) 15%, transparent),
    0 0 16px color-mix(in srgb, var(--accent) 20%, transparent);
}

.session-item.active .session-item-title {
  color: var(--accent);
  font-weight: var(--font-semibold);
}

.session-item.active .session-item-count {
  background: color-mix(in srgb, var(--accent) 25%, transparent);
  color: var(--accent);
  border-color: color-mix(in srgb, var(--accent) 40%, transparent);
}

.session-item-title {
  flex: 1;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-item-count {
  font-size: 10px;
  color: var(--text-tertiary);
  background: var(--glass-base);
  padding: 2px 5px;
  border-radius: var(--radius-sm);
  margin-left: auto;
  transition: opacity 0.15s;
}

.session-item-actions {
  position: relative;
  display: flex;
  align-items: center;
  margin-left: auto;
}

.session-item-actions:hover .session-item-count {
  opacity: 0;
}

.session-delete-btn {
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: var(--error);
  border: none;
  border-radius: var(--radius-sm);
  color: white;
  cursor: pointer;
  opacity: 0;
  transition: opacity var(--fast), background var(--fast);
}

.session-item-actions:hover .session-delete-btn {
  opacity: 1;
}

.session-delete-btn:hover {
  background: var(--error);
}

.confirm-delete {
  display: flex;
  gap: var(--space-1);
  margin-left: auto;
}

.confirm-yes,
.confirm-no {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  transition: background var(--fast), color var(--fast);
}

.confirm-yes {
  background: var(--error);
  color: white;
}

.confirm-no {
  background: var(--glass-base);
  color: var(--text-secondary);
}

/* Session Animations */
.session-anim-enter-active,
.session-anim-leave-active {
  transition: opacity var(--normal), transform var(--normal);
}

.session-anim-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.session-anim-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* Footer */
.sidebar-footer {
  padding: var(--space-4);
  border-top: 1px solid var(--border-base);
}

.session-block {
  margin-bottom: var(--space-3);
}

.session-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-1);
}

.session-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--success);
}

.session-dot.dot-green { background: var(--success); }
.session-dot.dot-blue { background: var(--info); }
.session-dot.dot-yellow { background: var(--warning); box-shadow: 0 0 4px color-mix(in srgb, var(--warning) 50%, transparent); }
.session-dot.dot-dim { background: var(--text-tertiary); }

.session-label {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.session-label.dim {
  color: var(--text-tertiary);
}

.balance-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) var(--space-3);
  background: var(--glass-base);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-3);
}

.balance-label {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.balance-value {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--primary);
}

.balance-value.balance-loading {
  color: var(--text-tertiary);
  font-weight: var(--font-normal);
}

/* Model Dropdown */
.model-select-wrap {
  margin-bottom: var(--space-3);
}

.model-dropdown {
  position: relative;
}

.model-dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--space-2) var(--space-3);
  background: var(--glass-base);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--text-primary);
  cursor: pointer;
  transition: background var(--fast), border-color var(--fast), color var(--fast);
}

.model-dropdown-trigger:hover {
  border-color: var(--border-light);
  background: var(--glass-bg-hover);
}

.model-dropdown.open .model-dropdown-trigger {
  border-color: var(--border-focus);
}

.model-dropdown-value {
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.model-dropdown-arrow {
  color: var(--text-tertiary);
  transition: transform var(--fast);
}

.model-dropdown.open .model-dropdown-arrow {
  transform: rotate(180deg);
}

.model-dropdown-panel {
  position: absolute;
  bottom: calc(100% + var(--space-1));
  left: 0;
  right: 0;
  background: var(--bg-elevated);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xl);
  max-height: 240px;
  overflow-y: auto;
  z-index: var(--z-dropdown);
  animation: slideUp var(--duration-200) var(--ease-expo);
}

.model-dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  color: var(--text-primary);
  cursor: pointer;
  transition: background var(--fast), color var(--fast);
}

.model-dropdown-item:hover {
  background: var(--glass-base);
}

.model-dropdown-item.active {
  background: var(--primary-light);
  color: var(--primary);
}

.model-item-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.model-dropdown-empty {
  padding: var(--space-3);
  text-align: center;
  color: var(--text-tertiary);
  font-size: var(--text-sm);
}

/* Theme & Lang Row */
.theme-row {
  display: flex;
  gap: var(--space-2);
}

.theme-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  flex: 1;
  padding: var(--space-2);
  background: var(--glass-base);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: background var(--fast), border-color var(--fast), color var(--fast);
}

.theme-btn:hover {
  background: var(--glass-bg-hover);
  border-color: var(--border-light);
  color: var(--text-primary);
}

/* Variant toggle active indicator */
.variant-btn.active {
  border-color: var(--primary-border);
  color: var(--accent);
}

/* ════════════════════════════════════════════════════════════
   Main Content
   ════════════════════════════════════════════════════════════ */
.main-content {
  flex: 1;
  overflow: hidden;
  position: relative;
  z-index: var(--z-base);
}

/* Page Transitions */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity var(--normal), transform var(--normal);
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ════════════════════════════════════════════════════════════
   Context Menu
   ════════════════════════════════════════════════════════════ */
.context-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-modal);
}

.context-menu {
  position: fixed;
  background: var(--bg-elevated);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  padding: var(--space-1);
  min-width: 140px;
  z-index: calc(var(--z-modal) + 1);
  animation: slideUp var(--duration-200) var(--ease-expo);
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--text-primary);
  cursor: pointer;
  transition: background var(--fast), color var(--fast);
}

.context-menu-item:hover {
  background: var(--glass-base);
}

.context-menu-item.danger {
  color: var(--error);
}

.context-menu-item.danger:hover {
  background: color-mix(in srgb, var(--error) 10%, transparent);
}

/* ════════════════════════════════════════════════════════════
   Rename Modal
   ════════════════════════════════════════════════════════════ */
.rename-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--shadow-lg);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  animation: fadeIn var(--duration-200) var(--ease-expo);
}

.rename-modal {
  background: var(--bg-elevated);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-2xl);
  padding: var(--space-5);
  min-width: 320px;
  max-width: 400px;
  box-shadow: var(--shadow-2xl);
  animation: scaleIn var(--duration-200) var(--ease-expo);
}

.rename-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-4);
}

.rename-input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: var(--glass-base);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-family: var(--font-sans);
  outline: none;
  transition: border-color var(--fast), box-shadow var(--fast);
  box-sizing: border-box;
}

.rename-input:focus {
  border-color: var(--border-focus);
  box-shadow: var(--glow-sm);
}

.rename-input::placeholder {
  color: var(--text-tertiary);
}

.rename-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  margin-top: var(--space-4);
}

.rename-cancel,
.rename-confirm {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: background var(--fast), color var(--fast);
  border: none;
}

.rename-cancel {
  background: var(--glass-base);
  color: var(--text-secondary);
}

.rename-cancel:hover {
  background: var(--glass-bg-hover);
  color: var(--text-primary);
}

.rename-confirm {
  background: var(--primary);
  color: white;
}

.rename-confirm:hover {
  background: var(--primary-dark);
  box-shadow: var(--glow-sm);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ════════════════════════════════════════════════════════════
   Connection Banner
   ════════════════════════════════════════════════════════════ */
.connection-banner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-overlay);
  padding-top: 32px;
  background: transparent;
  pointer-events: none;
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  background: var(--glass-base);
  backdrop-filter: blur(16px) saturate(1.3);
  -webkit-backdrop-filter: blur(16px) saturate(1.3);
  border-radius: 10px;
  margin: 0 16px;
  border: 1px solid var(--glass-border);
  pointer-events: auto;
}

.connection-banner.disconnected {
  background: transparent;
  border-bottom: none;
}

.connection-banner.disconnected .banner-content {
  color: var(--error);
  border-color: color-mix(in srgb, var(--error) 15%, transparent);
  box-shadow: 0 0 8px color-mix(in srgb, var(--error) 8%, transparent);
}

.connection-banner.connecting {
  background: transparent;
  border-bottom: none;
}

.connection-banner.connecting .banner-content {
  color: var(--warning);
  border-color: color-mix(in srgb, var(--warning) 15%, transparent);
  box-shadow: 0 0 8px color-mix(in srgb, var(--warning) 6%, transparent);
}

.banner-retry {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 6px;
  background: var(--glass-strong);
  border: 1px solid var(--border-base);
  color: var(--text-primary);
  font-size: 12px;
  font-family: var(--font-family);
  cursor: pointer;
  transition: background var(--fast), border-color var(--fast);
}

.banner-retry:hover {
  background: var(--glass-solid);
  border-color: var(--border-light);
}

.ctx-menu {
  position: fixed;
  z-index: 2000;
  background: var(--bg-surface);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: 4px;
  min-width: 100px;
  backdrop-filter: blur(16px);
}

.ctx-item {
  display: block;
  width: 100%;
  padding: 7px 14px;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-family: var(--font-family);
  color: var(--text-primary);
  cursor: pointer;
  text-align: left;
  transition: background var(--fast);
}

.ctx-item:hover {
  background: var(--bg-elevated);
}

.banner-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.banner-slide-enter-active,
.banner-slide-leave-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.banner-slide-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.banner-slide-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
