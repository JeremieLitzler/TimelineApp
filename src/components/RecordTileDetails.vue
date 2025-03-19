<script setup lang="ts">
import type { SingleRecordWithProjectOrTaskType } from '@/services/supabase-records-queries'
import type { Record } from '@/types/Record'
import { RouterPathEnum } from '@/types/RouterPathEnum'
const { record = null } = defineProps<{
  record: SingleRecordWithProjectOrTaskType | Record | null
}>()

const emits = defineEmits<{
  (event: '@stop'): void
}>()

const completeTask = () => {
  // update the task to completed
  // stop recording
  emits('@stop')
}
</script>
<template>
  <div v-if="record" class="flex flex-col">
    <!-- Record component -->
    <RouterLink
      :to="`${RouterPathEnum.Projects}/${record.projects?.slug}`"
      class="text-left underline hover:bg-muted block w-full font-medium flex items-center gap-2"
    >
      <AppColoredDot :hex-color="record.projects?.hex_color" height=".5rem" width=".5rem" />
      <p>{{ record.projects?.name }}</p>
    </RouterLink>

    <template v-if="record.tasks">
      <div class="mt-4 flex gap-2">
        <AppInputLiveEditStatus
          v-model="record.tasks.completed"
          @@commit="completeTask"
          :show-tool-tip="false"
        />
        <p>{{ record.tasks?.name }}</p>
      </div>
    </template>
  </div>
</template>

<style scoped></style>
