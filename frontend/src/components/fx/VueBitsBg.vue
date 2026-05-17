<template>
  <div class="vuebits-bg">
    <div class="vuebits-bg__gradient" />
    <div class="vuebits-bg__grid" />
    <div class="vuebits-bg__orb vuebits-bg__orb--1" />
    <div class="vuebits-bg__orb vuebits-bg__orb--2" />
    <div class="vuebits-bg__orb vuebits-bg__orb--3" />
    <slot />
  </div>
</template>

<script setup lang="ts">
// VueBits-inspired animated background
// Features: gradient mesh, grid overlay, floating orbs
</script>

<style scoped>
.vuebits-bg {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.vuebits-bg__gradient {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(at 0% 0%, rgba(10, 132, 255, 0.08) 0%, transparent 50%),
    radial-gradient(at 100% 0%, rgba(191, 90, 242, 0.06) 0%, transparent 50%),
    radial-gradient(at 100% 100%, rgba(10, 132, 255, 0.05) 0%, transparent 50%),
    radial-gradient(at 0% 100%, rgba(90, 200, 250, 0.04) 0%, transparent 50%);
  animation: gradientShift 15s ease-in-out infinite;
}

.vuebits-bg__grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(var(--border-base) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-base) 1px, transparent 1px);
  background-size: 60px 60px;
  background-position: 0 0;
  opacity: 0.03;
  animation: gridMove 20s linear infinite;
}

.vuebits-bg__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: orbFloat 20s ease-in-out infinite;
}

.vuebits-bg__orb--1 {
  width: 400px;
  height: 400px;
  background: var(--primary);
  top: -10%;
  left: -5%;
  animation-delay: 0s;
}

.vuebits-bg__orb--2 {
  width: 300px;
  height: 300px;
  background: var(--secondary);
  bottom: -5%;
  right: -10%;
  animation-delay: -7s;
}

.vuebits-bg__orb--3 {
  width: 250px;
  height: 250px;
  background: var(--accent);
  top: 50%;
  left: 50%;
  animation-delay: -14s;
}

@keyframes gradientShift {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

@keyframes gridMove {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 60px 60px;
  }
}

@keyframes orbFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(10%, 15%) scale(1.1);
  }
  50% {
    transform: translate(-5%, 10%) scale(0.9);
  }
  75% {
    transform: translate(-15%, -10%) scale(1.05);
  }
}

/* Light theme adjustments */
[data-theme="light"] .vuebits-bg__gradient {
  background: 
    radial-gradient(at 0% 0%, rgba(0, 102, 204, 0.04) 0%, transparent 50%),
    radial-gradient(at 100% 0%, rgba(191, 90, 242, 0.03) 0%, transparent 50%),
    radial-gradient(at 100% 100%, rgba(0, 102, 204, 0.03) 0%, transparent 50%),
    radial-gradient(at 0% 100%, rgba(90, 200, 250, 0.02) 0%, transparent 50%);
}

[data-theme="light"] .vuebits-bg__grid {
  opacity: 0.02;
}

[data-theme="light"] .vuebits-bg__orb {
  opacity: 0.2;
}
</style>
