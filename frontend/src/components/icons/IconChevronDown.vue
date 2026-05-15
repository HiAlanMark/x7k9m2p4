<template>
  <svg :width="size" :height="size" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M256 341.333333a42.666667 42.666667 0 0 0-30.165333 12.501334 42.666667 42.666667 0 0 0 0 60.330666l256 256a42.666667 42.666667 0 0 0 60.330666 0l256-256a42.666667 42.666667 0 0 0 0-60.330666 42.666667 42.666667 0 0 0-60.330666 0L512 579.669333 286.165333 353.834667A42.666667 42.666667 0 0 0 256 341.333333z"/>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 24 })
</script>
