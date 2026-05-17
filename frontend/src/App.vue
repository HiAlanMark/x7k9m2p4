<template>
  <!-- Splash Screen -->
  <SplashScreen v-if="showSplash" @done="showSplash = false" />

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
        <span>重命名</span>
      </div>
      <div class="context-menu-item danger" @click="deleteFromMenu">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
        <span>删除</span>
      </div>
    </div>
    <div v-if="contextMenu.visible" class="context-menu-overlay" @click="closeContextMenu"></div>
    
    <!-- Rename Modal (moved outside sidebar) -->
    <div v-if="renameModal.visible" class="rename-modal-overlay" @click="closeRenameModal">
      <div class="rename-modal" @click.stop>
        <h3 class="rename-title">重命名会话</h3>
        <input
          ref="renameInputRef"
          v-model="renameValue"
          type="text"
          class="rename-input"
          placeholder="输入会话名称"
          @keydown.enter="confirmRename"
          @keydown.escape="closeRenameModal"
        />
        <div class="rename-actions">
          <button class="rename-cancel" @click="closeRenameModal">取消</button>
          <button class="rename-confirm" @click="confirmRename">确定</button>
        </div>
      </div>
    </div>
    
    <!-- Sidebar -->
    <aside class="sidebar glass">
      <!-- Brand -->
      <div class="sidebar-brand">
        <IconBrandLogo :width="120" :height="24" :dark="appStore.isDark" />
        <span class="brand-version">{{ appVersion }}</span>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
          <span class="nav-icon"><IconChat :size="18" /></span>
          <span class="nav-label">对话</span>
          <kbd class="nav-shortcut">1</kbd>
        </router-link>
        <router-link to="/skills" class="nav-item" :class="{ active: $route.path === '/skills' }">
          <span class="nav-icon"><IconStore :size="18" /></span>
          <span class="nav-label">技能商店</span>
          <kbd class="nav-shortcut">2</kbd>
        </router-link>
        <router-link to="/tasks" class="nav-item" :class="{ active: $route.path === '/tasks' }">
          <span class="nav-icon"><IconStar :size="18" /></span>
          <span class="nav-label">任务</span>
          <kbd class="nav-shortcut">3</kbd>
        </router-link>
        <router-link to="/settings" class="nav-item" :class="{ active: $route.path === '/settings' }">
          <span class="nav-icon"><IconSettings :size="18" /></span>
          <span class="nav-label">设置</span>
          <kbd class="nav-shortcut">4</kbd>
        </router-link>
      </nav>

      <!-- Session List -->
      <div class="session-list">
        <div class="session-list-header">
          <span class="session-list-title">会话</span>
          <button class="new-session-btn" @click="chatStore.newSession(); router.push('/')" title="新建会话">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
        <div class="session-items">
          <transition-group name="session-anim" tag="div">
            <div
              v-for="s in chatStore.sortedSessions"
              :key="s.id"
              class="session-item"
              :class="{ active: s.id === chatStore.activeSessionId }"
              @click="chatStore.switchSession(s.id); router.push('/')"
              @contextmenu.prevent="openContextMenu($event, s)"
            >
              <span class="session-item-title">{{ truncateTitle(s.title) }}</span>
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
            <span class="session-label">{{ activeModelDisplay }}</span>
          </div>
          <div class="session-row">
            <span class="session-dot dot-dim"></span>
            <span class="session-label dim">{{ chatStore.providerMode === 'custom' ? '自定义 API' : 'gfw.net' }}</span>
          </div>
        </div>

        <!-- Balance -->
        <div v-if="chatStore.providerMode !== 'custom'" class="balance-line">
          <span class="balance-label">余额</span>
          <span class="balance-value">{{ balance.toFixed(2) }} G</span>
        </div>

        <!-- Model Selector -->
        <div v-if="chatStore.providerMode !== 'custom'" class="model-select-wrap">
          <div class="model-dropdown" :class="{ open: modelDropdownOpen }">
            <button class="model-dropdown-trigger" @click.stop="modelDropdownOpen = !modelDropdownOpen">
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
                :class="{ active: selectedModel === m.model_code }"
                @click="selectedModel = m.model_code; modelDropdownOpen = false"
              >
                <span class="model-item-name">{{ m.model_name }}</span>
                <svg v-if="selectedModel === m.model_code" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div v-if="!dropdownModels.length" class="model-dropdown-empty">暂无模型</div>
            </div>
          </div>
        </div>

        <!-- Theme Toggle -->
        <button class="theme-btn" @click="appStore.toggleTheme" :title="appStore.isDark ? '切换亮色' : '切换暗色'">
          <IconSun v-if="appStore.isDark" :size="14" />
          <IconMoon v-else :size="14" />
          <span>{{ appStore.isDark ? '亮色' : '暗色' }}</span>
        </button>
      </div>
    </aside>
    
    <!-- Main Content -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGfwStore } from './stores/gfw'
import { useChatStore } from './stores/chat'
import { useAppStore } from './stores/app'
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

const router = useRouter()
const gfwStore = useGfwStore()
const chatStore = useChatStore()
const appStore = useAppStore()
const { balance } = storeToRefs(gfwStore)

const appVersion = __APP_VERSION__
const showSplash = ref(true)
const confirmDeleteId = ref('')
const modelDropdownOpen = ref(false)

// Context Menu & Rename
const contextMenu = ref({ visible: false, x: 0, y: 0, sessionId: '' })
const renameModal = ref({ visible: false })
const renameValue = ref('')
const renameInputRef = ref<HTMLInputElement | null>(null)

const { selectedModel } = storeToRefs(chatStore)

const activeModelDisplay = computed(() => {
  const config = chatStore.getActiveConfig()
  return config?.model ? config.model.split('/').pop() || config.model : '未选择模型'
})

const selectedModelDisplay = computed(() => {
  const m = gfwStore.models.find(m => m.model_code === selectedModel.value)
  return m ? m.model_name : (selectedModel.value || '选择模型')
})

const dropdownModels = computed(() => gfwStore.models)

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

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('click', closeContextMenu)
  gfwStore.fetchBalance()
  gfwStore.fetchModels()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('click', closeContextMenu)
})

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
  transition: all var(--normal);
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
  transition: all var(--fast);
  cursor: pointer;
}

.nav-item:hover {
  background: var(--glass-bg-hover);
  color: var(--text-primary);
  transform: translateX(2px);
}

.nav-item.active {
  background: var(--primary-light);
  color: var(--primary);
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
  border-top: 1px solid var(--border-base);
  border-bottom: 1px solid var(--border-base);
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
  transition: all var(--fast);
}

.new-session-btn:hover {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
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
  transition: all var(--fast);
  position: relative;
}

.session-item:hover {
  background: var(--glass-bg-hover);
}

.session-item.active {
  background: var(--primary-light);
  color: var(--primary);
}

.session-item-title {
  flex: 1;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-item.active .session-item-title {
  color: var(--primary);
  font-weight: var(--font-medium);
}

.session-item-count {
  font-size: 10px;
  color: var(--text-tertiary);
  background: var(--glass-base);
  padding: 2px 5px;
  border-radius: var(--radius-sm);
}

.session-delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-tertiary);
  cursor: pointer;
  opacity: 0;
  transition: all var(--fast);
}

.session-item:hover .session-delete-btn {
  opacity: 1;
}

.session-delete-btn:hover {
  background: var(--error);
  color: white;
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
  transition: all var(--fast);
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
  transition: all var(--normal);
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
  transition: all var(--fast);
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
  transition: all var(--fast);
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

/* Theme Toggle */
.theme-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-2);
  background: var(--glass-base);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--fast);
}

.theme-btn:hover {
  background: var(--glass-bg-hover);
  border-color: var(--border-light);
  color: var(--text-primary);
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
  transition: all var(--normal);
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
  transition: all var(--fast);
}

.context-menu-item:hover {
  background: var(--glass-base);
}

.context-menu-item.danger {
  color: var(--error);
}

.context-menu-item.danger:hover {
  background: rgba(239, 68, 68, 0.1);
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
  background: rgba(0, 0, 0, 0.6);
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
  transition: all var(--fast);
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
  transition: all var(--fast);
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
</style>
