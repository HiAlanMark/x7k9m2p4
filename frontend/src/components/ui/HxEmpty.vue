<template>
  <div class="hx-empty">
    <div class="empty-icon">
      <svg width="48" height="48" viewBox="0 0 1024 1024" fill="currentColor">
        <path d="M426.666667 42.666667a42.666667 42.666667 0 0 0 0 85.333333h170.666666a42.666667 42.666667 0 0 0 0-85.333333z"/>
        <path d="M512 213.333333c-211.584 0-384 172.416-384 384s172.416 384 384 384 384-172.416 384-384-172.416-384-384-384z m0 85.333334c165.461333 0 298.666667 133.205333 298.666667 298.666666s-133.205333 298.666667-298.666667 298.666667-298.666667-133.205333-298.666667-298.666667S346.538667 298.666667 512 298.666667z m0 85.333333a42.666667 42.666667 0 0 0-42.666667 42.666667v170.666666a42.666667 42.666667 0 0 0 42.666667 42.666667 42.666667 42.666667 0 0 0 42.666667-42.666667V426.666667a42.666667 42.666667 0 0 0-42.666667-42.666667z"/>
      </svg>
    </div>
    <slot>
      <div class="empty-text">暂无数据</div>
    </slot>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.hx-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 24px;
  color: var(--color-text-tertiary);
}

.empty-icon {
  opacity: 0.35;
  margin-bottom: 4px;
}

.empty-text {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.empty-hint {
  font-size: 12px;
  color: var(--color-text-tertiary);
}
</style>
