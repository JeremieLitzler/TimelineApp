<script setup lang="ts">
import type { SingleRecordWithProjectOrTaskType } from '@/services/supabase-records-queries'
import { useRecordStore } from '@/stores/record'
import { Record } from '@/types/Record'
import { dateToSupabaseDateString } from '@/utils/date-format'

usePageStore().pageData.title = 'Timeline'

const recordStore = useRecordStore()
const { records } = storeToRefs(recordStore)

await recordStore.getRecords()

const recordBeingTracked = ref(false)
const currentTrackedRecord = ref<Record>(new Record())
const trackNewRecord = (record: SingleRecordWithProjectOrTaskType | Record | null) => {
  if (record) {
    const { projects, tasks, ...RecordProps } = record
    currentTrackedRecord.value.started_at = dateToSupabaseDateString(new Date(Date.now())).value
    currentTrackedRecord.value.projects = projects
    currentTrackedRecord.value.tasks = tasks
    recordBeingTracked.value = !recordBeingTracked.value
  }
}
</script>
<template>
  <section>
    <template v-if="recordBeingTracked">
      <h2>Tracking</h2>
      <RecordTile
        :record="currentTrackedRecord"
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
      :key="record.record_uid"
      :record
      @@track-new-record="trackNewRecord"
      @@stop-recording="recordBeingTracked = false"
    >
    </RecordTile>
  </section>
</template>

<style scoped>
h2 {
  @apply text-2xl font-extrabold mb-4;
}
</style>
