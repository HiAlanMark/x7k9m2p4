<template>
  <div class="titlebar-buttons">
    <button class="tb-btn tb-minimize" @click="minimize" title="最小化">
      <svg width="10" height="1" viewBox="0 0 10 1"><rect width="10" height="1" fill="currentColor"/></svg>
    </button>
    <button class="tb-btn tb-maximize" @click="toggleMaximize" :title="isMaximized ? '还原' : '最大化'">
      <svg v-if="!isMaximized" width="10" height="10" viewBox="0 0 10 10">
        <rect x="0.5" y="0.5" width="9" height="9" rx="1.5" fill="none" stroke="currentColor" stroke-width="1"/>
      </svg>
      <svg v-else width="10" height="10" viewBox="0 0 10 10">
        <rect x="2.5" y="0.5" width="7" height="7" rx="1" fill="none" stroke="currentColor" stroke-width="1"/>
        <rect x="0.5" y="2.5" width="7" height="7" rx="1" fill="none" stroke="currentColor" stroke-width="1"/>
      </svg>
    </button>
    <button class="tb-btn tb-close" @click="closeWindow" title="关闭">
      <svg width="10" height="10" viewBox="0 0 10 10">
        <line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        <line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isMaximized = ref(false)

function minimize() {
  window.postMessage({ type: 'window-minimize' }, '*')
}

function toggleMaximize() {
  isMaximized.value = !isMaximized.value
  window.postMessage({ type: 'window-maximize' }, '*')
}

function closeWindow() {
  window.postMessage({ type: 'window-close' }, '*')
  setTimeout(() => window.close(), 200)
}
</script>

<style scoped>
.titlebar-buttons {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  -webkit-app-region: no-drag;
}

.tb-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.tb-btn:hover {
  background: rgba(128,128,128,0.15);
}

.tb-close:hover {
  background: #E81123;
  color: #fff;
}

.tb-btn:active {
  opacity: 0.7;
}
</style>
