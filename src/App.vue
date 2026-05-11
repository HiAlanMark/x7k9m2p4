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
          <div class="select-wrap">
            <select v-model="selectedModel">
              <option v-for="m in featuredModels" :key="m.id" :value="m.id">
                {{ m.name }}
              </option>
            </select>
          </div>
        </div>
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
import { storeToRefs } from 'pinia'
import IconChat from './components/icons/IconChat.vue'
import IconStore from './components/icons/IconStore.vue'
import IconSettings from './components/icons/IconSettings.vue'
import IconStar from './components/icons/IconStar.vue'

const gfwStore = useGfwStore()
const chatStore = useChatStore()
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
:root {
  --color-primary: #0070FF;
  --color-primary-light: #E8F3FF;
  --color-primary-dark: #0050CC;
  --color-accent: #6C38FF;
  --color-bg-page: #F5F7FA;
  --color-bg-card: #FFFFFF;
  --color-bg-input: #F2F3F5;
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
}

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
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary);
}

.app {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* ===== Sidebar ===== */
.sidebar {
  width: 240px;
  min-width: 240px;
  background: var(--color-bg-card);
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--color-border);
  user-select: none;
  -webkit-app-region: drag;
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
  background: linear-gradient(135deg, #E8F3FF, #F0EAFF);
  border-radius: var(--radius-card);
  padding: 14px 16px;
  margin-bottom: 12px;
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
}

.selector-label {
  display: block;
  font-size: 11px;
  color: var(--color-text-tertiary);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.select-wrap {
  position: relative;
}

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
  transition: border-color 0.2s;
}

.select-wrap select:hover {
  border-color: var(--color-primary);
}

.select-wrap select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(0, 112, 255, 0.1);
}

/* ===== Main Content ===== */
.main-content {
  flex: 1;
  overflow: hidden;
  background: var(--color-bg-page);
}
</style>
