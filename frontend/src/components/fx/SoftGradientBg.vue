<template>
  <div class="soft-gradient-bg" :class="{ 'theme-dark': isDark, 'theme-light': !isDark }">
    <!-- 渐变层 -->
    <div class="gradient-layer gradient-1"></div>
    <div class="gradient-layer gradient-2"></div>
    <div class="gradient-layer gradient-3"></div>
    <!-- 噪点纹理层 -->
    <div class="noise-layer"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const isDark = computed(() => appStore.isDark)
</script>

<style scoped>
.soft-gradient-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

/* ===== 渐变层基础样式 ===== */
.gradient-layer {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.4;
  will-change: transform;
}

/* ===== 暗色主题 ===== */
.theme-dark .gradient-1 {
  width: 60vw;
  height: 60vw;
  top: -20%;
  left: -10%;
  background: radial-gradient(circle, rgba(10, 132, 255, 0.35) 0%, transparent 70%);
  animation: float1 25s ease-in-out infinite;
}

.theme-dark .gradient-2 {
  width: 50vw;
  height: 50vw;
  top: 30%;
  right: -15%;
  background: radial-gradient(circle, rgba(191, 90, 242, 0.25) 0%, transparent 70%);
  animation: float2 30s ease-in-out infinite;
}

.theme-dark .gradient-3 {
  width: 45vw;
  height: 45vw;
  bottom: -10%;
  left: 20%;
  background: radial-gradient(circle, rgba(48, 209, 88, 0.2) 0%, transparent 70%);
  animation: float3 28s ease-in-out infinite;
}

/* ===== 亮色主题 ===== */
.theme-light .gradient-1 {
  width: 60vw;
  height: 60vw;
  top: -20%;
  left: -10%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, transparent 70%);
  animation: float1 25s ease-in-out infinite;
}

.theme-light .gradient-2 {
  width: 50vw;
  height: 50vw;
  top: 30%;
  right: -15%;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%);
  animation: float2 30s ease-in-out infinite;
}

.theme-light .gradient-3 {
  width: 45vw;
  height: 45vw;
  bottom: -10%;
  left: 20%;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
  animation: float3 28s ease-in-out infinite;
}

/* ===== 缓慢浮动动画 ===== */
@keyframes float1 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(8vw, 5vh) scale(1.05);
  }
  50% {
    transform: translate(-5vw, 8vh) scale(0.95);
  }
  75% {
    transform: translate(3vw, -3vh) scale(1.02);
  }
}

@keyframes float2 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(-6vw, 4vh) scale(1.03);
  }
  50% {
    transform: translate(7vw, -6vh) scale(0.97);
  }
  75% {
    transform: translate(-3vw, -4vh) scale(1.01);
  }
}

@keyframes float3 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(5vw, -5vh) scale(1.04);
  }
  50% {
    transform: translate(-8vw, 3vh) scale(0.96);
  }
  75% {
    transform: translate(4vw, 6vh) scale(1.02);
  }
}

/* ===== 噪点纹理 ===== */
.noise-layer {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
  pointer-events: none;
}

.theme-dark .noise-layer {
  opacity: 0.04;
  mix-blend-mode: overlay;
}

.theme-light .noise-layer {
  opacity: 0.02;
  mix-blend-mode: multiply;
}
</style>
