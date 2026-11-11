import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@fontsource-variable/cormorant-garamond'
import '@fontsource-variable/inter'
import './styles/tokens.css'
import './styles/base.css'
import App from './App.vue'
import router from './router'
import { useGameStore } from './stores/gameStore'
import { useSettingsStore } from './stores/settingsStore'

const app = createApp(App)
app.use(createPinia())

// Restore saved state before the router runs its first guard.
const settingsStore = useSettingsStore()
settingsStore.loadSettings()
if (useGameStore().loadState()) {
  settingsStore.ensurePlayerColors(useGameStore().players.map(p => p.id))
}

app.use(router)
app.mount('#app')
