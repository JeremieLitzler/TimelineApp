<script setup lang="ts">
import type { SingleRecordWithProjectOrTaskType } from '@/services/supabase-records-queries'
import type { Record } from '@/types/Record'
import type { RecordRequestNew } from '@/types/RecordRequestNew'

const {
  record = null,
  newRecord = null,
  recording = false,
} = defineProps<{
  record?: SingleRecordWithProjectOrTaskType | Record | null
  newRecord?: RecordRequestNew | null | undefined
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
const trackNewRecord = (record: RecordRequestNew) => {
  console.log(record)
  emits('@track-new-record', record)
}
</script>
<template>
  <hr />
  <article v-if="record || newRecord" class="mb-4 mt-4 flex justify-between">
    <template v-if="record">
      <RecordTileDetails :record @@stop="stopRecording" />
    </template>
    <template v-else>
      <RecordTileDetails :record="newRecord" @@stop="stopRecording" />
    </template>
    <RecordTileActions
      :record
      :new-record
      :recording
      @@stop="stopRecording"
      @@start="trackNewRecord"
    />
  </article>
</template>

<style scoped></style>
