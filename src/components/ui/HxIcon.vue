<template>
  <svg
    class="hx-icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="square"
    stroke-linejoin="miter"
    aria-hidden="true"
  >
    <path :d="PATHS[name]" />
  </svg>
</template>

<script setup lang="ts">
const PATHS = {
  back: 'M15 5l-7 7 7 7',
  settings: 'M4 7h10M18 7h2M4 17h2M10 17h10M16 4v6M8 14v6',
  reset: 'M5 12a7 7 0 1 0 2.2-5.1M5 4v4h4',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  skull: 'M6 14V10a6 6 0 0 1 12 0v4l-2 1v4H8v-4zM9 11h2M13 11h2M12 15v2',
  crown: 'M4 18h16M4 18L3 7l5 4 4-6 4 6 5-4-1 11',
  check: 'M5 12.5l4.5 4.5L19 7',
} as const

export type HxIconName = keyof typeof PATHS

withDefaults(defineProps<{ name: HxIconName; size?: number | string }>(), { size: 24 })
</script>

<style scoped>
.hx-icon { flex: none; }
</style>
