<script setup lang="ts">
import type { SingleRecordWithProjectOrTaskType } from '@/services/supabase-records-queries'
import { RouterPathEnum } from '@/types/RouterPathEnum'
import { calculateElapsedTime } from '@/utils/time-calculator'

const { record } = defineProps<{
  record: SingleRecordWithProjectOrTaskType
}>()

const updateTask = () => console.log('updateTask to code...')
</script>
<template>
  <article class="mb-4">
    <!-- Record component -->
    <RouterLink
      :to="`${RouterPathEnum.Projects}/${record.projects?.slug}`"
      class="text-left underline hover:bg-muted block w-full font-medium flex items-center gap-2"
    >
      <AppColoredDot :hex-color="record.projects?.hex_color" height=".5rem" width=".5rem" />
      <p>{{ record.projects?.name }}</p>
    </RouterLink>
    <template v-if="record.tasks">
      <AppInputLiveEditStatus v-model="record.tasks.completed" @@commit="updateTask" />
      <p>{{ record.tasks?.name }}</p>
    </template>
    <p>{{ calculateElapsedTime(record.started_at, record.ended_at) }}</p>
    <hr />
  </article>
</template>

<style scoped></style>
