<template>
  <div class="app">
    <aside class="sidebar">
      <!-- Brand -->
      <div class="sidebar-brand">
        <IconBrandLogo :width="100" :height="32" color="var(--color-text-primary)" />
        <span class="brand-version">v0.1</span>
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
        <router-link to="/settings" class="nav-item" :class="{ active: $route.path === '/settings' }">
          <span class="nav-icon"><IconSettings :size="18" /></span>
          <span class="nav-label">设置</span>
          <kbd class="nav-shortcut">3</kbd>
        </router-link>
      </nav>

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
          <select v-model="selectedModel" class="model-select">
            <option v-for="m in featuredModels" :key="m.id" :value="m.id">{{ m.name }}</option>
            <option v-if="!featuredModels.length && selectedModel" :value="selectedModel">{{ selectedModel }}</option>
          </select>
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
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
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

const gfwStore = useGfwStore()
const chatStore = useChatStore()
const appStore = useAppStore()
const { balance, featuredModels } = storeToRefs(gfwStore)
const { selectedModel } = storeToRefs(chatStore)

const activeModelDisplay = computed(() => {
  if (chatStore.providerMode === 'custom' && chatStore.customProvider.model) {
    return chatStore.customProvider.model
  }
  return selectedModel.value || 'no model'
})

onMounted(async () => {
  try {
    await gfwStore.fetchUserInfo()
    await gfwStore.fetchModels()
  } catch {
    // User not logged in yet
  }
})
</script>

<style>
/* ===== CSS Custom Properties ===== */
:root,
[data-theme="light"] {
  --color-primary: #0070FF;
  --color-primary-light: #E8F3FF;
  --color-primary-dark: #0050CC;
  --color-accent: #6C38FF;
  --color-bg-page: #FAFAFA;
  --color-bg-card: #FFFFFF;
  --color-bg-input: #F4F4F5;
  --color-bg-sidebar: #FAFAFA;
  --color-text-primary: #18181B;
  --color-text-secondary: #52525B;
  --color-text-tertiary: #A1A1AA;
  --color-border: #E4E4E7;
  --color-border-subtle: #F4F4F5;
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-card-hover: 0 4px 12px rgba(0,0,0,0.08);
  --radius-card: 8px;
  --radius-btn: 6px;
  --radius-input: 6px;
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', 'Noto Sans', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Cascadia Code', 'Consolas', monospace;

  --color-msg-user-bg: #18181B;
  --color-msg-user-text: #FAFAFA;
  --color-msg-ai-bg: transparent;
  --color-msg-ai-text: #18181B;
  --color-msg-ai-border: #E4E4E7;
  --color-code-bg: #0D1117;
  --color-code-border: #30363D;
  --color-balance-bg: #F4F4F5;
  --color-tool-bg: #F9FAFB;
}

[data-theme="dark"] {
  --color-primary: #3B82F6;
  --color-primary-light: #1E293B;
  --color-primary-dark: #60A5FA;
  --color-accent: #8B5CF6;
  --color-bg-page: #09090B;
  --color-bg-card: #18181B;
  --color-bg-input: #27272A;
  --color-bg-sidebar: #09090B;
  --color-text-primary: #FAFAFA;
  --color-text-secondary: #A1A1AA;
  --color-text-tertiary: #52525B;
  --color-border: #27272A;
  --color-border-subtle: #1C1C1F;
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.3);
  --shadow-card-hover: 0 4px 12px rgba(0,0,0,0.4);

  --color-msg-user-bg: #27272A;
  --color-msg-user-text: #FAFAFA;
  --color-msg-ai-bg: transparent;
  --color-msg-ai-text: #FAFAFA;
  --color-msg-ai-border: #27272A;
  --color-code-bg: #0D1117;
  --color-code-border: #30363D;
  --color-balance-bg: #18181B;
  --color-tool-bg: #111113;
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
  transition: background 0.2s, color 0.2s;
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
}

/* ===== Sidebar ===== */
.sidebar {
  width: 220px;
  min-width: 220px;
  background: var(--color-bg-sidebar);
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--color-border);
  user-select: none;
  -webkit-app-region: drag;
  transition: background 0.2s, border-color 0.2s;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 16px 16px;
  -webkit-app-region: drag;
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
  flex: 1;
  padding: 4px 8px;
  -webkit-app-region: no-drag;
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
  transition: all 0.15s;
  cursor: pointer;
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

/* Sidebar footer */
.sidebar-footer {
  padding: 12px 12px 16px;
  border-top: 1px solid var(--color-border);
  -webkit-app-region: no-drag;
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
}

.model-select {
  width: 100%;
  padding: 6px 8px;
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-btn);
  color: var(--color-text-primary);
  font-family: var(--font-mono);
  font-size: 11px;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23A1A1AA' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 24px;
  transition: border-color 0.15s;
}

.model-select:hover { border-color: var(--color-text-tertiary); }
.model-select:focus { outline: none; border-color: var(--color-primary); }

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
  background: var(--color-bg-page);
  transition: background 0.2s;
}
</style>
