<template>
  <AlertDialogRoot v-model:open="open">
    <AlertDialogPortal>
      <AlertDialogOverlay class="hx-confirm__overlay" />
      <AlertDialogContent class="hx-frame hx-confirm__content" :style="{ '--hx-rot': `${rotation}deg` }">
        <AlertDialogTitle class="hx-confirm__title">{{ title }}</AlertDialogTitle>
        <AlertDialogDescription class="hx-confirm__text">{{ text }}</AlertDialogDescription>
        <div class="hx-confirm__actions">
          <AlertDialogCancel as-child>
            <HxButton>{{ cancelLabel }}</HxButton>
          </AlertDialogCancel>
          <AlertDialogAction as-child>
            <HxButton variant="primary" @click="emit('confirm')">{{ confirmLabel }}</HxButton>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>

<script setup lang="ts">
import {
  AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogOverlay, AlertDialogPortal, AlertDialogRoot, AlertDialogTitle,
} from 'reka-ui'
import HxButton from './HxButton.vue'

const open = defineModel<boolean>('open', { required: true })
withDefaults(
  defineProps<{
    title: string
    text: string
    confirmLabel?: string
    cancelLabel?: string
    rotation?: 0 | 90 | 180 | 270
  }>(),
  { confirmLabel: 'Confirm', cancelLabel: 'Cancel', rotation: 0 },
)
const emit = defineEmits<{ confirm: [] }>()
</script>

<style scoped>
.hx-confirm__overlay {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--hx-bg-deep) 85%, transparent);
  z-index: var(--hx-z-dialog);
}
.hx-confirm__content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(var(--hx-rot, 0deg));
  width: min(26rem, 90vmin);
  padding: var(--hx-s-5);
  background: var(--hx-surface);
  z-index: calc(var(--hx-z-dialog) + 1);
}
.hx-confirm__content:focus-visible { outline: none; }
.hx-confirm__title {
  margin: 0 0 var(--hx-s-3);
  font-size: var(--hx-fs-lead);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: var(--hx-tracking-title);
  color: var(--hx-ink-strong);
}
.hx-confirm__text { margin: 0 0 var(--hx-s-5); color: var(--hx-ink-muted); }
.hx-confirm__actions { display: flex; justify-content: flex-end; gap: var(--hx-s-3); }
</style>
