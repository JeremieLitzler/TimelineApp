<script setup lang="ts">
import { useRecordStore } from '@/stores/record'

usePageStore().pageData.title = 'Timeline'

const recordStore = useRecordStore()
const { records } = storeToRefs(recordStore)

await recordStore.getRecords()
</script>
<template>
  <section>
    <h2>Tracking</h2>
    <article>
      <!-- The currently tracked record -->
      <!-- Record component -->
      <p>Project color dot</p>
      <p>Project name</p>
      <p>Task completed indicator</p>
      <p>Task name</p>
      <p>Elapsed time</p>
      <button>STOP</button>
    </article>
  </section>
  <section>
    <!-- List grouped by date from here -->
    <h2>Today</h2>
    <AppRecordTile v-for="record in records" :key="record.record_uid" :record> </AppRecordTile>
  </section>
</template>

<style scoped></style>
