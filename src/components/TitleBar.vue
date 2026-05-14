<template>
  <div class="titlebar" @dblclick="toggleMaximize">
    <div class="titlebar-drag">
      <span class="titlebar-title">Hi!XNS</span>
    </div>
    <div class="titlebar-controls">
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
      <button class="tb-btn tb-close" @click="close" title="关闭">
        <svg width="10" height="10" viewBox="0 0 10 10">
          <line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          <line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isMaximized = ref(false)

function minimize() {
  // webview doesn't have native minimize API, use JS workaround
  window.postMessage({ type: 'window-minimize' }, '*')
}

function toggleMaximize() {
  isMaximized.value = !isMaximized.value
  window.postMessage({ type: 'window-maximize' }, '*')
}

function close() {
  window.postMessage({ type: 'window-close' }, '*')
  // Fallback: close window directly
  setTimeout(() => window.close(), 100)
}
</script>

<style scoped>
.titlebar {
  display: flex;
  align-items: center;
  height: 32px;
  background: transparent;
  -webkit-app-region: drag;
  position: relative;
  z-index: 9998;
  flex-shrink: 0;
}

.titlebar-drag {
  flex: 1;
  display: flex;
  align-items: center;
  padding-left: 12px;
  height: 100%;
}

.titlebar-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  font-family: var(--font-mono);
  letter-spacing: 0.5px;
  opacity: 0.6;
  user-select: none;
}

.titlebar-controls {
  display: flex;
  align-items: center;
  -webkit-app-region: no-drag;
  height: 100%;
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
  background: var(--color-bg-input);
}

.tb-close:hover {
  background: #E81123;
  color: #fff;
}

.tb-btn:active {
  opacity: 0.7;
}
</style>
