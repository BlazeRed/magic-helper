<template>
  <main class="new-game">
    <h1 class="new-game__title">New game</h1>

    <section class="field">
      <p class="hx-label">Players</p>
      <HxSegmented v-model="numPlayers" :options="PLAYER_OPTIONS" />
    </section>

    <section class="field">
      <p class="hx-label">Starting life</p>
      <HxSegmented v-model="lifeChoice" :options="LIFE_OPTIONS" />
      <HxStepper v-if="lifeChoice === 'custom'" v-model="customLife" :min="1" :max="999" />
    </section>

    <HxOrnament />

    <section class="field">
      <p class="hx-label">Names and colors</p>
      <div v-for="i in numPlayers" :key="i" class="seat">
        <input
          v-model="names[i - 1]"
          class="seat__name"
          maxlength="20"
          :placeholder="`Player ${i}`"
          :aria-label="`Player ${i} name`"
        />
        <HxSwatches v-model="colors[i - 1]!" :options="SWATCHES" />
      </div>
    </section>

    <section class="field field--row">
      <label class="hx-label" id="random-start">Random starting player</label>
      <HxSwitch v-model="randomStart" aria-labelledby="random-start" />
    </section>

    <footer class="actions">
      <HxButton @click="cancel">Cancel</HxButton>
      <HxButton variant="primary" @click="start">Start</HxButton>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import { MTG_COLORS, useSettingsStore } from '../stores/settingsStore'
import HxButton from '../components/ui/HxButton.vue'
import HxOrnament from '../components/ui/HxOrnament.vue'
import HxSegmented from '../components/ui/HxSegmented.vue'
import HxStepper from '../components/ui/HxStepper.vue'
import HxSwatches from '../components/ui/HxSwatches.vue'
import HxSwitch from '../components/ui/HxSwitch.vue'

const MAX_PLAYERS = 6
const PLAYER_OPTIONS = [2, 3, 4, 5, 6].map(n => ({ value: n, label: String(n) }))
const LIFE_OPTIONS = [
  ...[20, 30, 40, 50].map(n => ({ value: n, label: String(n) })),
  { value: 'custom', label: 'Custom' },
]
const SWATCHES = MTG_COLORS.map(c => ({ value: c.hex, label: c.name }))

const router = useRouter()
const gameStore = useGameStore()
const settingsStore = useSettingsStore()

const numPlayers = ref(4)
const lifeChoice = ref<number | string>(40)
const customLife = ref(25)
const randomStart = ref(true)
const names = ref<string[]>(Array.from({ length: MAX_PLAYERS }, () => ''))
const colors = ref<string[]>(Array.from({ length: MAX_PLAYERS }, (_, i) => settingsStore.getPlayerColor(i + 1)))

const startingLife = computed(() => (lifeChoice.value === 'custom' ? customLife.value : Number(lifeChoice.value)))

function start() {
  const count = numPlayers.value
  for (let i = 0; i < count; i++) settingsStore.setPlayerColor(i + 1, colors.value[i]!)
  gameStore.initGame(count, startingLife.value)
  names.value.slice(0, count).forEach((name, i) => name.trim() && gameStore.setPlayerName(i + 1, name))
  if (!randomStart.value) gameStore.skipStartingPlayer()
  router.push('/game')
}

function cancel() {
  if (router.options.history.state.back) router.back()
  else router.push('/')
}
</script>

<style scoped>
.new-game {
  display: grid;
  gap: var(--hx-s-5);
  max-width: 36rem;
  margin: 0 auto;
  padding: var(--hx-s-5);
}
.new-game__title {
  margin: 0;
  font-size: var(--hx-fs-title);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: var(--hx-tracking-title);
  color: var(--hx-ink-strong);
}
.field { display: grid; gap: var(--hx-s-3); justify-items: start; }
.field > .hx-label { margin: 0; }
.field :deep(.hx-segmented) { width: 100%; }
.field--row { grid-auto-flow: column; justify-content: space-between; align-items: center; justify-items: end; }

.seat { display: grid; gap: var(--hx-s-2); width: 100%; margin-bottom: var(--hx-s-3); }
.seat__name {
  min-height: var(--hx-tap);
  padding: 0 var(--hx-s-3);
  border: var(--hx-border-strong);
  border-radius: var(--hx-radius);
  background: var(--hx-bg-deep);
  color: var(--hx-ink);
  font: inherit;
  font-size: var(--hx-fs-body);
}
.seat__name:focus-visible { outline: 2px solid var(--hx-gold); outline-offset: 2px; }

.actions { display: flex; justify-content: flex-end; gap: var(--hx-s-3); }
</style>
