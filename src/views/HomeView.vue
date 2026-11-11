<template>
  <main class="home">
    <h1 class="home__logo">HelM</h1>
    <p class="hx-label">Life Tracker</p>
    <HxOrnament class="home__ornament" />

    <HxFrame v-if="gameStore.players.length > 0" class="home__resume">
      <p class="hx-label">Game in progress</p>
      <p class="home__summary">{{ gameStore.numPlayers }} players · {{ gameStore.startingLife }} life</p>
      <HxButton variant="primary" @click="router.push('/game')">Resume</HxButton>
    </HxFrame>

    <HxButton :variant="gameStore.players.length > 0 ? 'secondary' : 'primary'" @click="router.push('/new')">
      New game
    </HxButton>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import HxButton from '../components/ui/HxButton.vue'
import HxFrame from '../components/ui/HxFrame.vue'
import HxOrnament from '../components/ui/HxOrnament.vue'

const router = useRouter()
const gameStore = useGameStore()
</script>

<style scoped>
.home {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--hx-s-4);
  padding: var(--hx-s-5);
}
.home__logo {
  margin: 0;
  font-size: var(--hx-fs-display);
  font-weight: 500;
  letter-spacing: var(--hx-tracking-title);
  text-transform: uppercase;
  color: var(--hx-ink-strong);
}
.home__ornament { width: min(16rem, 100%); }
.home__resume { display: grid; justify-items: center; gap: var(--hx-s-3); width: min(20rem, 100%); }
.home__resume p { margin: 0; }
.home__summary { font-size: var(--hx-fs-lead); color: var(--hx-ink-strong); }
</style>
