<template>
  <button :class="['hx-button', `hx-button--${variant}`]" type="button">
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'primary' | 'secondary' | 'icon' }>(), { variant: 'secondary' })
</script>

<style scoped>
.hx-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--hx-s-2);
  min-height: var(--hx-button-h);
  padding: 0 var(--hx-s-5);
  border: var(--hx-border-strong);
  border-radius: var(--hx-radius);
  background: transparent;
  color: var(--hx-ink);
  font-family: var(--hx-font-sans);
  font-size: var(--hx-fs-label);
  text-transform: uppercase;
  letter-spacing: var(--hx-tracking-button);
  cursor: pointer;
  transition: background var(--hx-dur) var(--hx-ease), border-color var(--hx-dur) var(--hx-ease);
}
.hx-button:hover { border-color: var(--hx-gold); }
.hx-button:focus-visible { outline: 2px solid var(--hx-gold); outline-offset: 2px; }
.hx-button:disabled { opacity: 0.4; cursor: default; }

.hx-button--primary {
  background: var(--hx-gold);
  border-color: var(--hx-gold);
  color: var(--hx-ink-on-gold);
  font-weight: 600;
}
.hx-button--primary:hover:not(:disabled) { background: var(--hx-gold-hover); border-color: var(--hx-gold-hover); }

.hx-button--icon {
  width: var(--hx-tap);
  min-height: var(--hx-tap);
  height: var(--hx-tap);
  padding: 0;
  border-color: transparent;
  color: var(--hx-ink-muted);
}
.hx-button--icon:hover { color: var(--hx-gold); border-color: var(--hx-line); }
</style>
