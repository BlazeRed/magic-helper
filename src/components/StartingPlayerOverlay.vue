<template>
  <Teleport to="body">
    <Transition name="overlay-fade">
      <div v-if="visible" class="spo" role="status">
        <div class="spo__row">
          <span
            v-for="p in gameStore.players"
            :key="p.id"
            class="spo__gem"
            :class="{ 'is-lit': p.id === highlightedPlayerId }"
            :style="{ background: settingsStore.getPlayerColor(p.id) }"
          />
        </div>
        <p class="spo__text">Choosing starting player…</p>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'
import { useSettingsStore } from '../stores/settingsStore'

defineProps<{ visible: boolean; highlightedPlayerId: number | null }>()

const gameStore = useGameStore()
const settingsStore = useSettingsStore()
</script>

<style scoped>
.spo {
  position: fixed;
  inset: 0;
  z-index: var(--hx-z-overlay);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--hx-s-6);
  background: color-mix(in srgb, var(--hx-bg-deep) 85%, transparent);
  pointer-events: none;
}
.spo__row { display: flex; gap: var(--hx-s-5); }
.spo__gem {
  width: 2rem;
  height: 2rem;
  opacity: 0.35;
  transform: rotate(45deg) scale(0.8);
  outline: 2px solid transparent;
  outline-offset: 4px;
  transition: opacity var(--hx-dur-fast), transform var(--hx-dur-fast), outline-color var(--hx-dur-fast);
}
.spo__gem.is-lit {
  opacity: 1;
  transform: rotate(45deg) scale(1.15);
  outline-color: var(--hx-gold);
}
.spo__text {
  margin: 0;
  font-size: var(--hx-fs-lead);
  text-transform: uppercase;
  letter-spacing: var(--hx-tracking-title);
  color: var(--hx-ink-strong);
}
.overlay-fade-enter-active,
.overlay-fade-leave-active { transition: opacity 0.3s; }
.overlay-fade-enter-from,
.overlay-fade-leave-to { opacity: 0; }
</style>
