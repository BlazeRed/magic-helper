<template>
  <Teleport to="body">
    <Transition name="overlay-fade">
      <div v-if="visible" class="spo-backdrop">
        <div class="spo-content">
          <div class="spo-spinner">
            <v-icon size="48" color="primary" class="spo-icon">mdi-cards-playing</v-icon>
          </div>
          <p class="spo-text">Selecting starting player…</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean }>()
</script>

<style scoped>
.spo-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  pointer-events: none;
}

.spo-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spo-icon {
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spo-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.05em;
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}
</style>
