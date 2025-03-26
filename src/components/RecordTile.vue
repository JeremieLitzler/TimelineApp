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
    v-if="record || newRecord"
    class="pb-4 pt-4 flex justify-between hover:border-gray-700 border-transparent border-2"
    @click="prepareEditingRecord(newRecord)"
  >
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
  <FormEditRecord
    v-model="openRecordEditModal"
    :record_uid="editedRecordUid"
    :project_uid="editedRecordProjectUid"
    :task_uid="editedRecordTaskUid"
  />
</template>

<style scoped></style>
