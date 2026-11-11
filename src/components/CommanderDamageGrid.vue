<template>
  <button
    type="button"
    class="cmd-pip-grid"
    aria-label="Commander damage"
    :style="{
      gridTemplateAreas: gridConfig.template[player.id] ?? gridConfig.template[1],
      gridTemplateColumns: gridConfig.cols,
      gridTemplateRows: gridConfig.rows,
    }"
    @click.stop="$emit('open')"
  >
    <div
      v-for="slot in gridConfig.slots"
      :key="slot.id"
      class="pip-cell"
      :style="{ gridArea: `p${slot.id}` }"
    >
      <!-- Self pip (same style as opponent, shows self-damage) -->
      <div
        v-if="slot.id === player.id"
        class="pip-dot"
        :class="{ 'pip-dot--danger': damage(player.id) >= 18 }"
        :style="{ background: settingsStore.getPlayerColor(player.id) }"
        :title="`${player.name}: ${damage(player.id)}`"
      >
        <span v-if="damage(player.id) > 0" class="pip-num">{{ damage(player.id) }}</span>
      </div>
      <!-- Opponent pip -->
      <div
        v-else
        class="pip-dot"
        :class="{ 'pip-dot--danger': damage(slot.id) >= 18 }"
        :style="{ background: settingsStore.getPlayerColor(slot.id) }"
        :title="`${playerName(slot.id)}: ${damage(slot.id)}`"
      >
        <span v-if="damage(slot.id) > 0" class="pip-num">{{ damage(slot.id) }}</span>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Player } from '../stores/gameStore'
import { useGameStore } from '../stores/gameStore'
import { useSettingsStore } from '../stores/settingsStore'
import { getGridConfig } from '../utils/gridLayout'

const props = defineProps<{
  player: Player
  allPlayers: Player[]
}>()
defineEmits<{ open: [] }>()

const gameStore = useGameStore()
const settingsStore = useSettingsStore()

const gridConfig = computed(() => getGridConfig(gameStore.numPlayers))

function damage(sourceId: number): number {
  return props.player.commanderDamage[sourceId] ?? 0
}

function playerName(id: number): string {
  return props.allPlayers.find(p => p.id === id)?.name ?? `Player ${id}`
}
</script>

<style scoped>
.cmd-pip-grid {
  display: grid;
  gap: var(--hx-s-1);
  min-height: 3.5rem;
  padding: var(--hx-s-1);
  border: 0;
  background: transparent;
  cursor: pointer;
}
.cmd-pip-grid:focus-visible { outline: 2px solid var(--hx-gold); }

.pip-cell { display: flex; align-items: center; justify-content: center; }

/* Diamond chip in the source player's color. */
.pip-dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  transform: rotate(45deg);
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.pip-dot--danger { outline-color: var(--hx-danger); }

.pip-num {
  transform: rotate(-45deg);
  font-family: var(--hx-font-sans);
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1;
  color: var(--hx-ink-on-gold);
}
</style>
