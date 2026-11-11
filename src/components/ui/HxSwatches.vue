<template>
  <RadioGroupRoot v-model="model" class="hx-swatches" orientation="horizontal">
    <RadioGroupItem
      v-for="o in options"
      :key="o.value"
      class="hx-swatches__item"
      :value="o.value"
      :aria-label="o.label"
    >
      <span class="hx-swatches__gem" :style="{ background: o.value }" />
    </RadioGroupItem>
  </RadioGroupRoot>
</template>

<script setup lang="ts">
import { RadioGroupItem, RadioGroupRoot } from 'reka-ui'

defineProps<{ options: { value: string; label: string }[] }>()
const model = defineModel<string>({ required: true })
</script>

<style scoped>
.hx-swatches { display: flex; flex-wrap: wrap; gap: var(--hx-s-2); }
.hx-swatches__item {
  display: grid;
  place-items: center;
  width: var(--hx-tap);
  height: var(--hx-tap);
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}
.hx-swatches__gem {
  width: 1.5rem;
  height: 1.5rem;
  transform: rotate(45deg);
  outline: 2px solid transparent;
  outline-offset: 3px;
}
.hx-swatches__item[data-state='checked'] .hx-swatches__gem { outline-color: var(--hx-ink-strong); }
.hx-swatches__item:focus-visible .hx-swatches__gem { outline-color: var(--hx-gold); }
</style>
