<template>
  <div
    class="life-counter-wrapper"
    :style="{ '--rotation': `${rotation}deg` }"
  >
    <v-card
      class="life-counter"
      :class="{
        'life-counter--dead': player.isDead,
        'life-counter--highlighted': highlighted,
        'life-counter--starting': player.isStartingPlayer && !highlighted,
      }"
      :style="{
        '--player-color': playerColor,
        '--player-color-dim': playerColorDim,
      }"
      rounded="lg"
      elevation="6"
    >
      <!-- Dead overlay -->
      <div v-if="player.isDead" class="dead-overlay">
        <v-icon size="56" color="rgba(255,255,255,0.6)">mdi-skull</v-icon>
        <span class="dead-label">ELIMINATED</span>
      </div>

      <!-- Header row -->
      <div class="lc-header">
        <PlayerNameEdit
          :model-value="player.name"
          @update:model-value="gameStore.setPlayerName(player.id, $event)"
        />
        <div class="header-right">
          <v-icon
            v-if="player.isStartingPlayer"
            size="18"
            color="warning"
            class="crown-icon"
          >
            mdi-crown
          </v-icon>
        </div>
      </div>

      <!-- Life total area (split left/right halves) -->
      <div class="lc-life-row">
        <!-- Decrease half -->
        <button
          class="lc-half lc-half--left"
          @click="gameStore.adjustLife(player.id, -1)"
          @contextmenu.prevent="gameStore.adjustLife(player.id, -10)"
        >
          <v-icon size="28" color="rgba(255,255,255,0.7)">mdi-minus</v-icon>
        </button>

        <!-- Life total center -->
        <div class="lc-total-area">
          <span class="lc-life">{{ player.life }}</span>
          <Transition name="delta-fade">
            <span v-if="player.deltaDisplay !== null" class="lc-delta" :class="deltaClass">
              {{ formatDelta(player.deltaDisplay) }}
            </span>
          </Transition>
        </div>

        <!-- Increase half -->
        <button
          class="lc-half lc-half--right"
          @click="gameStore.adjustLife(player.id, +1)"
          @contextmenu.prevent="gameStore.adjustLife(player.id, +10)"
        >
          <v-icon size="28" color="rgba(255,255,255,0.7)">mdi-plus</v-icon>
        </button>
      </div>

      <!-- Commander damage grid -->
      <div class="lc-cmd-row">
        <CommanderDamageGrid
          :player="player"
          :all-players="gameStore.players"
          @open="cmdDialogOpen = true"
        />
        <v-btn
          icon
          size="x-small"
          variant="text"
          density="compact"
          title="Commander damage"
          @click.stop="cmdDialogOpen = true"
        >
          <v-icon size="16">mdi-sword-cross</v-icon>
        </v-btn>
      </div>
    </v-card>

    <!-- Commander damage dialog -->
    <CommanderDamageDialog
      v-model="cmdDialogOpen"
      :player="player"
      :all-players="gameStore.players"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Player } from '../stores/gameStore'
import { useGameStore } from '../stores/gameStore'
import { useSettingsStore } from '../stores/settingsStore'
import { formatDelta } from '../utils/gameHelpers'
import PlayerNameEdit from './PlayerNameEdit.vue'
import CommanderDamageGrid from './CommanderDamageGrid.vue'
import CommanderDamageDialog from './CommanderDamageDialog.vue'

const props = defineProps<{
  player: Player
  highlighted: boolean
  rotation: number
}>()

const gameStore = useGameStore()
const settingsStore = useSettingsStore()

const cmdDialogOpen = ref(false)

const playerColor = computed(() => settingsStore.getPlayerColor(props.player.id))

// Dim version for background tint
const playerColorDim = computed(() => {
  const hex = playerColor.value.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `rgba(${r},${g},${b},0.08)`
})

const deltaClass = computed(() => {
  if (!props.player.deltaDisplay) return ''
  return props.player.deltaDisplay > 0 ? 'delta--positive' : 'delta--negative'
})
</script>

<style scoped>
.life-counter-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  transform: rotate(var(--rotation));
}

.life-counter {
  width: 100%;
  display: flex;
  flex-direction: column;
  border: 2px solid var(--player-color, #1e88e5) !important;
  background: linear-gradient(135deg, var(--player-color-dim, rgba(30,136,229,0.08)), #1e1e1e) !important;
  position: relative;
  overflow: hidden;
  user-select: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.life-counter--highlighted {
  border-color: rgb(var(--v-theme-primary)) !important;
  box-shadow: 0 0 20px 4px rgb(var(--v-theme-primary)), 0 0 40px 6px rgba(var(--v-theme-primary), 0.4) !important;
}

.life-counter--starting {
  box-shadow: 0 0 12px 2px var(--player-color) !important;
}

.life-counter--dead {
  filter: grayscale(60%);
  opacity: 0.75;
}

/* Dead overlay */
.dead-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
  z-index: 10;
  pointer-events: none;
  gap: 4px;
}

.dead-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: rgba(255,255,255,0.7);
}

/* Header */
.lc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px 2px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.crown-icon {
  filter: drop-shadow(0 0 4px #ffa000);
  animation: crown-pulse 1.5s ease-in-out infinite;
}

@keyframes crown-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.15); }
}

/* Life row */
.lc-life-row {
  display: flex;
  flex: 1;
  align-items: stretch;
  min-height: 0;
}

.lc-half {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.12s;
  -webkit-tap-highlight-color: transparent;
  padding: 0;
}

.lc-half:active {
  background: rgba(255,255,255,0.08);
}

.lc-total-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  min-width: 80px;
  pointer-events: none;
}

.lc-life {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 700;
  line-height: 1;
  color: #fff;
  letter-spacing: -0.02em;
}

.lc-delta {
  font-size: 1.1rem;
  font-weight: 700;
  margin-top: 2px;
  min-height: 1.4em;
}

.delta--positive {
  color: #69f0ae;
}

.delta--negative {
  color: #ff5252;
}

/* Commander row */
.lc-cmd-row {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px 6px;
  gap: 4px;
}

/* Delta transition */
.delta-fade-enter-active,
.delta-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.delta-fade-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}

.delta-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
