<template>
  <div class="app">
    <aside class="sidebar">
      <div class="sidebar-brand">
        <div class="brand-icon">
          <IconStore :size="26" />
        </div>
        <span class="brand-name">Hermes</span>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/" class="nav-item">
          <span class="nav-icon"><IconChat :size="20" /></span>
          <span class="nav-label">对话</span>
        </router-link>
        <router-link to="/skills" class="nav-item">
          <span class="nav-icon"><IconStore :size="20" /></span>
          <span class="nav-label">Skill 商店</span>
        </router-link>
        <router-link to="/settings" class="nav-item">
          <span class="nav-icon"><IconSettings :size="20" /></span>
          <span class="nav-label">设置</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <div class="balance-card">
          <div class="balance-row">
            <span class="balance-icon"><IconStar :size="16" /></span>
            <span class="balance-label">G币余额</span>
          </div>
          <div class="balance-amount">{{ balance.toFixed(2) }}</div>
        </div>
        <div class="model-selector">
          <span class="selector-label">当前模型</span>
          <div v-if="chatStore.providerMode === 'custom' && chatStore.customProvider.model" class="custom-model-display">
            {{ chatStore.customProvider.model }}
          </div>
          <div v-else class="select-wrap">
            <select v-model="selectedModel">
              <option v-for="m in featuredModels" :key="m.id" :value="m.id">
                {{ m.name }}
              </option>
              <option v-if="!featuredModels.length && selectedModel" :value="selectedModel">
                {{ selectedModel }}
              </option>
            </select>
          </div>
        </div>
        <button class="theme-toggle" @click="appStore.toggleTheme" :title="appStore.isDark ? '切换亮色' : '切换暗色'">
          <IconSun v-if="appStore.isDark" :size="18" />
          <IconMoon v-else :size="18" />
          <span>{{ appStore.isDark ? '亮色模式' : '暗色模式' }}</span>
        </button>
      </div>
    </aside>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
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

const gfwStore = useGfwStore()
const chatStore = useChatStore()
const appStore = useAppStore()
const { balance, featuredModels } = storeToRefs(gfwStore)
const { selectedModel } = storeToRefs(chatStore)

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
/* ===== Light Theme (Default) ===== */
:root,
[data-theme="light"] {
  --color-primary: #0070FF;
  --color-primary-light: #E8F3FF;
  --color-primary-dark: #0050CC;
  --color-accent: #6C38FF;
  --color-bg-page: #F5F7FA;
  --color-bg-card: #FFFFFF;
  --color-bg-input: #F2F3F5;
  --color-bg-sidebar: #FFFFFF;
  --color-text-primary: #1D2129;
  --color-text-secondary: #4E5969;
  --color-text-tertiary: #86909C;
  --color-border: #E5E6EB;
  --color-success: #00B42A;
  --color-warning: #FF7D00;
  --color-error: #F53F3F;
  --shadow-card: 0 2px 12px rgba(0,0,0,0.08);
  --shadow-card-hover: 0 4px 20px rgba(0,0,0,0.12);
  --radius-card: 12px;
  --radius-btn: 8px;
  --radius-input: 8px;
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;

  /* Message bubbles */
  --color-msg-user-bg: linear-gradient(135deg, #0070FF, #0050CC);
  --color-msg-user-text: #FFFFFF;
  --color-msg-ai-bg: #FFFFFF;
  --color-msg-ai-text: #1D2129;
  --color-msg-ai-border: #E5E6EB;

  /* Code blocks */
  --color-code-bg: #F8F9FA;
  --color-code-border: #0070FF;

  /* Balance card */
  --color-balance-bg: linear-gradient(135deg, #E8F3FF, #F0EAFF);

  /* Tool call */
  --color-tool-bg: #F7F8FA;
}

/* ===== Dark Theme ===== */
[data-theme="dark"] {
  --color-primary: #3B9EFF;
  --color-primary-light: #1A2744;
  --color-primary-dark: #2080FF;
  --color-accent: #9B6CFF;
  --color-bg-page: #0F1118;
  --color-bg-card: #1A1D2E;
  --color-bg-input: #252836;
  --color-bg-sidebar: #151722;
  --color-text-primary: #E8EAED;
  --color-text-secondary: #A0A6B4;
  --color-text-tertiary: #6B7280;
  --color-border: #2D3040;
  --color-success: #34D058;
  --color-warning: #FFAB40;
  --color-error: #FF5252;
  --shadow-card: 0 2px 12px rgba(0,0,0,0.3);
  --shadow-card-hover: 0 4px 20px rgba(0,0,0,0.4);

  --color-msg-user-bg: linear-gradient(135deg, #2563EB, #1D4ED8);
  --color-msg-user-text: #FFFFFF;
  --color-msg-ai-bg: #1E2030;
  --color-msg-ai-text: #E8EAED;
  --color-msg-ai-border: #2D3040;

  --color-code-bg: #0D0F1A;
  --color-code-border: #3B9EFF;

  --color-balance-bg: linear-gradient(135deg, #1A2744, #1E1640);

  --color-tool-bg: #14161F;
}

/* ===== Global Reset ===== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  background: var(--color-bg-page);
  color: var(--color-text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background 0.3s ease, color 0.3s ease;
}

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--color-text-tertiary); }

.app {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* ===== Sidebar ===== */
.sidebar {
  width: 240px;
  min-width: 240px;
  background: var(--color-bg-sidebar);
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--color-border);
  user-select: none;
  -webkit-app-region: drag;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px 20px;
  -webkit-app-region: drag;
}

.brand-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  border-radius: 10px;
  color: #FFFFFF;
  flex-shrink: 0;
}

.brand-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.3px;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 8px 12px;
  -webkit-app-region: no-drag;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: var(--radius-btn);
  color: var(--color-text-secondary);
  text-decoration: none;
  margin-bottom: 2px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-item:hover {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.nav-item.router-link-active {
  background: var(--color-primary);
  color: #FFFFFF;
}

.nav-item.router-link-active .nav-icon {
  color: #FFFFFF;
}

/* Sidebar footer */
.sidebar-footer {
  padding: 12px;
  border-top: 1px solid var(--color-border);
  -webkit-app-region: no-drag;
}

.balance-card {
  background: var(--color-balance-bg);
  border-radius: var(--radius-card);
  padding: 14px 16px;
  margin-bottom: 12px;
  transition: background 0.3s ease;
}

.balance-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.balance-icon {
  display: flex;
  align-items: center;
  color: var(--color-warning);
}

.balance-label {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.balance-amount {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: -0.5px;
}

.model-selector {
  padding: 0 4px;
  margin-bottom: 12px;
}

.selector-label {
  display: block;
  font-size: 11px;
  color: var(--color-text-tertiary);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.select-wrap { position: relative; }

.select-wrap select {
  width: 100%;
  padding: 8px 12px;
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
  color: var(--color-text-primary);
  font-size: 13px;
  font-family: var(--font-family);
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2386909C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 30px;
  transition: border-color 0.2s, background 0.3s;
}

.select-wrap select:hover { border-color: var(--color-primary); }
.select-wrap select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(0, 112, 255, 0.1);
}

.custom-model-display {
  padding: 8px 12px;
  background: var(--color-bg-input);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-input);
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 500;
}

/* ===== Theme Toggle Button ===== */
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 14px;
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-btn);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-family: var(--font-family);
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

/* ===== Main Content ===== */
.main-content {
  flex: 1;
  overflow: hidden;
  background: var(--color-bg-page);
  transition: background 0.3s ease;
}
</style>
