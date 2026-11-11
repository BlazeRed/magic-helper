import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const MTG_COLORS = [
  { name: 'Mountain (Red)',    hex: '#e53935' },
  { name: 'Island (Blue)',     hex: '#1e88e5' },
  { name: 'Forest (Green)',    hex: '#388e3c' },
  { name: 'Swamp (Purple)',    hex: '#8e24aa' },
  { name: 'Plains (Gold)',     hex: '#f9a825' },
  { name: 'Artifact (Silver)', hex: '#90a4ae' },
  { name: 'Eldrazi (Void)',    hex: '#00695c' },
]

// Default color per seat: red, blue, green, black, white, silver.
const SEAT_DEFAULTS = ['#e53935', '#1e88e5', '#388e3c', '#8e24aa', '#f9a825', '#90a4ae']
const seatDefault = (playerId: number) => SEAT_DEFAULTS[(playerId - 1 + SEAT_DEFAULTS.length) % SEAT_DEFAULTS.length]

const STORAGE_KEY = 'mtg-app-settings'

interface AppSettings {
  playerColors: Record<number, string>
}

export const useSettingsStore = defineStore('settings', () => {
  const playerColors = ref<Record<number, string>>({})

  function loadSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as AppSettings
        playerColors.value = parsed.playerColors ?? {}
      }
    } catch {
      // ignore
    }
  }

  function saveSettings() {
    const data: AppSettings = {
      playerColors: playerColors.value,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  function setPlayerColor(playerId: number, hex: string) {
    playerColors.value = { ...playerColors.value, [playerId]: hex }
    saveSettings()
  }

  function getPlayerColor(playerId: number): string {
    return playerColors.value[playerId] ?? seatDefault(playerId)
  }

  function ensurePlayerColors(playerIds: number[]) {
    const updated = { ...playerColors.value }
    let changed = false
    for (const id of playerIds) {
      if (!updated[id]) {
        updated[id] = seatDefault(id)
        changed = true
      }
    }
    if (changed) {
      playerColors.value = updated
      saveSettings()
    }
  }

  watch(playerColors, saveSettings, { deep: true })

  return {
    playerColors,
    loadSettings,
    setPlayerColor,
    getPlayerColor,
    ensurePlayerColors,
  }
})
