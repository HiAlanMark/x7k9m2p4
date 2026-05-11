<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1473.89 288.88" :width="width" :height="height">
    <defs>
      <!-- X slash gradient -->
      <linearGradient id="brand-g1" x1="602.09" y1="4.51" x2="862.78" y2="281.06" gradientUnits="userSpaceOnUse">
        <template v-if="dark">
          <stop offset=".21" stop-color="#fff"/><stop offset=".26" stop-color="#fbfbfb"/>
          <stop offset=".3" stop-color="#f0f0f0"/><stop offset=".35" stop-color="#ddd"/>
          <stop offset=".39" stop-color="#c3c3c3"/><stop offset=".44" stop-color="#a1a1a1"/>
          <stop offset=".48" stop-color="#777"/><stop offset=".52" stop-color="#464646"/>
          <stop offset=".56" stop-color="#0e0e0e"/><stop offset=".57" stop-color="#000"/>
          <stop offset=".59" stop-color="#1e1e1e"/><stop offset=".64" stop-color="#616161"/>
          <stop offset=".68" stop-color="#999"/><stop offset=".72" stop-color="#c5c5c5"/>
          <stop offset=".75" stop-color="#e4e4e4"/><stop offset=".78" stop-color="#f8f8f8"/>
          <stop offset=".8" stop-color="#fff"/>
        </template>
        <template v-else>
          <stop offset=".21" stop-color="#000"/><stop offset=".26" stop-color="#040404"/>
          <stop offset=".3" stop-color="#0f0f0f"/><stop offset=".35" stop-color="#222"/>
          <stop offset=".39" stop-color="#3c3c3c"/><stop offset=".44" stop-color="#5e5e5e"/>
          <stop offset=".48" stop-color="#888"/><stop offset=".52" stop-color="#b9b9b9"/>
          <stop offset=".56" stop-color="#f1f1f1"/><stop offset=".57" stop-color="#fff"/>
          <stop offset=".59" stop-color="#e1e1e1"/><stop offset=".64" stop-color="#9e9e9e"/>
          <stop offset=".68" stop-color="#666"/><stop offset=".72" stop-color="#3a3a3a"/>
          <stop offset=".75" stop-color="#1b1b1b"/><stop offset=".78" stop-color="#070707"/>
          <stop offset=".8" stop-color="#000"/>
        </template>
      </linearGradient>
      <!-- X body gradient -->
      <linearGradient id="brand-g2" x1="704.31" y1="30.08" x2="704.31" y2="247.87" gradientUnits="userSpaceOnUse">
        <template v-if="dark">
          <stop offset=".08" stop-color="#000"/><stop offset=".13" stop-color="#212121"/>
          <stop offset=".22" stop-color="#545454"/><stop offset=".32" stop-color="#828282"/>
          <stop offset=".42" stop-color="#a8a8a8"/><stop offset=".52" stop-color="#c8c8c8"/>
          <stop offset=".62" stop-color="#e0e0e0"/><stop offset=".73" stop-color="#f1f1f1"/>
          <stop offset=".85" stop-color="#fbfbfb"/><stop offset="1" stop-color="#fff"/>
        </template>
        <template v-else>
          <stop offset=".08" stop-color="#fff"/><stop offset=".13" stop-color="#dedede"/>
          <stop offset=".22" stop-color="#ababab"/><stop offset=".32" stop-color="#7d7d7d"/>
          <stop offset=".42" stop-color="#575757"/><stop offset=".52" stop-color="#373737"/>
          <stop offset=".62" stop-color="#1f1f1f"/><stop offset=".73" stop-color="#0e0e0e"/>
          <stop offset=".85" stop-color="#040404"/><stop offset="1" stop-color="#000"/>
        </template>
      </linearGradient>
    </defs>
    <!-- H -->
    <path :fill="textColor" d="M189.49,280.93v-115.29H59.63v115.29H0V5.3h59.63v107.33h129.86V5.3h59.63v275.63s-59.63,0-59.63,0Z"/>
    <!-- i dot -->
    <circle :fill="textColor" cx="335.32" cy="39.09" r="33.13"/>
    <!-- i body -->
    <rect :fill="textColor" x="305.56" y="101.86" width="59.52" height="179.07"/>
    <!-- ! -->
    <g>
      <polygon :fill="textColor" points="472.87 188.61 426.49 188.61 417.21 5.3 483.47 5.3 472.87 188.61"/>
      <circle :fill="textColor" cx="450.34" cy="249.12" r="33.13"/>
    </g>
    <!-- X slash (gradient) -->
    <path fill="url(#brand-g1)" d="M545.36,5.96l219.48,234.79c24.75,26.47,59.36,41.5,95.6,41.5h62.09l-227.02-242.23c-20.36-21.73-48.81-34.05-78.59-34.05h-71.57Z"/>
    <!-- X top-left arm -->
    <path :fill="textColor" d="M832.16,48.7c16.49-4.25,35.42-5.46,51.58-5.46l38.79-37.94h-59.81c-33.95,0-66.57,13.2-90.97,36.8l-129.21,124.99c27.2-20.07,50.76-37.46,71.32-52.03,46.73-33.11,80.19-56.55,118.29-66.36Z"/>
    <!-- X bottom-right arm (gradient) -->
    <path fill="url(#brand-g2)" d="M832.16,48.7c-38.09,9.81-71.56,33.25-118.29,66.36-20.56,14.57-44.12,31.96-71.32,52.03l-73.39,71-44.28,42.84h64.01c33.21,0,65.1-13,88.84-36.22l10.94-10.7,195.06-190.77c-16.16,0-35.09,1.21-51.58,5.46Z"/>
    <!-- N -->
    <path :fill="textColor" d="M1162.93,280.93l-135.8-186.84v186.84h-61.11V5.3h62.47l130.37,178.89V5.3h61.11v275.63h-57.04Z"/>
    <!-- S -->
    <path :fill="textColor" d="M1464.61,239.85c-6.63,10.6-14.58,19.88-25.18,27.83-10.6,7.95-22.53,13.25-37.1,15.9-14.58,3.98-29.15,5.3-45.05,5.3-14.58,0-27.83-1.33-39.75-3.98-11.93-2.65-22.53-6.63-31.8-10.6-9.28-3.98-17.23-9.28-23.85-14.58-6.63-5.3-11.93-10.6-17.23-15.9l34.45-39.75c2.65,2.65,5.3,6.63,10.6,11.93,5.3,3.98,10.6,9.28,17.23,13.25s14.58,7.95,22.53,10.6c7.95,2.65,17.23,3.98,25.18,3.98s14.58-1.33,21.2-2.65c6.63-1.33,11.93-3.98,17.23-6.63,5.3-2.65,9.28-6.63,11.93-10.6,2.65-3.98,3.98-9.28,3.98-15.9,0-9.28-5.3-18.55-15.9-23.85-10.6-6.63-26.5-11.93-47.7-14.58-18.55-2.65-34.45-7.95-47.7-13.25s-22.53-11.93-30.48-19.88c-7.95-7.95-13.25-15.9-15.9-25.18-2.65-9.28-3.98-18.55-3.98-27.83,0-10.6,2.65-21.2,7.95-31.8,5.3-10.6,11.93-19.88,22.53-26.5,9.28-7.95,21.2-13.25,34.45-18.55,13.25-5.3,27.83-6.63,43.73-6.63,14.58,0,26.5,1.33,38.43,3.98,11.93,2.65,21.2,5.3,30.48,9.28,9.28,3.98,15.9,7.95,22.53,13.25,6.63,5.3,11.93,9.28,17.23,14.58l-34.45,35.78c-3.98-3.98-7.95-7.95-13.25-11.93-5.3-3.98-10.6-6.63-17.23-9.28-6.63-2.65-13.25-5.3-19.88-6.63-6.63-1.33-13.25-2.65-19.88-2.65s-11.93,1.33-17.23,2.65c-5.3,1.33-10.6,3.98-14.58,6.63-3.98,2.65-7.95,6.63-10.6,10.6-2.65,3.98-3.98,9.28-3.98,15.9,0,9.28,3.98,15.9,13.25,21.2,9.28,5.3,22.53,9.28,41.08,11.93,15.9,2.65,30.48,6.63,43.73,10.6,13.25,3.98,23.85,9.28,33.13,17.23,9.28,6.63,15.9,15.9,21.2,25.18,5.3,9.28,7.95,22.53,7.95,35.78,0,10.6-2.65,23.85-9.28,35.78Z"/>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  width?: number | string
  height?: number | string
  dark?: boolean
}>(), {
  width: 120,
  height: 24,
  dark: false
})

const textColor = computed(() => props.dark ? '#FAFAFA' : '#18181B')
</script>
