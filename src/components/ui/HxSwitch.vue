<template>
  <SwitchRoot v-model="model" class="hx-switch">
    <SwitchThumb class="hx-switch__thumb" />
  </SwitchRoot>
</template>

<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui'

const model = defineModel<boolean>({ required: true })
</script>

<style scoped>
.hx-switch {
  position: relative;
  width: 3.5rem;
  height: var(--hx-tap);
  padding: 0;
  border: var(--hx-border-strong);
  border-radius: var(--hx-radius);
  background: var(--hx-bg-deep);
  cursor: pointer;
}
.hx-switch[data-state='checked'] { border-color: var(--hx-gold); }
.hx-switch:focus-visible { outline: 2px solid var(--hx-gold); outline-offset: 2px; }
.hx-switch__thumb {
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  margin-left: 0.5rem;
  background: var(--hx-ink-faint);
  transform: rotate(45deg);
  transition: transform var(--hx-dur) var(--hx-ease), background var(--hx-dur) var(--hx-ease);
}
.hx-switch__thumb[data-state='checked'] {
  background: var(--hx-gold);
  transform: translateX(1.125rem) rotate(45deg);
}
</style>
