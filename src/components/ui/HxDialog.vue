<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="hx-dialog__overlay" />
      <DialogContent
        class="hx-frame hx-dialog__content"
        :style="{ '--hx-rot': `${rotation}deg` }"
        :aria-describedby="undefined"
      >
        <DialogTitle class="hx-dialog__title">{{ title }}</DialogTitle>
        <slot />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui'

const open = defineModel<boolean>('open', { required: true })
withDefaults(defineProps<{ title: string; rotation?: 0 | 90 | 180 | 270 }>(), { rotation: 0 })
</script>

<style scoped>
.hx-dialog__overlay {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--hx-bg-deep) 85%, transparent);
  z-index: var(--hx-z-dialog);
}
.hx-dialog__content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(var(--hx-rot, 0deg));
  width: min(32rem, 90vmin);
  max-height: 90vmin;
  overflow: auto;
  padding: var(--hx-s-5);
  background: var(--hx-surface);
  color: var(--hx-ink);
  z-index: calc(var(--hx-z-dialog) + 1);
}
.hx-dialog__content:focus-visible { outline: none; }
.hx-dialog__title {
  margin: 0 0 var(--hx-s-4);
  font-size: var(--hx-fs-lead);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: var(--hx-tracking-title);
  color: var(--hx-ink-strong);
}
</style>
