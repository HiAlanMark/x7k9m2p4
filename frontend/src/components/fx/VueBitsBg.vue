<template>
  <div class="vuebits-bg">
    <!-- 渐变网格层 -->
    <div class="vuebits-bg__grid-layer">
      <div class="vuebits-bg__grid" />
      <div class="vuebits-bg__grid vuebits-bg__grid--alt" />
    </div>
    
    <!-- 粒子层 -->
    <div class="vuebits-bg__particles">
      <div 
        v-for="particle in particles" 
        :key="particle.id"
        class="vuebits-bg__particle"
        :style="{
          left: particle.x + '%',
          top: particle.y + '%',
          width: particle.size + 'px',
          height: particle.size + 'px',
          animationDelay: particle.delay + 's',
          animationDuration: particle.duration + 's'
        }"
      />
    </div>
    
    <!-- 光晕层 -->
    <div class="vuebits-bg__glow-layer">
      <div class="vuebits-bg__orb vuebits-bg__orb--1" />
      <div class="vuebits-bg__orb vuebits-bg__orb--2" />
      <div class="vuebits-bg__orb vuebits-bg__orb--3" />
    </div>
    
    <!-- 扫描线层 -->
    <div class="vuebits-bg__scanlines" />
    
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
}

const particles = ref<Particle[]>([])

function generateParticles() {
  const count = 35
  const newParticles: Particle[] = []
  
  for (let i = 0; i < count; i++) {
    newParticles.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10
    })
  }
  
  particles.value = newParticles
}

onMounted(() => {
  generateParticles()
})

onUnmounted(() => {
  particles.value = []
})
</script>

<style scoped>
.vuebits-bg {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

/* ════════════════════════════════════════════════════════════
   渐变网格层
   ════════════════════════════════════════════════════════════ */
.vuebits-bg__grid-layer {
  position: absolute;
  inset: 0;
  perspective: 1000px;
  transform-style: preserve-3d;
}

.vuebits-bg__grid {
  position: absolute;
  inset: -50%;
  background-image: 
    linear-gradient(color-mix(in srgb, var(--accent) 3%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--accent) 3%, transparent) 1px, transparent 1px);
  background-size: 60px 60px;
  background-position: 0 0;
  animation: gridMove 20s linear infinite;
  transform: rotateX(60deg) translateY(-20%);
  transform-origin: center top;
}

.vuebits-bg__grid--alt {
  animation: gridMove 25s linear infinite reverse;
  opacity: 0.5;
  background-image: 
    linear-gradient(color-mix(in srgb, var(--purple) 2%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--purple) 2%, transparent) 1px, transparent 1px);
}

@keyframes gridMove {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 60px;
  }
}

/* ════════════════════════════════════════════════════════════
   粒子层
   ════════════════════════════════════════════════════════════ */
.vuebits-bg__particles {
  position: absolute;
  inset: 0;
}

.vuebits-bg__particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    color-mix(in srgb, var(--accent) 80%, transparent),
    color-mix(in srgb, var(--accent) 20%, transparent) 50%,
    transparent 70%
  );
  box-shadow: 
    0 0 10px color-mix(in srgb, var(--accent) 50%, transparent),
    0 0 20px color-mix(in srgb, var(--accent) 30%, transparent),
    0 0 30px color-mix(in srgb, var(--accent) 10%, transparent);
  animation: particleFloat linear infinite;
  opacity: 0;
}

@keyframes particleFloat {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0.5);
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    opacity: 0;
    transform: translateY(-100vh) scale(1.2);
  }
}

/* ════════════════════════════════════════════════════════════
   光晕层
   ════════════════════════════════════════════════════════════ */
.vuebits-bg__glow-layer {
  position: absolute;
  inset: 0;
}

.vuebits-bg__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: orbFloat 15s ease-in-out infinite;
}

.vuebits-bg__orb--1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--accent) 40%, transparent) 0%,
    color-mix(in srgb, var(--accent) 10%, transparent) 50%,
    transparent 70%
  );
  top: -100px;
  right: -100px;
  animation-delay: 0s;
}

.vuebits-bg__orb--2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--purple) 30%, transparent) 0%,
    color-mix(in srgb, var(--purple) 10%, transparent) 50%,
    transparent 70%
  );
  bottom: -50px;
  left: -50px;
  animation-delay: -5s;
}

.vuebits-bg__orb--3 {
  width: 250px;
  height: 250px;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--accent) 25%, transparent) 0%,
    color-mix(in srgb, var(--accent) 8%, transparent) 50%,
    transparent 70%
  );
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -10s;
}

@keyframes orbFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(30px, -30px) scale(1.1);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.95);
  }
  75% {
    transform: translate(20px, 30px) scale(1.05);
  }
}

/* ════════════════════════════════════════════════════════════
   扫描线层
   ════════════════════════════════════════════════════════════ */
.vuebits-bg__scanlines {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    color-mix(in srgb, var(--accent) 2%, transparent) 50%,
    transparent 100%
  );
  background-size: 100% 4px;
  animation: scanlineMove 8s linear infinite;
  opacity: 0.5;
  pointer-events: none;
}

@keyframes scanlineMove {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 100%;
  }
}

/* ════════════════════════════════════════════════════════════
   Light theme adjustments
   ════════════════════════════════════════════════════════════ */
[data-theme="light"] .vuebits-bg__grid {
  background-image: 
    linear-gradient(color-mix(in srgb, var(--info) 4%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--info) 4%, transparent) 1px, transparent 1px);
  opacity: 0.5;
}

[data-theme="light"] .vuebits-bg__grid--alt {
  background-image: 
    linear-gradient(color-mix(in srgb, var(--purple) 3%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--purple) 3%, transparent) 1px, transparent 1px);
}

[data-theme="light"] .vuebits-bg__orb {
  opacity: 0.2;
}

[data-theme="light"] .vuebits-bg__scanlines {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    color-mix(in srgb, var(--info) 3%, transparent) 50%,
    transparent 100%
  );
}
</style>
