<script setup lang="ts">
import { useElapsedTime } from '@/composables/timeElapsed'
import { DateFormatPresets } from '@/enums/DateFormatPresets'
import type { SingleRecordWithProjectOrTaskType } from '@/services/supabase-records-queries'
import type { Record } from '@/types/Record'
import type { RecordRequestNew } from '@/types/RecordRequestNew'
import { formatDateToStr, toISOStringWithTimezone } from '@/utils/date-format'
import { calculateElapsedTime } from '@/utils/time-calculator'

const { record = null, recording = false } = defineProps<{
  record?: SingleRecordWithProjectOrTaskType | RecordRequestNew | null
  recording?: boolean
}>()

const emits = defineEmits<{
  (event: '@stop', record: SingleRecordWithProjectOrTaskType | RecordRequestNew | null): void
  (event: '@start', record: SingleRecordWithProjectOrTaskType | RecordRequestNew | null): void
  (event: '@edit', record: SingleRecordWithProjectOrTaskType | RecordRequestNew | null): void
}>()

let intervalId = ref<number | NodeJS.Timeout>(0)
const { evaluate } = useElapsedTime()
const elapsingTime = ref<string | null | undefined>('00:00:00')
const updateElapsingTime = () => {
  const now = new Date(Date.now())
  const nowDtStr: string | undefined = formatDateToStr(
    now,
    DateFormatPresets.InputDateTimeLocalFull,
  ).value
  const elapasedTime = evaluate(record?.started_at, nowDtStr)
  elapsingTime.value = elapasedTime.value
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
  record!.ended_at = toISOStringWithTimezone(new Date())
  await recordStore.addRecord(record as RecordRequestNew)
  // console.log('updatedRecord', updatedRecord)
  clearInterval(intervalId.value)
  emits('@stop', record)
}
onBeforeUnmount(() => {
  clearInterval(intervalId.value)
})
</script>
<template>
  <div class="flex items-end">
    <Button class="rounded-3xl mr-4" @click="$emit('@edit', record)">
      <PencilLine />
    </Button>
    <div v-if="recording">
      <p class="text-2xl mb-2">{{ elapsingTime }}</p>
      <Button class="rounded-3xl capitalize z-50" @click="stopRecording"><Square /> stop</Button>
    </div>
    <Button v-else class="rounded-3xl z-50" @click="startRecording"
      ><Play /> {{ calculateElapsedTime(record?.started_at, record?.ended_at) }}</Button
    >
  </div>
</template>

<style scoped></style>
