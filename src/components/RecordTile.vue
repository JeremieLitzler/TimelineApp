<script setup lang="ts">
import type { SingleRecordWithProjectOrTaskType } from '@/services/supabase-records-queries'

const { record = null } = defineProps<{
  record: SingleRecordWithProjectOrTaskType | null
}>()
const recording = ref(false)
const stopRecording = (record: SingleRecordWithProjectOrTaskType | null) => {
  recording.value = false
  console.log(record)
}
const trackNewRecord = (record: SingleRecordWithProjectOrTaskType | null) => {
  recording.value = true
  console.log(record)
}
</script>
<template>
  <hr />
  <article v-if="record" class="mb-4 mt-4 flex justify-between">
    <RecordTileDetails :record @@stop="stopRecording" />
    <RecordTileActions :record :recording @@stop="stopRecording" @@start="trackNewRecord" />
  </article>
</template>

<style scoped></style>
