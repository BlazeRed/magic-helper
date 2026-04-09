import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'mtg-game-state'

export interface Player {
  id: number
  name: string
  life: number
  startingLife: number
  isDead: boolean
  isStartingPlayer: boolean
  commanderDamage: Record<number, number>
  deltaDisplay: number | null
}

type GamePhase = 'idle' | 'selecting' | 'playing'

const DELTA_TIMEOUT_MS = 2000

export const useGameStore = defineStore('game', () => {
  const players = ref<Player[]>([])
  const numPlayers = ref<number>(4)
  const startingLife = ref<number>(40)
  const gamePhase = ref<GamePhase>('idle')
  const startingPlayerId = ref<number | null>(null)
  const winner = ref<Player | null>(null)

  // Timer handles for delta auto-clear (keyed by playerId)
  const deltaTimers: Record<number, ReturnType<typeof setTimeout>> = {}

  // ─── helpers ───────────────────────────────────────────────────────────────

  function makePlayer(id: number, life: number): Player {
    return {
      id,
      name: `Player ${id}`,
      life,
      startingLife: life,
      isDead: false,
      isStartingPlayer: false,
      commanderDamage: {},
      deltaDisplay: null,
    }
  }

  function checkLoseCondition(player: Player) {
    const deadByLife = player.life <= 0
    const deadByCommander = Object.values(player.commanderDamage).some(d => d >= 21)
    player.isDead = deadByLife || deadByCommander
  }

  function checkWinCondition(): Player | null {
    const alive = players.value.filter(p => !p.isDead)
    if (alive.length === 1) return alive[0]!
    return null
  }

  function scheduleDeltaClear(playerId: number) {
    if (deltaTimers[playerId]) clearTimeout(deltaTimers[playerId])
    deltaTimers[playerId] = setTimeout(() => {
      const p = players.value.find(p => p.id === playerId)
      if (p) p.deltaDisplay = null
      saveState()
    }, DELTA_TIMEOUT_MS)
  }

  // ─── persistence ───────────────────────────────────────────────────────────

  function saveState() {
    const data = {
      players: players.value,
      numPlayers: numPlayers.value,
      startingLife: startingLife.value,
      gamePhase: gamePhase.value,
      startingPlayerId: startingPlayerId.value,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  function loadState(): boolean {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return false
      const data = JSON.parse(raw)
      players.value = data.players ?? []
      numPlayers.value = data.numPlayers ?? 4
      startingLife.value = data.startingLife ?? 40
      gamePhase.value = data.gamePhase ?? 'idle'
      startingPlayerId.value = data.startingPlayerId ?? null
      return players.value.length > 0
    } catch {
      return false
    }
  }

  // ─── actions ───────────────────────────────────────────────────────────────

  function initGame(n: number, life: number) {
    numPlayers.value = n
    startingLife.value = life
    winner.value = null

    players.value = Array.from({ length: n }, (_, i) => makePlayer(i + 1, life))

    gamePhase.value = 'idle'
    startingPlayerId.value = null
    saveState()
  }

  function resetGame() {
    winner.value = null
    const life = startingLife.value

    players.value = players.value.map(p => ({
      ...p,
      life,
      startingLife: life,
      isDead: false,
      isStartingPlayer: false,
      commanderDamage: {},
      deltaDisplay: null,
    }))

    gamePhase.value = 'idle'
    startingPlayerId.value = null
    saveState()
  }

  function startSelectingPlayer() {
    gamePhase.value = 'selecting'
    saveState()
  }

  function setStartingPlayer(id: number) {
    players.value.forEach(p => {
      p.isStartingPlayer = p.id === id
    })
    startingPlayerId.value = id
    gamePhase.value = 'playing'
    saveState()

    // Hide the crown after 10 seconds
    setTimeout(() => {
      const p = players.value.find(p => p.id === id)
      if (p) {
        p.isStartingPlayer = false
        saveState()
      }
    }, 10_000)
  }

  function adjustLife(playerId: number, delta: number) {
    const p = players.value.find(p => p.id === playerId)
    if (!p) return

    p.life += delta
    p.deltaDisplay = (p.deltaDisplay ?? 0) + delta
    scheduleDeltaClear(playerId)
    checkLoseCondition(p)

    const w = checkWinCondition()
    if (w) winner.value = w

    saveState()
  }

  function adjustCommanderDamage(targetId: number, sourceId: number, delta: number) {
    const target = players.value.find(p => p.id === targetId)
    if (!target) return

    const current = target.commanderDamage[sourceId] ?? 0
    const newDamage = Math.max(0, current + delta)
    const actualDelta = newDamage - current

    target.commanderDamage = { ...target.commanderDamage, [sourceId]: newDamage }

    if (actualDelta !== 0) {
      adjustLife(targetId, -actualDelta)
    }

    checkLoseCondition(target)
    saveState()
  }

  function setPlayerName(playerId: number, name: string) {
    const p = players.value.find(p => p.id === playerId)
    if (p) {
      p.name = name.trim() || p.name
      saveState()
    }
  }

  const isGameOver = computed(() => winner.value !== null)

  return {
    players,
    numPlayers,
    startingLife,
    gamePhase,
    startingPlayerId,
    winner,
    isGameOver,
    initGame,
    resetGame,
    startSelectingPlayer,
    setStartingPlayer,
    adjustLife,
    adjustCommanderDamage,
    setPlayerName,
    loadState,
    saveState,
  }
})
