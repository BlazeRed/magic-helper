<template>
  <HxDialog v-model:open="open" title="Victory">
    <p class="victory__name">{{ winnerName }}</p>
    <HxOrnament />
    <div class="victory__actions">
      <HxButton variant="primary" @click="emit('rematch')">Rematch</HxButton>
      <HxButton @click="emit('new-game')">New game</HxButton>
      <HxButton @click="emit('home')">Home</HxButton>
    </div>
  </HxDialog>
</template>

<script setup lang="ts">
import HxButton from './ui/HxButton.vue'
import HxDialog from './ui/HxDialog.vue'
import HxOrnament from './ui/HxOrnament.vue'

const open = defineModel<boolean>('open', { required: true })
defineProps<{ winnerName: string }>()
const emit = defineEmits<{ rematch: []; 'new-game': []; home: [] }>()
</script>

<style scoped>
.victory__name {
  margin: 0 0 var(--hx-s-4);
  font-size: var(--hx-fs-display);
  line-height: 1.1;
  text-align: center;
  color: var(--hx-gold);
}
.victory__actions { display: grid; gap: var(--hx-s-3); margin-top: var(--hx-s-4); }
</style>
