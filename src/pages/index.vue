<script setup lang="ts">
import type { SingleRecordWithProjectOrTaskType } from '@/services/supabase-records-queries'
import { useRecordStore } from '@/stores/record'

usePageStore().pageData.title = 'Timeline'

const recordStore = useRecordStore()
const { records } = storeToRefs(recordStore)

await recordStore.getRecords()

const recordBeingTracked = ref(false)
const currentTrackedRecord = ref<SingleRecordWithProjectOrTaskType | null>(null)
</script>
<template>
  <section>
    <template v-if="recordBeingTracked">
      <h2>Tracking</h2>
      <RecordTile :record="currentTrackedRecord"> </RecordTile>
    </template>
  </section>
  <section>
    <!-- List grouped by date from here -->
    <h2>Today</h2>
    <RecordTile v-for="record in records" :key="record.record_uid" :record> </RecordTile>
  </section>
</template>

<style scoped>
h2 {
  @apply text-2xl font-extrabold mb-4;
}
</style>
