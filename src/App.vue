<template>
  <!-- TODO(step-2): throwaway kit route, remove before merge -->
  <RouterView v-if="$route.path === '/_kit'" />
  <div v-else class="app-root">
    <GameBoard v-if="gameStore.players.length > 0" :num-players="gameStore.numPlayers">
      <template #seat="{ index }">
        <PlayerCard
          :player="gameStore.players[index]!"
          :highlighted="highlightedPlayerId === gameStore.players[index]!.id && isAnimating"
        />
      </template>
      <template #controls>
        <div class="controls-buttons">
          <HxButton variant="icon" aria-label="Game settings" @click="settingsDialogOpen = true">
            <HxIcon name="settings" />
          </HxButton>
          <HxButton variant="icon" aria-label="Reset game" @click="showResetConfirm = true">
            <HxIcon name="reset" />
          </HxButton>
        </div>
      </template>
    </GameBoard>

    <!-- First launch splash (replaced by Home in Step 6) -->
    <div v-else class="splash">
      <h1 class="splash__title">HelM</h1>
      <p class="hx-label">Life Tracker</p>
      <HxButton variant="primary" @click="settingsDialogOpen = true">New game</HxButton>
    </div>

    <!-- Winner (replaced by VictoryView in Step 6) -->
    <HxDialog v-model:open="showWinner" title="Victory">
      <p class="winner__text">{{ gameStore.winner?.name }} wins!</p>
      <HxButton variant="primary" @click="showWinner = false">Close</HxButton>
    </HxDialog>

    <HxConfirm
      v-model:open="showResetConfirm"
      title="Reset game?"
      text="All life totals and commander damage return to the starting values."
      confirm-label="Reset"
      @confirm="doReset"
    />

    <StartingPlayerOverlay :visible="isAnimating" :highlighted-player-id="highlightedPlayerId" />
    <GameSettingsDialog v-model="settingsDialogOpen" @start="onGameStart" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useGameStore } from './stores/gameStore'
import { useSettingsStore } from './stores/settingsStore'
import { useStartingPlayer } from './composables/useStartingPlayer'
import GameBoard from './components/GameBoard.vue'
import PlayerCard from './components/PlayerCard.vue'
import GameSettingsDialog from './components/GameSettingsDialog.vue'
import StartingPlayerOverlay from './components/StartingPlayerOverlay.vue'
import HxButton from './components/ui/HxButton.vue'
import HxConfirm from './components/ui/HxConfirm.vue'
import HxDialog from './components/ui/HxDialog.vue'
import HxIcon from './components/ui/HxIcon.vue'

const gameStore = useGameStore()
const settingsStore = useSettingsStore()
const { highlightedPlayerId, isAnimating, runAnimation } = useStartingPlayer()

const settingsDialogOpen = ref(false)
const showResetConfirm = ref(false)
const showWinner = ref(false)

// ─── Winner watcher ─────────────────────────────────────────────────────────

watch(() => gameStore.winner, val => {
  if (val) showWinner.value = true
})

// ─── Reset helpers ───────────────────────────────────────────────────────────

function doReset() {
  showResetConfirm.value = false
  showWinner.value = false
  gameStore.resetGame()
  runAnimation()
}

// ─── Game start ─────────────────────────────────────────────────────────────

async function onGameStart(numPlayers: number, life: number) {
  settingsStore.ensurePlayerColors(
    Array.from({ length: numPlayers }, (_, i) => i + 1)
  )
  gameStore.initGame(numPlayers, life)
  await runAnimation()
}

// ─── Boot ────────────────────────────────────────────────────────────────────

onMounted(async () => {
  settingsStore.loadSettings()
  const restored = gameStore.loadState()
  if (restored) {
    settingsStore.ensurePlayerColors(gameStore.players.map(p => p.id))
    if (gameStore.gamePhase === 'idle') {
      await runAnimation()
    }
  } else {
    // First launch: open settings
    settingsDialogOpen.value = true
  }
})
</script>

<style scoped>
.app-root { width: 100%; height: 100dvh; overflow: hidden; }

.controls-buttons { display: flex; gap: var(--hx-s-4); }

.splash {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--hx-s-4);
}
.splash__title {
  margin: 0;
  font-size: var(--hx-fs-display);
  font-weight: 500;
  letter-spacing: var(--hx-tracking-title);
  text-transform: uppercase;
  color: var(--hx-ink-strong);
}

.winner__text { margin: 0 0 var(--hx-s-5); font-size: var(--hx-fs-lead); }
</style>
