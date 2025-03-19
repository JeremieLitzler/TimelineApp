<script setup lang="ts">
import type { SingleRecordWithProjectOrTaskType } from '@/services/supabase-records-queries'
import type { Record } from '@/types/Record'
import { formatDateToStr } from '@/utils/date-format'
import { calculateElapsedTime } from '@/utils/time-calculator'

const { record = null, recording = false } = defineProps<{
  record: SingleRecordWithProjectOrTaskType | Record | null
  recording?: boolean
}>()

const emits = defineEmits<{
  (event: '@stop', record: SingleRecordWithProjectOrTaskType | Record | null): void
  (event: '@start', record: SingleRecordWithProjectOrTaskType | Record | null): void
}>()

let intervalId = ref<number | NodeJS.Timeout>(0)
const elapsingTime = ref<string | null | undefined>(null)
const updateElapsingTime = () => {
  const now = new Date(Date.now())
  const nowDtStr = formatDateToStr(now, 'YYYY-MM-DDTHH:mm:ss.SSS')
  const elapasedTime = calculateElapsedTime(nowDtStr.value, record?.started_at)
  console.log(
    'evaluating new elapsingTime:',
    elapasedTime,
    'nowDtStr: ',
    nowDtStr.value,
    'record.started_at: ',
    record?.started_at,
  )
}

if (recording) {
  // track the intervalId...
  intervalId.value = setInterval(updateElapsingTime, 1000)
}
const startRecording = () => {
  console.log('record > project', record?.projects)
  console.log('record > task', record?.tasks)
  emits('@start', record)
}
const stopRecording = () => {
  clearInterval(intervalId.value)
  emits('@stop', record)
}
onBeforeUnmount(() => {
  clearInterval(intervalId.value)
})
</script>
<template v-if="record">
  <div v-if="recording">
    <p>{{ elapsingTime }}</p>
    <Button class="rounded-3xl capitalize" @click="stopRecording"><Square /> stop</Button>
  </div>
  <Button v-else class="rounded-3xl" @click="startRecording"
    ><Play /> {{ calculateElapsedTime(record?.started_at, record?.ended_at) }}</Button
  >
</template>

<style scoped></style>
