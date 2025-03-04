<script setup lang="ts">
import type { Database } from '@/types/DatabaseTypes'

const hex_color = defineModel<string | null | undefined>()
// From Vue 3.5, no need to use withDefaults to assign a default value to props
const {
  readonly = false,
  showToolTip = true,
  pointer = true,
} = defineProps<{
  readonly?: boolean
  showToolTip?: boolean
  pointer?: boolean
}>()
const emits = defineEmits<{
  (event: '@commit'): void
}>()

const colorPickerEl = ref<HTMLInputElement>()
// Flag used to toggle from the Paragraph to TextArea and vice-versa.
const isEditing = ref(false)
// Handle the editing start, by setting the TextArea element's rows
// property according to the Paragraph height.
const startEditing = () => {
  if (readonly) return

  isEditing.value = true
  nextTick(() => {
    colorPickerEl.value?.focus()
    colorPickerEl.value?.click()
  })
}
// Reset to readonly before emmitting update to parent component
const stopEditing = () => {
  console.log('exit editing...')

  isEditing.value = false
  emits('@commit')
}
</script>
<template>
  <div class="flex flex-row justify-between items-center">
    <p
      class="rounded-xl"
      :style="`height: 1.5rem; width: 1.5rem; background-color:${hex_color}`"
      v-show="!isEditing"
      @click="startEditing"
      @focus="startEditing"
      tabindex="0"
    ></p>
    <label ref="colorPickerEl" v-show="isEditing" @blur="stopEditing" class="flex items-center">
      <span class="pr-2"> Pick your color </span>
      <input type="color" v-model="hex_color" @blur="stopEditing" />
    </label>
    <PencilLine v-if="!isEditing && !readonly" @click="startEditing" class="pencil" />
  </div>
</template>

<style scoped>
.pencil {
  @apply text-slate-500 cursor-pointer;
}
</style>
