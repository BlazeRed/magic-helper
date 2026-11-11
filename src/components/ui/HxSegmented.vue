<template>
  <ToggleGroupRoot
    class="hx-segmented"
    type="single"
    :model-value="String(model)"
    @update:model-value="onUpdate"
  >
    <ToggleGroupItem
      v-for="o in options"
      :key="o.value"
      class="hx-segmented__item"
      :value="String(o.value)"
    >
      {{ o.label }}
    </ToggleGroupItem>
  </ToggleGroupRoot>
</template>

<script setup lang="ts">
import { ToggleGroupItem, ToggleGroupRoot } from 'reka-ui'

type Value = string | number
const props = defineProps<{ options: { value: Value; label: string }[] }>()
const model = defineModel<Value>({ required: true })

// Single toggle group emits '' when the active item is pressed again: ignore it.
function onUpdate(v: unknown) {
  if (typeof v !== 'string' || v === '') return
  model.value = props.options.find(o => String(o.value) === v)?.value ?? model.value
}
</script>

<style scoped>
.hx-segmented { display: flex; border: var(--hx-border-strong); border-radius: var(--hx-radius); }
.hx-segmented__item {
  flex: 1;
  min-height: var(--hx-tap-lg);
  min-width: var(--hx-tap-lg);
  border: 0;
  border-right: var(--hx-border);
  background: transparent;
  color: var(--hx-ink-muted);
  font-size: var(--hx-fs-body);
  cursor: pointer;
}
.hx-segmented__item:last-child { border-right: 0; }
.hx-segmented__item:hover { color: var(--hx-ink-strong); }
.hx-segmented__item[data-state='on'] { background: var(--hx-gold); color: var(--hx-ink-on-gold); }
.hx-segmented__item:focus-visible { outline: 2px solid var(--hx-gold); outline-offset: -4px; }
</style>
