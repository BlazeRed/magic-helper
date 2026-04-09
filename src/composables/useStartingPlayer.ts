import { ref } from 'vue'
import { useGameStore } from '../stores/gameStore'

const CYCLE_DURATION_MS = 2800
const CYCLE_INTERVAL_MS = 200

export function useStartingPlayer() {
  const gameStore = useGameStore()
  const highlightedPlayerId = ref<number | null>(null)
  const isAnimating = ref(false)

  function runAnimation(): Promise<void> {
    return new Promise(resolve => {
      isAnimating.value = true
      gameStore.startSelectingPlayer()

      const ids = gameStore.players.map(p => p.id)
      let idx = 0
      const start = Date.now()

      const interval = setInterval(() => {
        highlightedPlayerId.value = ids[idx % ids.length]!
        idx++

        if (Date.now() - start >= CYCLE_DURATION_MS) {
          clearInterval(interval)

          // Pick random winner
          const chosen = ids[Math.floor(Math.random() * ids.length)]!
          highlightedPlayerId.value = chosen
          gameStore.setStartingPlayer(chosen)
          isAnimating.value = false
          resolve()
        }
      }, CYCLE_INTERVAL_MS)
    })
  }

  return { highlightedPlayerId, isAnimating, runAnimation }
}
