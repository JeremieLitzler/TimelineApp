<script setup lang="ts">
import type { SingleRecordWithProjectOrTaskType } from '@/services/supabase-records-queries'
import type { Record } from '@/types/Record'

const { record = null, recording = false } = defineProps<{
  record: SingleRecordWithProjectOrTaskType | Record | null
  recording?: boolean
}>()
const emits = defineEmits<{
  (
    event: '@track-new-record',
    sourceRecord: SingleRecordWithProjectOrTaskType | Record | null,
  ): void
  (event: '@stop-recording'): void
}>()

const stopRecording = (record: SingleRecordWithProjectOrTaskType | Record | null) => {
  console.log(record)
  emits('@stop-recording')
}
const trackNewRecord = (record: SingleRecordWithProjectOrTaskType | Record | null) => {
  console.log(record)
  emits('@track-new-record', record)
}
</script>
<template>
  <hr />
  <article v-if="record" class="mb-4 mt-4 flex justify-between">
    <RecordTileDetails :record @@stop="stopRecording" />
    <RecordTileActions :record :recording @@stop="stopRecording" @@start="trackNewRecord" />
  </article>
</template>

<style scoped></style>
