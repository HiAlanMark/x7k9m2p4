<!-- src/components/icons/IconChat.vue -->
<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 11.5C21 16.75 16.75 21 11.5 21C10.08 21 8.75 20.69 7.54 20.12L3 21L4.12 16.74C3.52 15.47 3.2 14.05 3.2 12.55C3.2 7.3 7.45 3 12.7 3C17.95 3 21 7.25 21 11.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>
<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
