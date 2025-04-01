<script setup lang="ts">
import type { SingleRecordWithProjectOrTaskType } from '@/services/supabase-records-queries'
import type { RecordRequestNew } from '@/types/RecordRequestNew'
import { hexToRgb, getContrastColor } from '@/utils/color-helper'

const { record = null, recording = false } = defineProps<{
  record?: SingleRecordWithProjectOrTaskType | RecordRequestNew | null
  recording?: boolean
}>()
const emits = defineEmits<{
  (
    event: '@track-new-record',
    sourceRecord: SingleRecordWithProjectOrTaskType | RecordRequestNew | null,
  ): void
  (event: '@stop-recording'): void
}>()

const textColorOnRecording = computed(() => {
  const contrastColor = getContrastColor(hexToRgb(record?.projects?.hex_color), 4.5)
  console.log('textColorOnRecording', contrastColor)
  return contrastColor
})

const stopRecording = (record: SingleRecordWithProjectOrTaskType | RecordRequestNew | null) => {
  console.log(record)
  emits('@stop-recording')
}
const trackNewRecord = (record: RecordRequestNew) => {
  console.log(record)
  emits('@track-new-record', record)
}

// Handles editing a record
const openRecordEditModal = ref(false)
const editedRecordUid = ref<string | undefined>(undefined)
const editedRecordProjectUid = ref<string | undefined>(undefined)
const editedRecordTaskUid = ref<string | undefined>(undefined)
const prepareEditingRecord = (
  record: SingleRecordWithProjectOrTaskType | RecordRequestNew | null,
) => {
  editedRecordUid.value = ''
  editedRecordProjectUid.value = record?.projects?.project_uid
  editedRecordTaskUid.value = record?.tasks?.task_uid
  openRecordEditModal.value = true
}
</script>
<template>
  <hr />
  <article
    v-if="record"
    class="p-4 -z-10 flex justify-between hover:border-gray-700 border-transparent border-2 rounded-md"
    :style="
      recording ? { backgroundColor: record.projects?.hex_color, color: textColorOnRecording } : {}
    "
  >
    <RecordTileDetails :record @@stop="stopRecording" />
    <RecordTileActions
      :record
      :recording
      @@stop="stopRecording"
      @@start="trackNewRecord"
      @@edit="prepareEditingRecord"
    />
  </article>
  <FormEditRecord v-model="openRecordEditModal" :record />
</template>

<style scoped></style>
