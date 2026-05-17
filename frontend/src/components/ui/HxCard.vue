<template>
  <div
    class="hixns-card"
    :class="cardClasses"
    :style="cardStyle"
  >
    <div v-if="$slots.header || title" class="hixns-card__header">
      <slot name="header">
        <h3 class="hixns-card__title">{{ title }}</h3>
        <p v-if="subtitle" class="hixns-card__subtitle">{{ subtitle }}</p>
      </slot>
    </div>
    <div class="hixns-card__content">
      <slot />
    </div>
    <div v-if="$slots.footer" class="hixns-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  interactive?: boolean
  elevated?: boolean
  glass?: boolean
  noPad?: boolean
  radius?: number
}>(), {
  title: '',
  subtitle: '',
  interactive: false,
  elevated: false,
  glass: true,
  noPad: false,
  radius: undefined,
})

const cardClasses = computed(() => [
  {
    'hixns-card--interactive': props.interactive,
    'hixns-card--elevated': props.elevated,
    'hixns-card--no-pad': props.noPad,
  },
])

const cardStyle = computed(() => ({
  '--card-radius': props.radius ? `${props.radius}px` : undefined,
}))
</script>

<style scoped>
/* Base styles from enhancements.css */
.hixns-card {
  position: relative;
  overflow: hidden;
}

.hixns-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    var(--primary) 0%,
    rgba(90, 200, 250, 0.5) 100%
  );
}

.hixns-card--no-pad {
  padding: 0;
}

.hixns-card--elevated {
  box-shadow: var(--glass-inset), var(--shadow-xl);
}

.hixns-card__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
}

.hixns-card__title {
  font-size: 20px;
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
  line-height: var(--leading-tight);
  letter-spacing: -0.01em;
}

.hixns-card__subtitle {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  margin: 0;
  line-height: var(--leading-normal);
}
.hixns-card__content {
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

.hixns-card__footer {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-base);
}
</style>
