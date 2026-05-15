<template>
  <transition name="splash-fade">
    <div v-if="visible" class="splash-screen">
      <div class="splash-content">
        <!-- Logo with pulse animation -->
        <div class="splash-logo" :class="{ 'logo-enter': logoVisible }">
          <img src="/logo.svg" alt="Hi!XNS" class="splash-logo-img" />
        </div>
        <!-- Brand text -->
        <div class="splash-brand" :class="{ 'brand-enter': brandVisible }">
          <span class="splash-title">Hi!XNS</span>
          <span class="splash-subtitle">AI Agent</span>
        </div>
        <!-- Loading bar -->
        <div class="splash-loader" :class="{ 'loader-enter': loaderVisible }">
          <div class="splash-loader-track">
            <div class="splash-loader-bar"></div>
          </div>
          <span class="splash-status">{{ status }}</span>
        </div>
      </div>
      <!-- Version -->
      <div class="splash-version">v0.4.4</div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  duration?: number
}>(), {
  duration: 2800
})

const emit = defineEmits<{ done: [] }>()

const visible = ref(true)
const logoVisible = ref(false)
const brandVisible = ref(false)
const loaderVisible = ref(false)
const status = ref('正在初始化...')

onMounted(() => {
  // Staggered entrance
  setTimeout(() => { logoVisible.value = true }, 100)
  setTimeout(() => { brandVisible.value = true }, 400)
  setTimeout(() => { loaderVisible.value = true; status.value = '加载组件...' }, 700)
  setTimeout(() => { status.value = '连接服务...' }, 1400)
  setTimeout(() => { status.value = '准备就绪' }, 2000)
  setTimeout(() => {
    visible.value = false
    setTimeout(() => emit('done'), 500)
  }, props.duration)
})
</script>

<style scoped>
.splash-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  -webkit-app-region: drag;
}

.splash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

/* Logo */
.splash-logo {
  opacity: 0;
  transform: scale(0.6);
  transition: all 0.8s cubic-bezier(.34,1.56,.64,1);
}
.splash-logo.logo-enter {
  opacity: 1;
  transform: scale(1);
}
.splash-logo-img {
  width: 80px;
  height: 80px;
  filter: drop-shadow(0 0 30px rgba(10,132,255,0.3));
  animation: logoPulse 2s ease-in-out infinite;
}
@keyframes logoPulse {
  0%, 100% { filter: drop-shadow(0 0 20px rgba(10,132,255,0.2)); transform: scale(1); }
  50% { filter: drop-shadow(0 0 40px rgba(10,132,255,0.4)); transform: scale(1.03); }
}

/* Brand text */
.splash-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transform: translateY(12px);
  transition: all 0.6s cubic-bezier(.16,1,.3,1);
}
.splash-brand.brand-enter {
  opacity: 1;
  transform: translateY(0);
}
.splash-title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2px;
  font-family: var(--font-family, -apple-system, sans-serif);
}
.splash-subtitle {
  font-size: 13px;
  font-weight: 400;
  color: rgba(255,255,255,0.4);
  letter-spacing: 4px;
  text-transform: uppercase;
  font-family: var(--font-mono, monospace);
}

/* Loader */
.splash-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.5s cubic-bezier(.16,1,.3,1);
}
.splash-loader.loader-enter {
  opacity: 1;
  transform: translateY(0);
}
.splash-loader-track {
  width: 180px;
  height: 2px;
  background: rgba(255,255,255,0.08);
  border-radius: 2px;
  overflow: hidden;
}
.splash-loader-bar {
  height: 100%;
  width: 40%;
  background: linear-gradient(90deg, transparent, #0A84FF, transparent);
  border-radius: 2px;
  animation: loaderSlide 1.5s ease-in-out infinite;
}
@keyframes loaderSlide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}
.splash-status {
  font-size: 11px;
  color: rgba(255,255,255,0.3);
  font-family: var(--font-mono, monospace);
  transition: color 0.3s;
}

/* Version */
.splash-version {
  position: absolute;
  bottom: 24px;
  font-size: 10px;
  color: rgba(255,255,255,0.15);
  font-family: var(--font-mono, monospace);
}

/* Exit transition */
.splash-fade-leave-active {
  transition: opacity 0.5s cubic-bezier(.16,1,.3,1);
}
.splash-fade-leave-to {
  opacity: 0;
}
</style>
