<template>
  <v-dialog v-model="open" max-width="540" :scrim="true">
    <v-card class="cmd-dialog" rounded="xl">

      <!-- Title -->
      <v-card-title class="d-flex align-center justify-space-between pa-4 pb-2">
        <div class="d-flex align-center gap-2">
          <div class="title-chip" :style="{ background: playerColor }" />
          <v-icon size="18" class="mr-1">mdi-sword-cross</v-icon>
          <span class="text-body-1 text-medium-emphasis">Commander Damage</span>
        </div>
        <v-btn icon size="small" variant="text" @click="open = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4">
        <div class="section-label mb-3">Damage Received</div>

        <!-- Positional player grid -->
        <div
          class="player-grid"
          :style="{
            gridTemplateAreas: gridConfig.template,
            gridTemplateColumns: gridConfig.cols,
            gridTemplateRows: gridConfig.rows,
          }"
        >
          <div
            v-for="slot in gridConfig.slots"
            :key="slot.id"
            class="grid-cell"
            :style="{ gridArea: `p${slot.id}` }"
          >
            <!-- Current player's own cell -->
            <div
              v-if="slot.id === player.id"
              class="player-card player-card--self"
              :style="{
                borderColor: playerColor,
                background: playerColorDim,
              }"
            >
              <div class="card-color-strip" :style="{ background: playerColor }" />
              <!-- Editable name -->
              <div class="self-name-row">
                <PlayerNameEdit
                  :model-value="player.name"
                  @update:model-value="gameStore.setPlayerName(player.id, $event)"
                />
                <v-icon size="12" class="edit-hint">mdi-pencil</v-icon>
              </div>
              <!-- Commander damage counter (self) -->
              <div class="damage-counter">
                <button
                  class="dmg-btn"
                  :disabled="damageFrom(player.id) <= 0"
                  @click="gameStore.adjustCommanderDamage(player.id, player.id, -1)"
                >−</button>
                <span
                  class="dmg-value"
                  :class="{ 'dmg-value--danger': damageFrom(player.id) >= 18 }"
                >{{ damageFrom(player.id) }}</span>
                <button
                  class="dmg-btn"
                  @click="gameStore.adjustCommanderDamage(player.id, player.id, +1)"
                >+</button>
              </div>
              <v-icon
                v-if="damageFrom(player.id) >= 21"
                size="14"
                color="error"
                class="skull-icon"
              >mdi-skull</v-icon>
            </div>

            <!-- Opponent cell -->
            <div
              v-else
              class="player-card player-card--opponent"
              :style="{
                borderColor: settingsStore.getPlayerColor(slot.id),
                background: opponentColorDim(slot.id),
              }"
            >
              <div
                class="card-color-strip"
                :style="{ background: settingsStore.getPlayerColor(slot.id) }"
              />
              <span class="card-name">{{ opponentName(slot.id) }}</span>
              <div class="damage-counter">
                <button
                  class="dmg-btn"
                  :disabled="damageFrom(slot.id) <= 0"
                  @click="gameStore.adjustCommanderDamage(player.id, slot.id, -1)"
                >−</button>
                <span
                  class="dmg-value"
                  :class="{ 'dmg-value--danger': damageFrom(slot.id) >= 18 }"
                >{{ damageFrom(slot.id) }}</span>
                <button
                  class="dmg-btn"
                  @click="gameStore.adjustCommanderDamage(player.id, slot.id, +1)"
                >+</button>
              </div>
              <v-icon
                v-if="damageFrom(slot.id) >= 21"
                size="14"
                color="error"
                class="skull-icon"
              >mdi-skull</v-icon>
            </div>
          </div>
        </div>

        <v-divider class="my-4" />

        <!-- Player color presets -->
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
import { getGridConfig } from '../utils/gridLayout'
import PlayerNameEdit from './PlayerNameEdit.vue'

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

const gridConfig = computed(() => getGridConfig(gameStore.numPlayers))

const playerColor = computed(() => settingsStore.getPlayerColor(props.player.id))

const playerColorDim = computed(() => hexToRgba(playerColor.value, 0.12))

function opponentColorDim(id: number): string {
  return hexToRgba(settingsStore.getPlayerColor(id), 0.08)
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function damageFrom(sourceId: number): number {
  return props.player.commanderDamage[sourceId] ?? 0
}

function opponentName(id: number): string {
  return props.allPlayers.find(p => p.id === id)?.name ?? `Player ${id}`
}
</script>

<style scoped>
.cmd-dialog {
  background: #1e1e1e;
}

.title-chip {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
}

/* ─── Positional grid ─────────────────────────────────── */
.player-grid {
  display: grid;
  gap: 8px;
}

.grid-cell {
  min-width: 0;
  min-height: 0;
}

/* ─── Player cards inside grid ────────────────────────── */
.player-card {
  border: 2px solid transparent;
  border-radius: 10px;
  padding: 8px 8px 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
  overflow: hidden;
  min-height: 80px;
}

.card-color-strip {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 10px 0 0 10px;
}

.card-name {
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgba(255,255,255,0.85);
}

/* Self card */
.player-card--self {
  opacity: 1;
}

.self-name-row {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.edit-hint {
  opacity: 0.4;
  flex-shrink: 0;
}

/* Damage counter */
.damage-counter {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
}

.dmg-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.08);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.12s;
  padding: 0;
  line-height: 1;
}

.dmg-btn:hover:not(:disabled) {
  background: rgba(255,255,255,0.15);
}

.dmg-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.dmg-value {
  font-size: 1.1rem;
  font-weight: 700;
  min-width: 28px;
  text-align: center;
}

.dmg-value--danger {
  color: #ff5252;
  text-shadow: 0 0 6px rgba(255, 82, 82, 0.6);
}

.skull-icon {
  position: absolute;
  top: 6px;
  right: 6px;
}

/* ─── Color presets ───────────────────────────────────── */
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
