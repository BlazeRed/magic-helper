<template>
  <main class="kit">
    <h1 class="hx-label">UI kit (throwaway, remove before merge)</h1>

    <section>
      <p class="hx-label">Buttons + icons</p>
      <HxButton variant="primary">Start</HxButton>
      <HxButton>Cancel</HxButton>
      <HxButton v-for="n in icons" :key="n" variant="icon" :aria-label="n"><HxIcon :name="n" /></HxButton>
    </section>

    <section>
      <HxOrnament />
      <HxFrame>Framed content</HxFrame>
    </section>

    <section>
      <p class="hx-label">Segmented ({{ players }})</p>
      <HxSegmented v-model="players" :options="[2, 3, 4, 5, 6].map(n => ({ value: n, label: String(n) }))" />
    </section>

    <section>
      <p class="hx-label">Switch ({{ random }})</p>
      <HxSwitch v-model="random" />
    </section>

    <section>
      <p class="hx-label">Stepper</p>
      <HxStepper v-model="dmg" :min="0" :max="21" />
    </section>

    <section>
      <p class="hx-label">Swatches ({{ color }})</p>
      <HxSwatches v-model="color" :options="colors" />
    </section>

    <section>
      <HxButton @click="dialog = true">Dialog</HxButton>
      <HxButton @click="rotated = true">Dialog 180°</HxButton>
      <HxButton @click="confirm = true">Confirm</HxButton>
    </section>

    <HxDialog v-model:open="dialog" title="Dialog">Body text.</HxDialog>
    <HxDialog v-model:open="rotated" title="Rotated" :rotation="180">Faces the opposite seat.</HxDialog>
    <HxConfirm v-model:open="confirm" title="Reset game?" text="Life totals go back to start." confirm-label="Reset" />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HxButton from '../components/ui/HxButton.vue'
import HxConfirm from '../components/ui/HxConfirm.vue'
import HxDialog from '../components/ui/HxDialog.vue'
import HxFrame from '../components/ui/HxFrame.vue'
import HxIcon, { type HxIconName } from '../components/ui/HxIcon.vue'
import HxOrnament from '../components/ui/HxOrnament.vue'
import HxSegmented from '../components/ui/HxSegmented.vue'
import HxStepper from '../components/ui/HxStepper.vue'
import HxSwatches from '../components/ui/HxSwatches.vue'
import HxSwitch from '../components/ui/HxSwitch.vue'

const icons: HxIconName[] = ['back', 'settings', 'reset', 'plus', 'minus', 'skull', 'crown', 'check']
const colors = [
  { value: '#e53935', label: 'Red' },
  { value: '#1e88e5', label: 'Blue' },
  { value: '#388e3c', label: 'Green' },
  { value: '#8e24aa', label: 'Black' },
]
const players = ref(4)
const random = ref(true)
const dmg = ref(5)
const color = ref(colors[0].value)
const dialog = ref(false)
const rotated = ref(false)
const confirm = ref(false)
</script>

<style scoped>
.kit { display: grid; gap: var(--hx-s-5); max-width: 40rem; margin: 0 auto; padding: var(--hx-s-5); }
section { display: flex; flex-wrap: wrap; align-items: center; gap: var(--hx-s-3); }
section > .hx-label { flex-basis: 100%; margin: 0; }
</style>
