<script setup lang="ts">
import type { SingleRecordWithProjectOrTaskType } from '@/services/supabase-records-queries'
import type { Record } from '@/types/Record'
import type { RecordRequestNew } from '@/types/RecordRequestNew'
import { formatDateToStr, toISOStringWithTimezone } from '@/utils/date-format'
import { calculateElapsedTime } from '@/utils/time-calculator'

const {
  record = null,
  newRecord = null,
  recording = false,
} = defineProps<{
  record?: SingleRecordWithProjectOrTaskType | Record | null
  newRecord: RecordRequestNew | null | undefined
  recording?: boolean
}>()

const emits = defineEmits<{
  (event: '@stop', record: SingleRecordWithProjectOrTaskType | Record | null): void
  (event: '@start', record: RecordRequestNew): void
}>()

let intervalId = ref<number | NodeJS.Timeout>(0)
const elapsingTime = ref<string>('00:00:00')
const updateElapsingTime = () => {
  const now = new Date(Date.now())
  const nowDtStr: string | undefined = formatDateToStr(now, 'YYYY-MM-DDTHH:mm:ss.SSS').value
  console.log(
    'evaluating new elapsingTime with:',
    'nowDtStr: ',
    nowDtStr,
    'record.started_at: ',
    newRecord?.started_at,
  )
  const elapasedTime = calculateElapsedTime(newRecord?.started_at, nowDtStr)
  console.log('elapasedTime', elapasedTime)

  elapsingTime.value = elapasedTime ?? elapsingTime.value
}

if (recording) {
  // track the intervalId...
  console.log('start setInterval')

  intervalId.value = setInterval(updateElapsingTime, 1000)
}
const startingNewRecord = ref(false)
const recordStore = useRecordStore()
const startRecording = async () => {
  startingNewRecord.value = true
  const newRecord: RecordRequestNew = {
    started_at: toISOStringWithTimezone(new Date()),
    projects: record?.projects,
    tasks: record?.tasks,
  }
  startingNewRecord.value = false
  emits('@start', newRecord)
}

const stopRecording = async () => {
  // console.log('stopRecording for', record)
  newRecord!.ended_at = toISOStringWithTimezone(new Date())
  await recordStore.addRecord(newRecord!)
  // console.log('updatedRecord', updatedRecord)
  clearInterval(intervalId.value)
  emits('@stop', record)
}
onBeforeUnmount(() => {
  clearInterval(intervalId.value)
})
</script>
<template>
  <template v-if="newRecord">
    <div v-if="recording">
      <p class="text-2xl mb-2">{{ elapsingTime }}</p>
      <Button class="rounded-3xl capitalize" @click="stopRecording"><Square /> stop</Button>
    </div>
  </template>
  <template v-else-if="record">
    <Button class="rounded-3xl" @click="startRecording"
      ><Play /> {{ calculateElapsedTime(record?.started_at, record?.ended_at) }}</Button
    >
  </template>
</template>

<style scoped></style>
