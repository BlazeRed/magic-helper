<template>
  <div class="game">
    <GameBoard :num-players="gameStore.numPlayers">
      <template #seat="{ index }">
        <PlayerCard
          :player="gameStore.players[index]!"
          :highlighted="highlightedPlayerId === gameStore.players[index]!.id && isAnimating"
        />
      </template>
      <template #controls>
        <div class="controls">
          <HxButton variant="icon" aria-label="Home" @click="router.push('/')">
            <HxIcon name="back" />
          </HxButton>
          <HxButton variant="icon" aria-label="Game settings" @click="router.push('/new')">
            <HxIcon name="settings" />
          </HxButton>
          <HxButton variant="icon" aria-label="Reset game" @click="showResetConfirm = true">
            <HxIcon name="reset" />
          </HxButton>
        </div>
      </template>
    </GameBoard>

    <HxConfirm
      v-model:open="showResetConfirm"
      title="Reset game?"
      text="All life totals and commander damage return to the starting values."
      confirm-label="Reset"
      @confirm="rematch"
    />
    <VictoryOverlay
      v-model:open="showVictory"
      :winner-name="gameStore.winner?.name ?? ''"
      @rematch="rematch"
      @new-game="router.push('/new')"
      @home="router.push('/')"
    />
    <StartingPlayerOverlay :visible="isAnimating" :highlighted-player-id="highlightedPlayerId" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import { useStartingPlayer } from '../composables/useStartingPlayer'
import GameBoard from '../components/GameBoard.vue'
import PlayerCard from '../components/PlayerCard.vue'
import StartingPlayerOverlay from '../components/StartingPlayerOverlay.vue'
import VictoryOverlay from '../components/VictoryOverlay.vue'
import HxButton from '../components/ui/HxButton.vue'
import HxConfirm from '../components/ui/HxConfirm.vue'
import HxIcon from '../components/ui/HxIcon.vue'

const router = useRouter()
const gameStore = useGameStore()
const { highlightedPlayerId, isAnimating, runAnimation } = useStartingPlayer()

const showResetConfirm = ref(false)
const showVictory = ref(false)

watch(() => gameStore.winner, winner => {
  showVictory.value = winner !== null
})

function rematch() {
  showVictory.value = false
  gameStore.resetGame()
  runAnimation()
}

// A new or restored game that never picked a starting player picks one now.
onMounted(() => {
  if (gameStore.gamePhase !== 'playing') runAnimation()
})
</script>

<style scoped>
.game { width: 100%; height: 100dvh; overflow: hidden; }
.controls { display: flex; gap: var(--hx-s-4); }
</style>
