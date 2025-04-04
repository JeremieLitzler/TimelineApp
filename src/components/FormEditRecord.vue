<script setup lang="ts">
import { Form as VeeForm } from 'vee-validate'

import type { SingleRecordWithProjectOrTaskType } from '@/services/supabase-records-queries'
import type { FormDataEditRecord } from '@/types/FormDataEditRecord'
import type { FormSelectOption } from '@/types/FormSelectOption'
import type { RecordRequestNew } from '@/types/RecordRequestNew'
import { formatDateStr } from '@/utils/date-format'
import { DateFormatPresets } from '@/enums/DateFormatPresets'
import { useElapsedTime } from '@/composables/timeElapsed'

const { record = null } = defineProps<{
  record: SingleRecordWithProjectOrTaskType | RecordRequestNew | null
}>()
const sheetOpen = defineModel<boolean>()
const initialForm = {
  started_at:
    formatDateStr(record?.started_at, DateFormatPresets.InputDateTimeLocalFull).value ??
    new Date(Date.now()),
  ended_at: formatDateStr(record?.ended_at, DateFormatPresets.InputDateTimeLocalFull).value ?? '',
  record_uid: record?.record_uid,
  project_uid: record?.projects?.project_uid,
  task_uid: record?.tasks?.task_uid,
}
const form = ref<FormDataEditRecord>(initialForm)

const { evaluate } = useElapsedTime()
const recordTimeElapsed = computed(() => evaluate(form.value.started_at, form.value.ended_at))

const selectOptions = ref({
  projects: [] as FormSelectOption[],
  tasks: [] as FormSelectOption[],
})

const recordStore = useRecordStore()
const projectStore = useProjectsStore()
const { projects } = storeToRefs(projectStore)
const taskStore = useTaskStore()
const { tasksByProject } = storeToRefs(taskStore)
const setProjectsOptions = async () => {
  await projectStore.getProjects()
  if (!projects.value) return

  projects.value.forEach((projectEl) => {
    selectOptions.value.projects.push({
      label: projectEl.name,
      value: projectEl.project_uid,
      selected: projectEl.project_uid == form.value.project_uid,
    })
  })
}
const setTasksOptions = async () => {
  if (form.value.project_uid === undefined) {
    return
  }
  console.log('getting tasks for', form.value.project_uid)

  await taskStore.getTasksByProject(form.value.project_uid)
  if (!tasksByProject.value) return

  tasksByProject.value.forEach((taskEl) => {
    selectOptions.value.tasks.push({
      label: taskEl.name,
      value: taskEl.task_uid,
      selected: taskEl.task_uid == form.value.task_uid,
    })
  })
}

await Promise.all([setProjectsOptions(), setTasksOptions()])

onUnmounted(() => {
  console.log('Called onUnmounted')

  form.value = initialForm
})

const refreshTaskSelect = async () => {
  console.log('refreshTaskSelect...')
  selectOptions.value.tasks = []
  await setTasksOptions()
}

const submitRecordChanges = async () => {
  if (form.value.record_uid) {
    console.log('existing record => save it')
    await recordStore.updateRecord(form.value)
  } else {
    console.info('Record is not yet in the database...')
  }
  sheetOpen.value = false
}

const deleteRecord = async () => {
  if (form.value.record_uid) {
    console.log('existing record => delete it')
    await recordStore.deleteRecord(form.value)
  }
  sheetOpen.value = false
}
</script>
<template>
  <Sheet v-model:open="sheetOpen">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Record</SheetTitle>
      </SheetHeader>
      <p class="text-2xl text-center font-bold mt-8">{{ recordTimeElapsed }}</p>
      <vee-form @submit="submitRecordChanges">
        <app-form-field
          type="datetime-local"
          name="started_at"
          v-model="form.started_at"
          label="Start"
          :rules="{ required: true }"
        />
        <app-form-field
          type="datetime-local"
          name="ended_at"
          v-model="form.ended_at"
          label="End"
          :rules="{ required: true }"
        />
        <app-form-field
          as="select"
          name="project_uid"
          v-model="form.project_uid"
          label="Project"
          placeholder="Select an Project"
          rules="required"
          @change="refreshTaskSelect"
        >
          <option value="" disabled>Select a project</option>
          <option
            v-for="projectEl in selectOptions.projects"
            :key="projectEl.value.toString()"
            :value="projectEl.value.toString()"
            :selected="projectEl.selected"
          >
            {{ projectEl.label }}
          </option>
        </app-form-field>
        <app-form-field
          as="select"
          name="task_uid"
          v-model="form.task_uid"
          label="task"
          placeholder="Select an task"
        >
          <option value="" disabled>Select a task</option>
          <option
            v-for="taskEl in selectOptions.tasks"
            :key="taskEl.value.toString()"
            :value="taskEl.value.toString()"
            :selected="taskEl.selected"
          >
            {{ taskEl.label }}
          </option>
        </app-form-field>
        <button type="submit" class="btn btn-primary">Save</button>
      </vee-form>
      <button v-if="record?.record_uid" class="btn btn-danger" @click="deleteRecord">Delete</button>
    </SheetContent>
  </Sheet>
</template>

<style scoped></style>
