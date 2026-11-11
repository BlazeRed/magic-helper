<template>
  <HxDialog v-model:open="open" title="Commander damage" :rotation="rotation">
    <label class="cmd__field">
      <span class="hx-label">Name</span>
      <input class="cmd__input" :value="player.name" maxlength="20" @change="rename" />
    </label>

    <HxOrnament class="cmd__rule" />

    <p class="hx-label">Damage received</p>
    <ul class="cmd__list">
      <li v-for="opp in opponents" :key="opp.id" class="cmd__row">
        <div class="cmd__who">
          <span class="cmd__gem" :style="{ background: settingsStore.getPlayerColor(opp.id) }" aria-hidden="true" />
          <span class="cmd__name">{{ opp.name }}</span>
          <HxStepper
            :model-value="damageFrom(opp.id)"
            :min="0"
            :max="LETHAL"
            @update:model-value="setDamage(opp.id, $event)"
          />
        </div>
        <div class="cmd__bar" :class="{ 'is-lethal': damageFrom(opp.id) >= LETHAL }">
          <div class="cmd__track">
            <div class="cmd__fill" :style="{ width: `${(Math.min(damageFrom(opp.id), LETHAL) / LETHAL) * 100}%` }" />
          </div>
          <span class="hx-label">{{ LETHAL }} lethal</span>
        </div>
      </li>
    </ul>

    <HxOrnament class="cmd__rule" />

    <p class="hx-label">Player color</p>
    <HxSwatches v-model="color" :options="swatches" />
  </HxDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Player } from '../stores/gameStore'
import { useGameStore } from '../stores/gameStore'
import { MTG_COLORS, useSettingsStore } from '../stores/settingsStore'
import { getGridConfig } from '../utils/gridLayout'
import HxDialog from './ui/HxDialog.vue'
import HxOrnament from './ui/HxOrnament.vue'
import HxStepper from './ui/HxStepper.vue'
import HxSwatches from './ui/HxSwatches.vue'

const LETHAL = 21

const open = defineModel<boolean>('open', { required: true })
const props = defineProps<{ player: Player; allPlayers: Player[] }>()

const gameStore = useGameStore()
const settingsStore = useSettingsStore()

const rotation = computed(
  () => getGridConfig(gameStore.numPlayers).slots.find(s => s.id === props.player.id)?.rotation ?? 0,
)
const opponents = computed(() => props.allPlayers.filter(p => p.id !== props.player.id))

const swatches = MTG_COLORS.map(c => ({ value: c.hex, label: c.name }))
const color = computed({
  get: () => settingsStore.getPlayerColor(props.player.id),
  set: hex => settingsStore.setPlayerColor(props.player.id, hex),
})

function damageFrom(sourceId: number): number {
  return props.player.commanderDamage[sourceId] ?? 0
}

// adjustCommanderDamage also lowers life by the same amount (unchanged rule).
function setDamage(sourceId: number, value: number) {
  const delta = value - damageFrom(sourceId)
  if (delta !== 0) gameStore.adjustCommanderDamage(props.player.id, sourceId, delta)
}

function rename(e: Event) {
  const input = e.target as HTMLInputElement
  gameStore.setPlayerName(props.player.id, input.value)
  input.value = props.player.name // store ignores empty names
}
</script>

<style scoped>
.cmd__field { display: grid; gap: var(--hx-s-1); }
.cmd__input {
  min-height: var(--hx-tap);
  padding: 0 var(--hx-s-3);
  border: var(--hx-border-strong);
  border-radius: var(--hx-radius);
  background: var(--hx-bg-deep);
  color: var(--hx-ink);
  font: inherit;
  font-size: var(--hx-fs-body);
}
.cmd__input:focus-visible { outline: 2px solid var(--hx-gold); outline-offset: 2px; }
.cmd__rule { margin: var(--hx-s-4) 0; }

.cmd__list { display: grid; gap: var(--hx-s-4); margin: var(--hx-s-3) 0 0; padding: 0; list-style: none; }
.cmd__who { display: flex; align-items: center; gap: var(--hx-s-3); }
.cmd__gem { flex: none; width: 0.75rem; height: 0.75rem; transform: rotate(45deg); }
.cmd__name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.cmd__bar { display: flex; align-items: center; gap: var(--hx-s-3); margin-top: var(--hx-s-2); }
.cmd__track { flex: 1; height: 4px; background: var(--hx-line-soft); }
.cmd__fill { height: 100%; background: var(--hx-gold); transition: width var(--hx-dur) var(--hx-ease); }
.cmd__bar.is-lethal .cmd__fill { background: var(--hx-danger); }
.cmd__bar.is-lethal .hx-label { color: var(--hx-danger); }
</style>
