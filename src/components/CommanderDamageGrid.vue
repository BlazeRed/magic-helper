<template>
  <div
    class="cmd-pip-grid"
    :style="{
      gridTemplateAreas: gridConfig.template,
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
      <!-- Self marker -->
      <div
        v-if="slot.id === player.id"
        class="self-dot"
        :style="{ borderColor: settingsStore.getPlayerColor(player.id) }"
      />
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
  </div>
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
  gap: 3px;
  cursor: pointer;
  /* Size scales with content; each cell is 26px */
  --cell: 26px;
}

.pip-cell {
  width: var(--cell);
  height: var(--cell);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pip-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.2s;
}

.pip-dot--danger {
  box-shadow: 0 0 5px 2px rgba(229, 57, 53, 0.85);
}

.pip-num {
  font-size: 0.6rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.9);
  line-height: 1;
}

.self-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid currentColor;
  opacity: 0.4;
}
</style>
