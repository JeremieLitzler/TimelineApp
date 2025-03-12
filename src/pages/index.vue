<script setup lang="ts">
import { useRecordStore } from '@/stores/record'

usePageStore().pageData.title = 'Timeline'

const recordStore = useRecordStore()
const { records } = storeToRefs(recordStore)

await recordStore.getRecords()

const updateTask = () => console.log('updateTask to code...')
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
    <article v-for="record in records" :key="record.record_uid">
      <!-- Record component -->
      <p>{{ record.projects?.hex_color }}</p>
      <p>{{ record.projects?.name }}</p>
      <p>{{ record.projects?.slug }}</p>
      <p>{{ record.tasks?.name }}</p>
      <template v-if="record.tasks">
        <AppInputLiveEditStatus v-model="record.tasks.completed" @@commit="updateTask" />
      </template>
      <p>{{ record.started_at }} > {{ record.ended_at }}</p>
    </article>
  </section>
</template>

<style scoped></style>
