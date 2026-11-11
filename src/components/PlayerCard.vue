<template>
  <div
    class="hx-frame player-card"
    :class="{
      'player-card--dead': player.isDead,
      'player-card--highlighted': highlighted,
    }"
    :style="{ '--player-color': playerColor }"
  >
    <div v-if="player.isDead" class="player-card__dead">
      <HxIcon name="skull" :size="56" />
      <span class="hx-label">Eliminated</span>
    </div>

    <header class="player-card__header">
      <span class="player-card__gem" aria-hidden="true" />
      <PlayerNameEdit
        :model-value="player.name"
        @update:model-value="gameStore.setPlayerName(player.id, $event)"
      />
      <HxIcon v-if="player.isStartingPlayer" class="player-card__crown" name="crown" :size="20" />
    </header>

    <div class="player-card__body">
      <button class="player-card__zone" type="button" aria-label="Decrease life" v-on="dec">
        <HxIcon name="minus" :size="28" />
      </button>

      <div class="player-card__total">
        <span class="player-card__life">{{ player.life }}</span>
        <Transition name="delta-fade">
          <span v-if="player.deltaDisplay" class="player-card__delta" :class="deltaClass">
            {{ formatDelta(player.deltaDisplay) }}
          </span>
        </Transition>
      </div>

      <button class="player-card__zone" type="button" aria-label="Increase life" v-on="inc">
        <HxIcon name="plus" :size="28" />
      </button>
    </div>

    <footer class="player-card__commander">
      <CommanderDamageGrid :player="player" :all-players="gameStore.players" @open="cmdDialogOpen = true" />
    </footer>

    <CommanderDamageDialog v-if="cmdDialogOpen" v-model="cmdDialogOpen" :player="player" :all-players="gameStore.players" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Player } from '../stores/gameStore'
import { useGameStore } from '../stores/gameStore'
import { useSettingsStore } from '../stores/settingsStore'
import { usePressHold } from '../composables/usePressHold'
import { formatDelta } from '../utils/gameHelpers'
import HxIcon from './ui/HxIcon.vue'
import PlayerNameEdit from './PlayerNameEdit.vue'
import CommanderDamageGrid from './CommanderDamageGrid.vue'
import CommanderDamageDialog from './CommanderDamageDialog.vue'

const props = defineProps<{ player: Player; highlighted: boolean }>()

const gameStore = useGameStore()
const settingsStore = useSettingsStore()
const cmdDialogOpen = ref(false)

const playerColor = computed(() => settingsStore.getPlayerColor(props.player.id))
const deltaClass = computed(() => ((props.player.deltaDisplay ?? 0) > 0 ? 'is-gain' : 'is-loss'))

const dec = usePressHold(() => gameStore.adjustLife(props.player.id, -1), () => gameStore.adjustLife(props.player.id, -10))
const inc = usePressHold(() => gameStore.adjustLife(props.player.id, +1), () => gameStore.adjustLife(props.player.id, +10))
</script>

<style scoped>
.player-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: color-mix(in srgb, var(--player-color) 7%, var(--hx-surface));
  user-select: none;
  -webkit-touch-callout: none;
  transition: border-color var(--hx-dur) var(--hx-ease);
}
.player-card--highlighted { border-color: var(--hx-gold); }
.player-card--highlighted::after { border-color: var(--hx-gold); }
.player-card--dead { filter: grayscale(0.6); }

.player-card__dead {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--hx-s-2);
  background: color-mix(in srgb, var(--hx-bg-deep) 75%, transparent);
  color: var(--hx-ink-muted);
  pointer-events: none;
}

.player-card__header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: var(--hx-s-2);
  padding: var(--hx-s-3) var(--hx-s-4) 0;
}
.player-card__gem {
  flex: none;
  width: 0.625rem;
  height: 0.625rem;
  background: var(--player-color);
  transform: rotate(45deg);
}
.player-card__crown { margin-left: auto; color: var(--hx-gold); }

.player-card__body { position: relative; display: flex; flex: 1; min-height: 0; }

.player-card__zone {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--hx-ink-faint);
  cursor: pointer;
  touch-action: manipulation;
}
.player-card__zone:active { background: color-mix(in srgb, var(--hx-gold) 8%, transparent); }
.player-card__zone:focus-visible { outline: 2px solid var(--hx-gold); outline-offset: -4px; }

.player-card__total {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.player-card__life {
  font-size: clamp(2.5rem, min(26cqh, 20cqw), var(--hx-fs-life));
  font-weight: 600;
  line-height: 1;
  color: var(--hx-ink-strong);
  font-variant-numeric: lining-nums tabular-nums;
}
.player-card__delta {
  min-height: 1.4em;
  font-size: var(--hx-fs-lead);
  font-variant-numeric: lining-nums;
}
.is-gain { color: var(--hx-success); }
.is-loss { color: var(--hx-danger); }

.player-card__commander {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  padding: var(--hx-s-2) var(--hx-s-3) var(--hx-s-3);
}

.delta-fade-enter-active,
.delta-fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.delta-fade-enter-from { opacity: 0; transform: translateY(-6px); }
.delta-fade-leave-to { opacity: 0; transform: translateY(6px); }
</style>
