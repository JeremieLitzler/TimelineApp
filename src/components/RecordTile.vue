<script setup lang="ts">
import type { TimeRecordWithProjectOrTaskType } from '@/services/supabase-records-queries'
import type { TimeRecordRequestNew } from '@/types/TimeRecordRequestNew'
import { hexToRgb, getContrastColor } from '@/utils/color-helper'

const { record = null, recording = false } = defineProps<{
  record?: TimeRecordWithProjectOrTaskType | TimeRecordRequestNew | null
  recording?: boolean
}>()
const emits = defineEmits<{
  (
    event: '@track-new-record',
    sourceRecord: TimeRecordWithProjectOrTaskType | TimeRecordRequestNew | null,
  ): void
  (event: '@stop-recording'): void
  (event: '@record-deleted'): void
  (event: '@record-updated', record: TimeRecordWithProjectOrTaskType | TimeRecordRequestNew): void
}>()

/**
 * Lazy load the modal since it is on all record tiles...
 */
const FormDataEditRecordLazy = defineAsyncComponent(() => import('@/components/FormEditRecord.vue'))

const textColorOnRecording = computed(() => {
  const contrastColor = getContrastColor(hexToRgb(record?.projects?.hex_color), 4.5)
  console.log('textColorOnRecording', contrastColor)
  return contrastColor
})

const stopRecording = (record: TimeRecordWithProjectOrTaskType | TimeRecordRequestNew | null) => {
  console.log('RecordTile>stopRecording', record)
  emits('@stop-recording')
}
const trackNewRecord = (record: TimeRecordRequestNew) => {
  console.log(record)
  emits('@track-new-record', record)
}

// Handles editing a record
const openRecordEditModal = ref(false)
const editedRecordUid = ref<string | undefined>(undefined)
const editedRecordProjectUid = ref<string | undefined>(undefined)
const editedRecordTaskUid = ref<string | undefined>(undefined)
const prepareEditingRecord = (
  record: TimeRecordWithProjectOrTaskType | TimeRecordRequestNew | null,
) => {
  editedRecordUid.value = ''
  editedRecordProjectUid.value = record?.projects?.project_uid
  editedRecordTaskUid.value = record?.tasks?.task_uid
  openRecordEditModal.value = true
}

// Handle record deletion
const handleRecordDeleted = () => {
  console.log('Record deleted, emitting to parent')
  emits('@record-deleted')
}
const handleRecordUpdated = (record: TimeRecordWithProjectOrTaskType | TimeRecordRequestNew) => {
  console.log('Record updated, emitting to parent')
  emits('@record-updated', record)
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
  <FormDataEditRecordLazy
    v-model="openRecordEditModal"
    :record
    @@deleted="handleRecordDeleted"
    @@updated="handleRecordUpdated"
  />
</template>

<style scoped></style>
