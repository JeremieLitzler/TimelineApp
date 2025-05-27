<script setup lang="ts">
import type {
  AllRecordsWithProjectOrTaskType,
  TimeRecordWithProjectOrTaskType,
} from '@/services/supabase-records-queries'
import type { TimeRecordRequestNew } from '@/types/TimeRecordRequestNew'

usePageStore().pageData.title = 'Timeline'

const recordStore = useRecordStore()
const { records } = storeToRefs(recordStore)

await recordStore.getRecords()

const recordBeingTracked = ref(false)
const newRecord = ref<TimeRecordRequestNew | null>(null)
const trackNewRecord = (record: TimeRecordRequestNew) => {
  if (record) {
    newRecord.value = record
    recordBeingTracked.value = !recordBeingTracked.value
  }
}

const handleRecordDeleted = (record: TimeRecordWithProjectOrTaskType) => {
  const deletedRecordIndex = records.value?.findIndex((r) => r.record_uid === record.record_uid)
  if (deletedRecordIndex !== -1) {
    records.value?.splice(deletedRecordIndex!, 1)
  }
  // recordStore.getRecords()
}
const handleRecordUpdated = (record: TimeRecordWithProjectOrTaskType | TimeRecordRequestNew) => {
  recordStore.getRecords()
}

const handleStopRecording = async () => {
  console.log('Timeline page>handleStopRecording called...')

  recordBeingTracked.value = false
  await recordStore.getRecords()
}
</script>
<template>
  <section>
    <template v-if="recordBeingTracked">
      <h2>Tracking</h2>
      <RecordTile
        :key="`${newRecord?.projects?.project_uid}-${newRecord?.tasks?.task_uid}-${newRecord?.started_at}`"
        :record="newRecord"
        :recording="recordBeingTracked"
        @@stop-recording="recordBeingTracked = false"
      />
    </template>
  </section>
  <section>
    <!-- List grouped by date from here -->
    <h2>Today</h2>
    <RecordTile
      v-for="record in records"
      :record
      @@track-new-record="trackNewRecord"
      @@stop-recording="handleStopRecording"
      @@record-deleted="handleRecordDeleted(record)"
      @@record-updated="handleRecordUpdated"
    >
    </RecordTile>
  </section>
</template>

<style scoped>
h2 {
  @apply text-2xl font-extrabold mb-4;
}
</style>
