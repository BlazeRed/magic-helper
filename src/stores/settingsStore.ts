import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { DEFAULT_ACCENT } from '../plugins/vuetify'

export const MTG_COLORS = [
  { name: 'Mountain (Red)',    hex: '#e53935' },
  { name: 'Island (Blue)',     hex: '#1e88e5' },
  { name: 'Forest (Green)',    hex: '#388e3c' },
  { name: 'Swamp (Purple)',    hex: '#8e24aa' },
  { name: 'Plains (Gold)',     hex: '#f9a825' },
  { name: 'Artifact (Silver)', hex: '#90a4ae' },
  { name: 'Eldrazi (Void)',    hex: '#00695c' },
]

const STORAGE_KEY = 'mtg-app-settings'

interface AppSettings {
  accentColor: string
  playerColors: Record<number, string>
}

export const useSettingsStore = defineStore('settings', () => {
  const accentColor = ref<string>(DEFAULT_ACCENT)
  const playerColors = ref<Record<number, string>>({})

  function loadSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as AppSettings
        accentColor.value = parsed.accentColor ?? DEFAULT_ACCENT
        playerColors.value = parsed.playerColors ?? {}
      }
    } catch {
      // ignore
    }
  }

  function saveSettings() {
    const data: AppSettings = {
      accentColor: accentColor.value,
      playerColors: playerColors.value,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  function setAccentColor(hex: string) {
    accentColor.value = hex
    saveSettings()
  }

  function setPlayerColor(playerId: number, hex: string) {
    playerColors.value = { ...playerColors.value, [playerId]: hex }
    saveSettings()
  }

  function getPlayerColor(playerId: number): string {
    return playerColors.value[playerId] ?? '#1e88e5'
  }

  function ensurePlayerColors(playerIds: number[]) {
    const updated = { ...playerColors.value }
    let changed = false
    for (const id of playerIds) {
      if (!updated[id]) {
        updated[id] = '#1e88e5'
        changed = true
      }
    }
    if (changed) {
      playerColors.value = updated
      saveSettings()
    }
  }

  watch([accentColor, playerColors], saveSettings, { deep: true })

  return {
    accentColor,
    playerColors,
    loadSettings,
    setAccentColor,
    setPlayerColor,
    getPlayerColor,
    ensurePlayerColors,
  }
})
