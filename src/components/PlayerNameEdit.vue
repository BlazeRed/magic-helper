<template>
  <div class="name-edit">
    <button v-if="!editing" class="name-edit__name" type="button" @click="startEdit">{{ modelValue }}</button>
    <input
      v-else
      ref="inputRef"
      v-model="draft"
      class="name-edit__input"
      :maxlength="20"
      aria-label="Player name"
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
  if (!editing.value) return
  const trimmed = draft.value.trim()
  if (trimmed) emit('update:modelValue', trimmed)
  editing.value = false
}

function cancel() {
  editing.value = false
}
</script>

<style scoped>
.name-edit { min-width: 0; }
.name-edit__name,
.name-edit__input {
  max-width: 12rem;
  padding: 0 var(--hx-s-1);
  border: 0;
  background: transparent;
  color: var(--hx-ink);
  font: inherit;
  font-size: var(--hx-fs-body);
  font-weight: 500;
}
.name-edit__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.name-edit__name:focus-visible { outline: 2px solid var(--hx-gold); }
.name-edit__input { border-bottom: 1px solid var(--hx-gold); outline: none; }
</style>
