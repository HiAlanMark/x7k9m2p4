<template>
  <div class="tech-background">
    <!-- 渐变网格层 -->
    <div class="grid-layer">
      <div class="grid-grid" />
      <div class="grid-grid grid-grid-2" />
    </div>
    
    <!-- 粒子层 -->
    <div class="particles-layer">
      <div 
        v-for="particle in particles" 
        :key="particle.id"
        class="particle"
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
    <div class="glow-layer">
      <div class="glow-orb glow-orb-1" />
      <div class="glow-orb glow-orb-2" />
      <div class="glow-orb glow-orb-3" />
    </div>
    
    <!-- 扫描线层 -->
    <div class="scanline-layer" />
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
  const count = 30
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
.tech-background {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

/* ════════════════════════════════════════════════════════════
   渐变网格层
   ════════════════════════════════════════════════════════════ */
.grid-layer {
  position: absolute;
  inset: 0;
  perspective: 1000px;
  transform-style: preserve-3d;
}

.grid-grid {
  position: absolute;
  inset: -50%;
  background-image: 
    linear-gradient(rgba(10, 132, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(10, 132, 255, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  background-position: 0 0;
  animation: gridMove 20s linear infinite;
  transform: rotateX(60deg) translateY(-20%);
  transform-origin: center top;
}

.grid-grid-2 {
  animation: gridMove 25s linear infinite reverse;
  opacity: 0.5;
  background-image: 
    linear-gradient(rgba(138, 43, 226, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(138, 43, 226, 0.02) 1px, transparent 1px);
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
.particles-layer {
  position: absolute;
  inset: 0;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(10, 132, 255, 0.8),
    rgba(10, 132, 255, 0.2) 50%,
    transparent 70%
  );
  box-shadow: 
    0 0 10px rgba(10, 132, 255, 0.5),
    0 0 20px rgba(10, 132, 255, 0.3),
    0 0 30px rgba(10, 132, 255, 0.1);
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
.glow-layer {
  position: absolute;
  inset: 0;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: orbFloat 15s ease-in-out infinite;
}

.glow-orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    rgba(10, 132, 255, 0.4) 0%,
    rgba(10, 132, 255, 0.1) 50%,
    transparent 70%
  );
  top: -100px;
  right: -100px;
  animation-delay: 0s;
}

.glow-orb-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle,
    rgba(138, 43, 226, 0.3) 0%,
    rgba(138, 43, 226, 0.1) 50%,
    transparent 70%
  );
  bottom: -50px;
  left: -50px;
  animation-delay: -5s;
}

.glow-orb-3 {
  width: 250px;
  height: 250px;
  background: radial-gradient(
    circle,
    rgba(0, 212, 255, 0.25) 0%,
    rgba(0, 212, 255, 0.08) 50%,
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
.scanline-layer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(10, 132, 255, 0.02) 50%,
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
</style>
