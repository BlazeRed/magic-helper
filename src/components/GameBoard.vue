<template>
  <div
    class="game-board"
    :style="{
      gridTemplateAreas: layout.areas,
      gridTemplateColumns: layout.cols,
      gridTemplateRows: layout.rows,
    }"
  >
    <div v-for="(seat, index) in layout.seats" :key="seat.id" class="seat" :style="{ gridArea: seat.area }">
      <div class="seat__inner" :style="{ '--seat-rotation': `${seat.rotation}deg` }" :data-rotation="seat.rotation">
        <slot name="seat" :index="index" :seat="seat" />
      </div>
    </div>
    <div class="controls">
      <slot name="controls" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getBoardLayout } from '../utils/gridLayout'

const props = defineProps<{ numPlayers: number }>()
const layout = computed(() => getBoardLayout(props.numPlayers))
</script>

<style scoped>
.game-board {
  display: grid;
  gap: var(--hx-s-1);
  padding: var(--hx-s-1);
  width: 100%;
  height: 100dvh;
}

/* The cell is a size container; the inner box swaps width/height for 90°/270°
   so the rotated card fills the cell with no JS measuring. */
.seat {
  position: relative;
  container-type: size;
  min-width: 0;
  min-height: 0;
}
.seat__inner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100cqw;
  height: 100cqh;
  transform: translate(-50%, -50%) rotate(var(--seat-rotation));
  container-type: size; /* life number scales with cqw/cqh of the rotated card */
}
.seat__inner[data-rotation='90'],
.seat__inner[data-rotation='270'] {
  width: 100cqh;
  height: 100cqw;
}

.controls {
  grid-area: controls;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--hx-s-2);
}
</style>
