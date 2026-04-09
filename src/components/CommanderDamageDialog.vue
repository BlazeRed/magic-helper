<template>
  <v-dialog v-model="open" max-width="480" :scrim="true">
    <v-card class="cmd-dialog" rounded="xl">
      <!-- Title -->
      <v-card-title class="d-flex align-center justify-space-between pa-4 pb-2">
        <div class="d-flex align-center gap-2">
          <v-icon :color="playerColor" class="mr-2">mdi-sword-cross</v-icon>
          <span>{{ player.name }}</span>
        </div>
        <v-btn icon size="small" variant="text" @click="open = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4">
        <!-- Commander damage section -->
        <div class="section-label mb-3">Commander Damage Received</div>

        <div class="cmd-rows">
          <div
            v-for="opp in opponents"
            :key="opp.id"
            class="cmd-row"
          >
            <!-- Color chip -->
            <div
              class="opp-chip"
              :style="{ background: settingsStore.getPlayerColor(opp.id) }"
            />

            <!-- Opponent name -->
            <span class="opp-name text-truncate">{{ opp.name }}</span>

            <!-- Counter controls -->
            <div class="cmd-counter">
              <v-btn
                icon
                size="small"
                variant="tonal"
                :disabled="damageFrom(opp.id) <= 0"
                @click="gameStore.adjustCommanderDamage(player.id, opp.id, -1)"
              >
                <v-icon>mdi-minus</v-icon>
              </v-btn>

              <span
                class="cmd-value"
                :class="{ 'cmd-value--danger': damageFrom(opp.id) >= 18 }"
              >
                {{ damageFrom(opp.id) }}
              </span>

              <v-btn
                icon
                size="small"
                variant="tonal"
                :color="damageFrom(opp.id) >= 21 ? 'error' : undefined"
                @click="gameStore.adjustCommanderDamage(player.id, opp.id, +1)"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>

            <!-- Danger skull at 21 -->
            <v-icon v-if="damageFrom(opp.id) >= 21" size="18" color="error">mdi-skull</v-icon>
            <div v-else style="width:18px" />
          </div>
        </div>

        <v-divider class="my-4" />

        <!-- Player color section -->
        <div class="section-label mb-3">Player Color</div>

        <div class="color-presets">
          <button
            v-for="preset in MTG_COLORS"
            :key="preset.hex"
            class="color-swatch"
            :class="{ 'color-swatch--active': playerColor === preset.hex }"
            :style="{ background: preset.hex }"
            :title="preset.name"
            @click="settingsStore.setPlayerColor(player.id, preset.hex)"
          />
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Player } from '../stores/gameStore'
import { useGameStore } from '../stores/gameStore'
import { useSettingsStore } from '../stores/settingsStore'
import { MTG_COLORS } from '../stores/settingsStore'

const props = defineProps<{
  modelValue: boolean
  player: Player
  allPlayers: Player[]
}>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

const open = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const gameStore = useGameStore()
const settingsStore = useSettingsStore()

const playerColor = computed(() => settingsStore.getPlayerColor(props.player.id))

const opponents = computed(() =>
  props.allPlayers.filter(p => p.id !== props.player.id)
)

function damageFrom(sourceId: number): number {
  return props.player.commanderDamage[sourceId] ?? 0
}
</script>

<style scoped>
.cmd-dialog {
  background: #1e1e1e;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
}

.cmd-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cmd-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.opp-chip {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 4px 1px currentColor;
}

.opp-name {
  flex: 1;
  font-size: 0.9rem;
  min-width: 0;
}

.cmd-counter {
  display: flex;
  align-items: center;
  gap: 6px;
}

.cmd-value {
  font-size: 1.2rem;
  font-weight: 700;
  min-width: 32px;
  text-align: center;
}

.cmd-value--danger {
  color: #ff5252;
  text-shadow: 0 0 8px rgba(255, 82, 82, 0.6);
}

/* Color presets */
.color-presets {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.color-swatch {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition: transform 0.15s, border-color 0.15s;
  outline: none;
  padding: 0;
}

.color-swatch:hover {
  transform: scale(1.15);
}

.color-swatch--active {
  border-color: #fff;
  transform: scale(1.1);
  box-shadow: 0 0 8px 2px rgba(255,255,255,0.4);
}
</style>
