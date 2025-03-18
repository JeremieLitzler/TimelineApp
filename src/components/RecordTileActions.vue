<script setup lang="ts">
import type { SingleRecordWithProjectOrTaskType } from '@/services/supabase-records-queries'
import { dateToSupabaseDateString } from '@/utils/date-format'
import { calculateElapsedTime } from '@/utils/time-calculator'

const { record = null, recording = false } = defineProps<{
  record: SingleRecordWithProjectOrTaskType | null
  recording?: boolean
}>()

const emits = defineEmits<{
  (event: '@stop', record: SingleRecordWithProjectOrTaskType | null): void
  (event: '@start', record: SingleRecordWithProjectOrTaskType | null): void
}>()

const elapsingTime = ref<string | null | undefined>(null)
watch(
  () => Date.now(),
  () => {
    const now = new Date(Date.now())
    const nowDtStr = dateToSupabaseDateString(now)
    elapsingTime.value = calculateElapsedTime(nowDtStr.value, record?.started_at)
  },
)
const startRecording = () => {
  console.log('record > project', record?.projects)
  console.log('record > task', record?.tasks)
  emits('@start', record)
}
</script>
<template v-if="record">
  <div v-if="recording">
    <p>{{ elapsingTime }}</p>
    <Button class="rounded-3xl capitalize" @click="$emit('@stop', record)">stop</Button>
  </div>
  <Button v-else class="rounded-3xl" @click="startRecording"
    ><Play /> {{ calculateElapsedTime(record?.started_at, record?.ended_at) }}</Button
  >
</template>

<style scoped></style>
