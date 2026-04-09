<template>
  <div class="name-edit-wrapper" @dblclick="startEdit">
    <span v-if="!editing" class="player-name text-truncate">{{ modelValue }}</span>
    <input
      v-else
      ref="inputRef"
      v-model="draft"
      class="name-input"
      :maxlength="20"
      @blur="commit"
      @keydown.enter="commit"
      @keydown.escape="cancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const editing = ref(false)
const draft = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

async function startEdit() {
  draft.value = props.modelValue
  editing.value = true
  await nextTick()
  inputRef.value?.select()
}

function commit() {
  const trimmed = draft.value.trim()
  if (trimmed) emit('update:modelValue', trimmed)
  editing.value = false
}

function cancel() {
  editing.value = false
}
</script>

<style scoped>
.name-edit-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  min-width: 0;
}

.player-name {
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.03em;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.name-input {
  background: transparent;
  border: none;
  border-bottom: 2px solid currentColor;
  color: inherit;
  font: inherit;
  font-weight: 600;
  font-size: 0.95rem;
  outline: none;
  width: 140px;
  padding: 0 2px;
}
</style>
