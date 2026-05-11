<template>
  <div class="app">
    <div class="sidebar">
      <div class="sidebar-header">
        <IconStore :size="24" />
        <h2>Hermes</h2>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/" class="nav-item">
          <IconChat :size="20" />
          <span>对话</span>
        </router-link>
        <router-link to="/skills" class="nav-item">
          <IconStore :size="20" />
          <span>Skill 商店</span>
        </router-link>
        <router-link to="/settings" class="nav-item">
          <IconSettings :size="20" />
          <span>设置</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <div class="balance-display">
          <IconStar :size="16" />
          <span>G币余额</span>
          <span class="amount">{{ balance.toFixed(2) }}</span>
        </div>
        <div class="model-selector">
          <select v-model="selectedModel">
            <option v-for="m in featuredModels" :key="m.id" :value="m.id">
              {{ m.name }}
            </option>
          </select>
        </div>
      </div>
    </div>
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
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --bg-input: #2a2a4a;
  --border-color: #3a3a5a;
  --text-primary: #e0e0e0;
  --text-secondary: #888888;
  --accent-primary: #0a84ff;
  --accent-secondary: #00d4ff;
  --accent-success: #00c853;
  --accent-warning: #ffa500;
  --accent-error: #ff1744;
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  background: var(--bg-primary);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 260px;
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border-color);
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  color: var(--accent-secondary);
}

.sidebar-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  color: var(--text-primary);
  text-decoration: none;
  margin-bottom: 4px;
  transition: background 0.2s;
}

.nav-item:hover {
  background: var(--bg-input);
}

.nav-item.router-link-active {
  background: var(--accent-primary);
  color: #ffffff;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--border-color);
}

.balance-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0 12px;
  font-size: 0.9rem;
}

.balance-display .amount {
  margin-left: auto;
  color: var(--accent-secondary);
  font-weight: 600;
}

.model-selector select {
  width: 100%;
  padding: 10px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 0.85rem;
  cursor: pointer;
}

.model-selector select:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.main-content {
  flex: 1;
  overflow: hidden;
  background: var(--bg-primary);
}
</style>
