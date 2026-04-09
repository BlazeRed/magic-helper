<template>
  <v-dialog v-model="open" max-width="440" persistent>
    <v-card rounded="xl" class="settings-dialog">
      <v-card-title class="pa-4 pb-2 d-flex align-center gap-2">
        <v-icon color="primary" class="mr-2">mdi-cards-playing</v-icon>
        Game Settings
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4">
        <!-- Player count -->
        <div class="section-label mb-2">Number of Players</div>
        <div class="btn-group mb-5">
          <button
            v-for="n in [2, 3, 4, 5, 6]"
            :key="n"
            class="seg-btn"
            :class="{ 'seg-btn--active': selectedPlayers === n }"
            @click="selectedPlayers = n"
          >
            {{ n }}
          </button>
        </div>

        <!-- Starting life -->
        <div class="section-label mb-2">Starting Life Total</div>
        <div class="btn-group">
          <button
            v-for="life in [20, 25, 30, 40, 60]"
            :key="life"
            class="seg-btn"
            :class="{ 'seg-btn--active': selectedLife === life }"
            @click="selectedLife = life"
          >
            {{ life }}
          </button>
        </div>
      </v-card-text>

      <v-card-actions class="pa-4 pt-0 gap-2">
        <v-btn
          v-if="hasActiveGame"
          variant="text"
          @click="open = false"
        >
          Cancel
        </v-btn>
        <div v-else class="brand-mark">
          <span class="brand-title">HelM</span>
          <span class="brand-tagline">Life Tracker</span>
        </div>
        <v-spacer />
        <v-btn
          color="primary"
          variant="elevated"
          size="large"
          min-width="140"
          @click="confirm"
        >
          <v-icon start>mdi-play</v-icon>
          Start Game
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
  start: [numPlayers: number, startingLife: number]
}>()

const open = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const gameStore = useGameStore()
const hasActiveGame = computed(() => gameStore.players.length > 0)

const selectedPlayers = ref(4)
const selectedLife = ref(40)

function confirm() {
  emit('start', selectedPlayers.value, selectedLife.value)
  open.value = false
}
</script>

<style scoped>
.settings-dialog {
  background: #1e1e1e;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
}

.btn-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.seg-btn {
  flex: 1;
  min-width: 44px;
  padding: 10px 6px;
  border-radius: 8px;
  border: 2px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.7);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
  outline: none;
}

.seg-btn:hover {
  border-color: rgba(255,255,255,0.35);
  background: rgba(255,255,255,0.1);
  color: #fff;
}

.seg-btn--active {
  border-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.15);
  color: rgb(var(--v-theme-primary));
  box-shadow: 0 0 8px rgba(var(--v-theme-primary), 0.3);
}

.brand-mark {
  display: flex;
  flex-direction: column;
  align-items: center;
  white-space: nowrap;
}

.brand-title {
  font-family: 'Cinzel Decorative', 'Cinzel', serif;
  font-size: 1.9em;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  letter-spacing: 0.05em;
  line-height: 1.1em;
}

.brand-tagline {
  font-family: 'Cinzel', serif;
  font-size: 0.76em;
  color: rgba(255, 255, 255, 0.42);
  line-height: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
}
</style>
