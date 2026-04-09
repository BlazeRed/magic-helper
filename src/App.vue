<template>
  <v-app theme="dark" class="app-root">
    <v-main class="app-main">
      <div v-if="gameStore.players.length > 0" :class="['game-grid', `grid-${gameStore.numPlayers}p`]">
        <!-- ─── Player cards by seat ─── -->
        <template v-for="slot in layoutSlots" :key="slot.area">
          <div v-if="slot.type === 'player'" :style="{ gridArea: slot.area }">
            <LifeCounter
              :key="`player-${gameStore.players[slot.playerIndex!]!.id}-${gameTimestamp}`"
              :player="gameStore.players[slot.playerIndex!]!"
              :highlighted="highlightedPlayerId === gameStore.players[slot.playerIndex!]!.id && isAnimating"
              :rotation="slot.rotation ?? 0"
            />
          </div>
        </template>

        <!-- ─── Center controls ─── -->
        <div class="controls-cell" style="grid-area: controls">
          <div class="brand-mark">
            <v-icon size="14" color="primary">mdi-cards-playing</v-icon>
            <span class="brand-title">The Arcane Codex</span>
          </div>

          <div class="controls-buttons">
            <v-btn
              icon
              size="large"
              variant="tonal"
              color="primary"
              @click="settingsDialogOpen = true"
            >
              <v-icon>mdi-cog</v-icon>
              <v-tooltip activator="parent" location="bottom">Game Settings</v-tooltip>
            </v-btn>

            <v-btn
              icon
              size="large"
              variant="tonal"
              color="error"
              @click="confirmReset"
            >
              <v-icon>mdi-refresh</v-icon>
              <v-tooltip activator="parent" location="bottom">Reset Game</v-tooltip>
            </v-btn>
          </div>

          <span class="brand-tagline">Commander Life Tracker</span>
        </div>
      </div>

      <!-- ─── First launch splash ─── -->
      <div v-else class="splash-screen">
        <div class="splash-content">
          <v-icon size="80" color="primary" class="mb-4">mdi-cards-playing</v-icon>
          <h1 class="splash-brand mb-1">The Arcane Codex</h1>
          <p class="splash-tagline mb-6">Commander Life Tracker</p>
          <v-btn color="primary" size="large" @click="settingsDialogOpen = true">
            <v-icon start>mdi-play</v-icon>
            New Game
          </v-btn>
        </div>
      </div>
    </v-main>

    <!-- ─── Winner snackbar ─── -->
    <v-snackbar
      v-model="showWinner"
      :timeout="-1"
      location="top"
      color="success"
      class="winner-snack"
    >
      <v-icon start>mdi-trophy</v-icon>
      <strong>{{ gameStore.winner?.name }}</strong> wins!
      <template #actions>
        <v-btn variant="text" @click="showWinner = false">Dismiss</v-btn>
      </template>
    </v-snackbar>

    <!-- ─── Reset confirm dialog ─── -->
    <v-dialog v-model="showResetConfirm" max-width="340">
      <v-card rounded="xl" color="#1e1e1e">
        <v-card-title class="pa-4 pb-2">
          <v-icon color="error" class="mr-2">mdi-refresh</v-icon>
          Reset Game?
        </v-card-title>
        <v-card-text class="pa-4 pt-0 text-medium-emphasis">
          All life totals and commander damage will be reset to the starting values.
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 gap-2">
          <v-spacer />
          <v-btn variant="text" @click="showResetConfirm = false">Cancel</v-btn>
          <v-btn color="error" variant="elevated" @click="doReset">
            <v-icon start>mdi-refresh</v-icon>
            Reset
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ─── Starting player overlay ─── -->
    <StartingPlayerOverlay :visible="isAnimating" />

    <!-- ─── Dialogs ─── -->
    <GameSettingsDialog v-model="settingsDialogOpen" @start="onGameStart" />
  </v-app>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useTheme } from 'vuetify'
import { useGameStore } from './stores/gameStore'
import { useSettingsStore } from './stores/settingsStore'
import { useStartingPlayer } from './composables/useStartingPlayer'
import LifeCounter from './components/LifeCounter.vue'
import GameSettingsDialog from './components/GameSettingsDialog.vue'
import StartingPlayerOverlay from './components/StartingPlayerOverlay.vue'

const theme = useTheme()
const gameStore = useGameStore()
const settingsStore = useSettingsStore()
const { highlightedPlayerId, isAnimating, runAnimation } = useStartingPlayer()

// Sync accent color → Vuetify theme
watch(() => settingsStore.accentColor, color => {
  theme.themes.value.dark!.colors.primary = color
}, { immediate: true })

const settingsDialogOpen = ref(false)
const showResetConfirm = ref(false)
const showWinner = ref(false)
const gameTimestamp = ref(Date.now())

// ─── Layout slot definitions per player count ───────────────────────────────

interface LayoutSlot {
  area: string
  type: 'player' | 'controls'
  playerIndex?: number
  rotation?: number
}

const layoutSlots = computed<LayoutSlot[]>(() => {
  const n = gameStore.numPlayers
  const maps: Record<number, LayoutSlot[]> = {
    2: [
      { area: 'p1', type: 'player', playerIndex: 0, rotation: 180 },
      { area: 'p2', type: 'player', playerIndex: 1, rotation: 0 },
      { area: 'controls', type: 'controls' },
    ],
    3: [
      { area: 'p1', type: 'player', playerIndex: 0, rotation: 180 },
      { area: 'p2', type: 'player', playerIndex: 1, rotation: 0 },
      { area: 'p3', type: 'player', playerIndex: 2, rotation: -90 },
      { area: 'controls', type: 'controls' },
    ],
    4: [
      { area: 'p1', type: 'player', playerIndex: 0, rotation: 0 },
      { area: 'p2', type: 'player', playerIndex: 1, rotation: 0 },
      { area: 'p3', type: 'player', playerIndex: 2, rotation: 180 },
      { area: 'p4', type: 'player', playerIndex: 3, rotation: 180 },
      { area: 'controls', type: 'controls' },
    ],
    5: [
      { area: 'p1', type: 'player', playerIndex: 0, rotation: 0 },
      { area: 'p2', type: 'player', playerIndex: 1, rotation: 0 },
      { area: 'p3', type: 'player', playerIndex: 2, rotation: 180 },
      { area: 'p4', type: 'player', playerIndex: 3, rotation: 180 },
      { area: 'p5', type: 'player', playerIndex: 4, rotation: 90 },
      { area: 'controls', type: 'controls' },
    ],
    6: [
      { area: 'p1', type: 'player', playerIndex: 0, rotation: 0 },
      { area: 'p2', type: 'player', playerIndex: 1, rotation: 0 },
      { area: 'p3', type: 'player', playerIndex: 2, rotation: 0 },
      { area: 'p4', type: 'player', playerIndex: 3, rotation: 180 },
      { area: 'p5', type: 'player', playerIndex: 4, rotation: 180 },
      { area: 'p6', type: 'player', playerIndex: 5, rotation: 180 },
      { area: 'controls', type: 'controls' },
    ],
  }
  return maps[n] ?? maps[4]!
})

// ─── Winner watcher ─────────────────────────────────────────────────────────

watch(() => gameStore.winner, val => {
  if (val) showWinner.value = true
})

// ─── Page size watcher ───────────────────────────────────────────────────────

window.addEventListener("resize", () => {
  // Trigger re-render of life counters to update their size
  gameTimestamp.value = Date.now()
})

// ─── Reset helpers ───────────────────────────────────────────────────────────

function confirmReset() {
  showResetConfirm.value = true
}

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
  gameTimestamp.value = Date.now()
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

<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cinzel+Decorative:wght@400;700;900&display=swap');

html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: manipulation;
  font-family: 'Cinzel', serif;
}

.app-root, .app-main {
  width: 100% !important;
  height: 100% !important;
  max-height: 100dvh !important;
}

.v-main__wrap {
  height: 100% !important;
}
</style>

<style scoped>
.app-main {
  display: flex;
  align-items: stretch;
  justify-content: stretch;
}

/* ─── Grid layouts ─────────────────────────────────────────────── */

.game-grid {
  width: 100%;
  height: 100dvh;
  display: grid;
  gap: 4px;
  padding: 4px;
  box-sizing: border-box;
}

/* 2 players */
.grid-2p {
  grid-template-rows: 1fr min-content 1fr;
  grid-template-columns: 1fr;
  grid-template-areas:
    "p1"
    "controls"
    "p2";
}

/* 3 players */
.grid-3p {
  grid-template-rows: 1fr min-content 1fr;
  grid-template-columns: 1fr min-content 1fr;
  grid-template-areas:
    "p1    .          p3"
    ".     controls   p3"
    "p2    .          p3";
}

/* 4 players */
.grid-4p {
  grid-template-rows: 1fr min-content 1fr;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    "p3       p4"
    "controls controls"
    "p1       p2";
}

/* 5 players */
.grid-5p {
  grid-template-rows: 1fr min-content 1fr;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas:
    "p5   p3       p4"
    "p5  controls  ."
    "p5   p1       p2";
}

/* 6 players */
.grid-6p {
  grid-template-rows: 1fr min-content 1fr;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas:
    "p4     p5         p6"
    ".      controls   ."
    "p1     p2         p3";
}

/* Grid cells: each player div fills its area */
.game-grid > div {
  min-height: 0;
  min-width: 0;
  display: flex;
  align-items: center;
}

/* Controls center */
.controls-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
}

.brand-mark {
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}

.brand-title {
  font-family: 'Cinzel Decorative', 'Cinzel', serif;
  font-size: clamp(0.55rem, 1.4vw, 0.85rem);
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  letter-spacing: 0.04em;
}

.controls-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-tagline {
  font-family: 'Cinzel', serif;
  font-size: clamp(0.4rem, 0.9vw, 0.6rem);
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
}

/* Splash screen */
.splash-screen {
  width: 100%;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.splash-content {
  text-align: center;
  padding: 32px;
}

.splash-brand {
  font-family: 'Cinzel Decorative', 'Cinzel', serif;
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  letter-spacing: 0.04em;
  line-height: 1.2;
}

.splash-tagline {
  font-family: 'Cinzel', serif;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
</style>
