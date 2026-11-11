<template>
  <div class="hx-stepper">
    <button
      class="hx-stepper__btn"
      type="button"
      aria-label="Decrease"
      :disabled="model <= min"
      @pointerdown="hold(-1)"
      @pointerup="release"
      @pointerleave="release"
      @pointercancel="release"
      @click="onKeyClick($event, -1)"
    >
      <HxIcon name="minus" />
    </button>
    <output class="hx-stepper__value" aria-live="polite">{{ model }}</output>
    <button
      class="hx-stepper__btn"
      type="button"
      aria-label="Increase"
      :disabled="model >= max"
      @pointerdown="hold(1)"
      @pointerup="release"
      @pointerleave="release"
      @pointercancel="release"
      @click="onKeyClick($event, 1)"
    >
      <HxIcon name="plus" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import HxIcon from './HxIcon.vue'

const HOLD_DELAY_MS = 400
const REPEAT_MS = 100

const model = defineModel<number>({ required: true })
const props = withDefaults(defineProps<{ min?: number; max?: number; step?: number }>(), {
  min: 0,
  max: Infinity,
  step: 1,
})

let delayTimer: ReturnType<typeof setTimeout> | undefined
let repeatTimer: ReturnType<typeof setInterval> | undefined

function bump(dir: 1 | -1) {
  model.value = Math.min(props.max, Math.max(props.min, model.value + dir * props.step))
}

function hold(dir: 1 | -1) {
  release()
  bump(dir)
  delayTimer = setTimeout(() => {
    repeatTimer = setInterval(() => bump(dir), REPEAT_MS)
  }, HOLD_DELAY_MS)
}

function release() {
  clearTimeout(delayTimer)
  clearInterval(repeatTimer)
}

// Pointer taps are handled on pointerdown; Enter/Space produce click with detail 0.
function onKeyClick(e: MouseEvent, dir: 1 | -1) {
  if (e.detail === 0) bump(dir)
}

onBeforeUnmount(release)
</script>

<style scoped>
.hx-stepper { display: inline-flex; align-items: center; gap: var(--hx-s-2); }
.hx-stepper__btn {
  display: grid;
  place-items: center;
  width: var(--hx-tap-lg);
  height: var(--hx-tap-lg);
  border: var(--hx-border-strong);
  border-radius: var(--hx-radius);
  background: transparent;
  color: var(--hx-ink);
  cursor: pointer;
  touch-action: manipulation;
  user-select: none;
}
.hx-stepper__btn:hover:not(:disabled) { border-color: var(--hx-gold); color: var(--hx-gold); }
.hx-stepper__btn:focus-visible { outline: 2px solid var(--hx-gold); outline-offset: 2px; }
.hx-stepper__btn:disabled { opacity: 0.35; cursor: default; }
.hx-stepper__value {
  min-width: 3rem;
  text-align: center;
  font-size: var(--hx-fs-lead);
  color: var(--hx-ink-strong);
  font-variant-numeric: tabular-nums;
}
</style>
