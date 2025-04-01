<script setup lang="ts">
import type { SingleRecordWithProjectOrTaskType } from '@/services/supabase-records-queries'
import type { RecordRequestNew } from '@/types/RecordRequestNew'

usePageStore().pageData.title = 'Timeline'

const recordStore = useRecordStore()
const { records } = storeToRefs(recordStore)

await recordStore.getRecords()

const recordBeingTracked = ref(false)
const newRecord = ref<RecordRequestNew | null>(null)
const trackNewRecord = (record: RecordRequestNew) => {
  if (record) {
    newRecord.value = record
    recordBeingTracked.value = !recordBeingTracked.value
  }
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
