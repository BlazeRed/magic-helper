<template>
  <div class="cmd-grid" @click.stop="$emit('open')">
    <div
      v-for="opp in opponents"
      :key="opp.id"
      class="cmd-pip"
      :title="`${opp.name}: ${damage(opp.id)}`"
    >
      <div
        class="pip-dot"
        :class="{ 'pip-dot--danger': damage(opp.id) >= 18 }"
        :style="{ background: settingsStore.getPlayerColor(opp.id) }"
      >
        <span v-if="damage(opp.id) > 0" class="pip-num">{{ damage(opp.id) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Player } from '../stores/gameStore'
import { useSettingsStore } from '../stores/settingsStore'

const props = defineProps<{
  player: Player
  allPlayers: Player[]
}>()
defineEmits<{ open: [] }>()

const settingsStore = useSettingsStore()

const opponents = computed(() =>
  props.allPlayers.filter(p => p.id !== props.player.id)
)

function damage(sourceId: number): number {
  return props.player.commanderDamage[sourceId] ?? 0
}
</script>

<style scoped>
.cmd-grid {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
  cursor: pointer;
  padding: 4px;
}

.pip-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: box-shadow 0.2s;
}

.pip-dot--danger {
  box-shadow: 0 0 6px 2px rgba(229, 57, 53, 0.8);
}

.pip-num {
  font-size: 0.65rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.8);
  line-height: 1;
}
</style>
