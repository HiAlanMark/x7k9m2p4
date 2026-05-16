<template>
  <!-- Splash Screen -->
  <SplashScreen v-if="showSplash" @done="showSplash = false" />

  <div v-show="!showSplash" class="app">
    <!-- 窗口拖拽区域 (顶部 32px) -->
    <div class="window-drag-area"></div>
    <!-- 窗口控制按钮 (右上角固定) -->
    <TitleBar />
    <!-- 全局多层科技背景 -->
    <TechGrid
      :grid-size="50"
      :line-color="appStore.isDark ? '#0A84FF' : '#3b82f6'"
      :line-opacity="appStore.isDark ? 0.12 : 0.08"
      :glow-color="appStore.isDark ? '#0A84FF' : '#3b82f6'"
      :speed="0.4"
      :perspective="true"
    />
    <AuroraFlow
      :band-count="3"
      :colors="appStore.isDark ? ['#0A84FF', '#BF5AF2', '#30D158'] : ['#3b82f6', '#8b5cf6', '#10b981']"
      :speed="0.5"
      :blur="80"
      :opacity="appStore.isDark ? 0.25 : 0.15"
    />
    <SoftAurora
      :color1="appStore.isDark ? '#0A84FF' : '#3b82f6'"
      :color2="appStore.isDark ? '#BF5AF2' : '#8b5cf6'"
      :brightness="appStore.isDark ? 0.35 : 0.25"
      :speed="0.3"
    />
    <ParticleNetwork
      :count="60"
      :color="appStore.isDark ? '#0A84FF' : '#3b82f6'"
      :speed="0.4"
      :connectDistance="120"
      :particle-size="1.2"
      :opacity="appStore.isDark ? 0.5 : 0.3"
    />
    <GlowOrb
      :color="appStore.isDark ? '#0A84FF' : '#3b82f6'"
      :size="400"
      x="20%"
      y="30%"
      :blur="100"
      :opacity="appStore.isDark ? 0.15 : 0.08"
      :duration="10"
    />
    <GlowOrb
      :color="appStore.isDark ? '#BF5AF2' : '#8b5cf6'"
      :size="350"
      x="80%"
      y="70%"
      :blur="90"
      :opacity="appStore.isDark ? 0.12 : 0.06"
      :duration="12"
    />
    <!-- Toast 通知 -->
    <HxToast ref="toastRef" />
    <aside class="sidebar">
      <!-- Brand -->
      <div class="sidebar-brand">
        <IconBrandLogo :width="120" :height="24" :dark="appStore.isDark" />
        <span class="brand-version">v0.3</span>
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

      <!-- Session list -->
      <div class="session-list">
        <div class="session-list-header">
          <span class="session-list-title">会话</span>
          <button class="new-session-btn" @click="chatStore.newSession(); router.push('/')" title="新建会话">+</button>
        </div>
        <div class="session-items">
          <transition-group name="session-anim" tag="div">
            <div
              v-for="s in chatStore.sortedSessions"
              :key="s.id"
              :class="['session-item', { active: s.id === chatStore.activeSessionId }]"
              @click="chatStore.switchSession(s.id); router.push('/')"
            >
              <span class="session-item-title">{{ s.title }}</span>
              <span class="session-item-count">{{ s.messages.filter(m => m.role === 'user').length }}</span>
              <button
                v-if="chatStore.sessions.length > 1 && confirmDeleteId !== s.id"
                class="session-delete-btn"
                @click.stop="confirmDeleteId = s.id"
                title="删除会话"
              >
                <svg width="12" height="12" viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 42.666667C253.312 42.666667 42.666667 253.312 42.666667 512s210.645333 469.333333 469.333333 469.333333 469.333333-210.645333 469.333333-469.333333S770.688 42.666667 512 42.666667z m0 85.333333c212.565333 0 384 171.434667 384 384s-171.434667 384-384 384-384-171.434667-384-384 171.434667-384 384-384z"/> <path d="M640 341.333333a42.666667 42.666667 0 0 0-30.165333 12.501334l-256 256a42.666667 42.666667 0 0 0 0 60.330666 42.666667 42.666667 0 0 0 60.330666 0l256-256a42.666667 42.666667 0 0 0 0-60.330666A42.666667 42.666667 0 0 0 640 341.333333z"/> <path d="M384 341.333333a42.666667 42.666667 0 0 0-30.165333 12.501334 42.666667 42.666667 0 0 0 0 60.330666l256 256a42.666667 42.666667 0 0 0 60.330666 0 42.666667 42.666667 0 0 0 0-60.330666l-256-256A42.666667 42.666667 0 0 0 384 341.333333z"/></svg>
              </button>
              <span v-if="confirmDeleteId === s.id" class="confirm-delete" @click.stop>
                <button class="confirm-yes" @click.stop="chatStore.deleteSession(s.id); confirmDeleteId = ''" title="确认删除">删除</button>
                <button class="confirm-no" @click.stop="confirmDeleteId = ''" title="取消">取消</button>
              </span>
            </div>
          </transition-group>
        </div>
      </div>

      <!-- Footer -->
      <div class="sidebar-footer">
        <!-- Session info -->
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

        <!-- Model selector for gfw mode -->
        <div v-if="chatStore.providerMode !== 'custom'" class="model-select-wrap">
          <div class="model-dropdown" :class="{ open: modelDropdownOpen }">
            <button class="model-dropdown-trigger" @click.stop="modelDropdownOpen = !modelDropdownOpen">
              <span class="model-dropdown-value">{{ selectedModelDisplay }}</span>
              <svg class="model-dropdown-arrow" width="10" height="10" viewBox="0 0 1024 1024" fill="currentColor"><path d="M256 341.333333a42.666667 42.666667 0 0 0-30.165333 12.501334 42.666667 42.666667 0 0 0 0 60.330666l256 256a42.666667 42.666667 0 0 0 60.330666 0l256-256a42.666667 42.666667 0 0 0 0-60.330666 42.666667 42.666667 0 0 0-60.330666 0L512 579.669333 286.165333 353.834667A42.666667 42.666667 0 0 0 256 341.333333z"/></svg>
            </button>
            <div v-if="modelDropdownOpen" class="model-dropdown-panel" @click.stop>
              <div
                v-for="m in dropdownModels"
                :key="m.model_code"
                :class="['model-dropdown-item', { active: selectedModel === m.model_code }]"
                @click="selectedModel = m.model_code; modelDropdownOpen = false"
              >
                <span class="model-item-name">{{ m.model_name }}</span>
                <svg v-if="selectedModel === m.model_code" width="12" height="12" viewBox="0 0 1024 1024" fill="currentColor"><path d="M823.168 225.834667L384 665.002667l-183.168-183.168a42.666667 42.666667 0 0 0-60.330667 0 42.666667 42.666667 0 0 0 0 60.330666l213.333334 213.333334a42.666667 42.666667 0 0 0 60.330666 0l469.333334-469.333334a42.666667 42.666667 0 0 0 0-60.330666 42.666667 42.666667 0 0 0-60.330667 0z"/></svg>
              </div>
              <div v-if="!dropdownModels.length" class="model-dropdown-empty">暂无模型</div>
            </div>
          </div>
        </div>

        <!-- Theme toggle -->
        <button class="theme-btn" @click="appStore.toggleTheme" :title="appStore.isDark ? '切换亮色' : '切换暗色'">
          <IconSun v-if="appStore.isDark" :size="14" />
          <IconMoon v-else :size="14" />
          <span>{{ appStore.isDark ? '亮色' : '暗色' }}</span>
        </button>
      </div>
    </aside>
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
import SoftAurora from './components/fx/SoftAurora.vue'
import ParticleNetwork from './components/fx/ParticleNetwork.vue'
import GlowOrb from './components/fx/GlowOrb.vue'
import TechGrid from './components/fx/TechGrid.vue'
import AuroraFlow from './components/fx/AuroraFlow.vue'
import SplashScreen from './components/SplashScreen.vue'
import TitleBar from './components/TitleBar.vue'
import { HxToast } from './components/ui'
import { setToastInstance } from './composables/useToast'

const gfwStore = useGfwStore()
const chatStore = useChatStore()
const appStore = useAppStore()
const router = useRouter()
const { balance, featuredModels } = storeToRefs(gfwStore)
const { selectedModel } = storeToRefs(chatStore)
const confirmDeleteId = ref('')
const modelDropdownOpen = ref(false)
const showSplash = ref(true)
const toastRef = ref()

const selectedModelDisplay = computed(() => {
  const m = featuredModels.value.find(m => m.model_code === selectedModel.value)
  return m?.model_name || selectedModel.value || '选择模型...'
})

const dropdownModels = computed(() => {
  if (featuredModels.value.length > 0) return featuredModels.value
  if (selectedModel.value) return [{ model_code: selectedModel.value, model_name: selectedModel.value }]
  return []
})

// 点击外部关闭下拉
function handleGlobalClick() { modelDropdownOpen.value = false }

const activeModelDisplay = computed(() => {
  if (chatStore.providerMode === 'custom' && chatStore.customProvider.model) {
    return chatStore.customProvider.model
  }
  return selectedModel.value || 'no model'
})

onMounted(async () => {
  document.addEventListener('click', handleGlobalClick)
  // Register global toast instance
  setToastInstance(toastRef.value)
  try {
    await gfwStore.fetchUserInfo()
    await gfwStore.fetchModels()
  } catch {
    // User not logged in yet
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleGlobalClick)
})
</script>

<style>
/* ===== CSS Custom Properties — iOS 27 Glass Design System ===== */
:root,
[data-theme="light"] {
  --color-primary: #0070FF;
  --color-primary-light: #E8F3FF;
  --color-primary-dark: #0050CC;
  --color-accent: #6C38FF;
  --color-bg-page: #F2F2F7;
  --color-bg-card: rgba(255,255,255,0.55);
  --color-bg-card-solid: #FFFFFF;
  --color-bg-input: rgba(120,120,128,0.06);
  --color-bg-sidebar: rgba(242,242,247,0.55);
  --color-text-primary: #1C1C1E;
  --color-text-secondary: #636366;
  --color-text-tertiary: #AEAEB2;
  --color-border: rgba(60,60,67,0.10);
  --color-border-subtle: rgba(60,60,67,0.05);
  --color-success: #30D158;
  --color-warning: #FF9F0A;
  --color-error: #FF453A;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04);
  --shadow-card-hover: 0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
  --shadow-float: 0 12px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06);
  --radius-card: 20px;
  --radius-btn: 12px;
  --radius-input: 12px;
  --radius-pill: 100px;
  --font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Cascadia Code', 'Consolas', monospace;
  /* iOS 27 Glass — deeper blur, lower opacity, more transparent */
  --glass-bg: rgba(255,255,255,0.45);
  --glass-border: rgba(255,255,255,0.30);
  --glass-blur: 32px;
  --glass-saturate: 1.8;
  --glass-shadow-inset: inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.04);
  /* Spring animation tokens */
  --spring-bounce: cubic-bezier(.34,1.56,.64,1);
  --spring-smooth: cubic-bezier(.16,1,.3,1);
  --spring-snap: cubic-bezier(.68,-.6,.32,1.6);
  --ease-out-expo: cubic-bezier(.19,1,.22,1);
  --transition-fast: 0.15s var(--spring-smooth);
  --transition-medium: 0.3s var(--spring-smooth);
  --transition-slow: 0.5s var(--spring-smooth);
  --transition-bounce: 0.4s var(--spring-bounce);
  /* Message colors */
  --color-msg-user-bg: #1C1C1E;
  --color-msg-user-text: #F2F2F7;
  --color-msg-ai-bg: transparent;
  --color-msg-ai-text: #1C1C1E;
  --color-msg-ai-border: rgba(60,60,67,0.08);
  --color-code-bg: #0D1117;
  --color-code-border: #30363D;
  --color-balance-bg: rgba(120,120,128,0.06);
  --color-tool-bg: rgba(120,120,128,0.03);
}

[data-theme="dark"] {
  --color-primary: #0A84FF;
  --color-primary-light: rgba(10,132,255,0.12);
  --color-primary-dark: #409CFF;
  --color-accent: #BF5AF2;
  --color-bg-page: #000000;
  --color-bg-card: rgba(28,28,30,0.50);
  --color-bg-card-solid: #1C1C1E;
  --color-bg-input: rgba(120,120,128,0.16);
  --color-bg-sidebar: rgba(0,0,0,0.50);
  --color-text-primary: #F2F2F7;
  --color-text-secondary: #AEAEB2;
  --color-text-tertiary: #636366;
  --color-border: rgba(84,84,88,0.35);
  --color-border-subtle: rgba(84,84,88,0.18);
  --color-success: #30D158;
  --color-warning: #FF9F0A;
  --color-error: #FF453A;
  --shadow-card: 0 1px 4px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.15);
  --shadow-card-hover: 0 8px 32px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.15);
  --shadow-float: 0 16px 48px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.2);
  /* iOS 27 Glass Dark — deeper, more translucent */
  --glass-bg: rgba(38,38,40,0.40);
  --glass-border: rgba(84,84,88,0.25);
  --glass-blur: 36px;
  --glass-saturate: 1.6;
  --glass-shadow-inset: inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.15);
  /* Message colors */
  --color-msg-user-bg: rgba(120,120,128,0.16);
  --color-msg-user-text: #F2F2F7;
  --color-msg-ai-bg: transparent;
  --color-msg-ai-text: #F2F2F7;
  --color-msg-ai-border: rgba(84,84,88,0.30);
  --color-code-bg: #0D1117;
  --color-code-border: #30363D;
  --color-balance-bg: rgba(120,120,128,0.12);
  --color-tool-bg: rgba(120,120,128,0.06);
}

/* ===== Global spring transitions ===== */
*, *::before, *::after {
  transition-timing-function: var(--spring-smooth);
}

/* ===== Reset ===== */
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: var(--font-family);
  background: var(--color-bg-page);
  color: var(--color-text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
  transition: background 0.3s, color 0.3s;
}

/* ===== iOS 27 Aurora Background — replaces static gradients ===== */
.app::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 80% 60% at 10% 20%, rgba(0,112,255,0.06) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 85% 75%, rgba(108,56,255,0.05) 0%, transparent 55%);
  pointer-events: none;
}

[data-theme="dark"] .app::before {
  background:
    radial-gradient(ellipse 80% 60% at 10% 20%, rgba(10,132,255,0.08) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 85% 75%, rgba(191,90,242,0.06) 0%, transparent 55%);
}

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--color-text-tertiary); }

/* ===== App layout ===== */
.app {
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: var(--color-bg-page);
}

/* 窗口拖拽区域 — 覆盖顶部 32px */
.window-drag-area {
  position: fixed;
  top: 0;
  left: 0;
  right: 138px; /* 给右上角按钮留空 (46*3=138) */
  height: 32px;
  -webkit-app-region: drag;
  z-index: 99998;
  pointer-events: auto;
}

/* ===== Sidebar — iOS 27 deep glass ===== */
.sidebar {
  width: 220px;
  min-width: 220px;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow-inset), 1px 0 0 rgba(255,255,255,0.02);
  user-select: none;
  transition: background 0.4s var(--spring-smooth), border-color 0.4s;
  position: relative;
  z-index: 2;
}

@media (max-width: 768px) {
  .sidebar {
    width: 60px;
    min-width: 60px;
  }
  .sidebar .sidebar-brand span,
  .sidebar .nav-label,
  .sidebar .session-title,
  .sidebar .sidebar-footer .model-info,
  .sidebar .sidebar-footer .balance-row {
    display: none;
  }
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 16px 16px;
}

/* Brand version tag */
.brand-version {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-tertiary);
  background: var(--color-bg-input);
  padding: 2px 5px;
  border-radius: 3px;
  margin-left: auto;
}

/* Navigation */
.sidebar-nav {
  padding: 4px 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-btn);
  color: var(--color-text-secondary);
  text-decoration: none;
  margin-bottom: 1px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.25s var(--spring-bounce);
  cursor: pointer;
  position: relative;
}

.nav-item:hover {
  transform: translateX(3px);
}

.nav-item:active {
  transform: scale(0.97) translateX(2px);
}

.nav-item.active {
  transform: translateX(0);
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  opacity: 0.7;
}

.nav-shortcut {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-tertiary);
  background: var(--color-bg-input);
  padding: 1px 5px;
  border-radius: 3px;
  border: 1px solid var(--color-border);
  opacity: 0;
  transition: opacity 0.15s;
}

.nav-item:hover .nav-shortcut { opacity: 1; }

.nav-item:hover {
  background: var(--color-bg-input);
  color: var(--color-text-primary);
}

.nav-item:hover .nav-icon { opacity: 1; }

.nav-item.router-link-active,
.nav-item.active {
  background: var(--color-bg-input);
  color: var(--color-text-primary);
}

.nav-item.router-link-active .nav-icon,
.nav-item.active .nav-icon {
  opacity: 1;
  color: var(--color-primary);
}

/* Session list */
.session-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-top: 1px solid var(--color-border);
  -webkit-app-region: no-drag;
}

.session-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px 6px;
}

.session-list-title {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.new-session-btn {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-tertiary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.12s;
  font-family: var(--font-mono);
}

.new-session-btn:hover {
  border-color: var(--color-text-secondary);
  color: var(--color-text-primary);
}

.session-items {
  flex: 1;
  overflow-y: auto;
  padding: 0 6px 8px;
}

.session-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: var(--radius-btn);
  cursor: pointer;
  transition: background 0.1s;
  margin-bottom: 1px;
}

.session-item:hover {
  background: var(--color-bg-input);
}

.session-item.active {
  background: var(--color-bg-input);
}

.session-item-title {
  flex: 1;
  font-size: 12px;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.session-item.active .session-item-title {
  color: var(--color-text-primary);
  font-weight: 500;
}

.session-item-count {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--color-text-tertiary);
  background: var(--color-bg-input);
  padding: 1px 4px;
  border-radius: 3px;
  flex-shrink: 0;
}

.session-delete-btn {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--color-text-tertiary);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.1s, color 0.1s;
  flex-shrink: 0;
  padding: 0;
}

.session-item:hover .session-delete-btn {
  opacity: 1;
}

.session-delete-btn:hover {
  color: var(--color-error);
}

/* 确认删除 */
.confirm-delete {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  animation: fadeSlide 0.15s ease;
}

@keyframes fadeSlide {
  from { opacity: 0; transform: translateX(4px); }
  to { opacity: 1; transform: translateX(0); }
}

.confirm-yes {
  padding: 1px 6px;
  background: var(--color-error);
  border: none;
  border-radius: 4px;
  color: #fff;
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.1s;
}

.confirm-yes:hover { opacity: 0.85; }

.confirm-no {
  padding: 1px 6px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-tertiary);
  font-family: var(--font-mono);
  font-size: 9px;
  cursor: pointer;
  transition: all 0.1s;
}

.confirm-no:hover {
  border-color: var(--color-text-secondary);
  color: var(--color-text-secondary);
}

.session-items::-webkit-scrollbar { width: 3px; }
.session-items::-webkit-scrollbar-track { background: transparent; }
.session-items::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 2px; }

/* Sidebar footer */
.sidebar-footer {
  padding: 12px 12px 16px;
  border-top: 1px solid var(--glass-border);
  -webkit-app-region: no-drag;
  background: var(--glass-bg);
  backdrop-filter: blur(16px) saturate(1.5);
  -webkit-backdrop-filter: blur(16px) saturate(1.5);
}

.session-block {
  margin-bottom: 12px;
}

.session-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 0;
}

.session-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-green { background: var(--color-success); }
.dot-blue { background: var(--color-primary); }
.dot-dim { background: var(--color-text-tertiary); opacity: 0.5; }

.session-label {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-label.dim {
  color: var(--color-text-tertiary);
}

.balance-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  margin-bottom: 8px;
}

.balance-label {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.balance-value {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.model-select-wrap {
  margin-bottom: 10px;
  position: relative;
}

.model-dropdown {
  position: relative;
}

.model-dropdown-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-btn);
  color: var(--color-text-primary);
  font-family: var(--font-mono);
  font-size: 11px;
  cursor: pointer;
  transition: border-color 0.15s;
}

.model-dropdown-trigger:hover { border-color: var(--color-text-tertiary); }
.model-dropdown.open .model-dropdown-trigger { border-color: var(--color-primary); }

.model-dropdown-value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  text-align: left;
}

.model-dropdown-arrow {
  flex-shrink: 0;
  color: var(--color-text-tertiary);
  transition: transform 0.15s;
}

.model-dropdown.open .model-dropdown-arrow { transform: rotate(180deg); }

.model-dropdown-panel {
  position: absolute;
  bottom: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 240px;
  overflow-y: auto;
  background: var(--color-bg-card-solid);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-btn);
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  z-index: 100;
  padding: 4px;
  animation: dropUp 0.12s ease;
}

@keyframes dropUp {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.model-dropdown-panel::-webkit-scrollbar { width: 3px; }
.model-dropdown-panel::-webkit-scrollbar-track { background: transparent; }
.model-dropdown-panel::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 2px; }

.model-dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.1s;
}

.model-dropdown-item:hover {
  background: var(--color-bg-input);
  color: var(--color-text-primary);
}

.model-dropdown-item.active {
  color: var(--color-primary);
  font-weight: 600;
}

.model-item-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.model-dropdown-empty {
  padding: 12px 8px;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-tertiary);
}

.theme-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 6px 10px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-btn);
  color: var(--color-text-tertiary);
  font-family: var(--font-mono);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
}

.theme-btn:hover {
  border-color: var(--color-text-tertiary);
  color: var(--color-text-secondary);
}

/* ===== Main Content ===== */
.main-content {
  flex: 1;
  overflow: hidden;
  position: relative;
  z-index: 1;
  transition: background 0.3s;
}
/* ===== Session list transition — q弹入场 ===== */
.session-anim-enter-active {
  transition: all 0.35s var(--spring-bounce);
}
.session-anim-leave-active {
  transition: all 0.25s var(--spring-smooth);
}
.session-anim-enter-from {
  opacity: 0;
  transform: translateX(-12px) scale(0.95);
}
.session-anim-leave-to {
  opacity: 0;
  transform: translateX(12px) scale(0.95);
}
.session-anim-move {
  transition: transform 0.3s var(--spring-bounce);
}

/* ===== Route page transition ===== */
.page-fade-enter-active {
  transition: opacity 0.3s var(--spring-smooth), transform 0.3s var(--spring-smooth);
}
.page-fade-leave-active {
  transition: opacity 0.15s ease;
}
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-fade-leave-to {
  opacity: 0;
}

/* ===== Global button bounce ===== */
button, .btn-primary, .btn-secondary, [role="button"] {
  transition: all 0.2s var(--spring-bounce);
}
button:active, .btn-primary:active, .btn-secondary:active {
  transform: scale(0.96);
}
</style>
