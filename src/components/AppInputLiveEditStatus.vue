<script setup lang="ts">
import type { Database } from '@/types/DatabaseTypes'

const status = defineModel<boolean | null | undefined>()
// TODO > From Vue 3.5, no need to use withDefaults to assign a default value to props
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
const toggleValue = () => {
  if (readonly) return

  status.value = !status.value
  emits('@commit')
}
</script>
<template>
  <div class="flex flex-row justify-between">
    <div
      class="text-3xl"
      :class="{ 'cursor-pointer': pointer }"
      @click="toggleValue"
      @keyup.enter="toggleValue"
      tabindex="0"
    >
      <Transition mode="out-in">
        <span v-if="!status" class="text-gray-400" title="Not completed"><CircleDotDashed /></span>
        <span v-else class="text-green-400" title="Completed"><CircleCheckBig /></span>
      </Transition>
    </div>
    <Info v-if="showToolTip" class="text-slate-500"></Info>
  </div>
</template>

<style scoped>
.v-enter-active,
v-leave-active {
  transition: transform 0.2s;
}

.v-enter-from,
v-leave-to {
  transform: scale(0.3);
}
</style>
