<script setup lang="ts">
import { Form as VeeForm } from 'vee-validate'

import type { SingleRecordWithProjectOrTaskType } from '@/services/supabase-records-queries'
import type { FormDataEditRecord } from '@/types/FormDataEditRecord'
import type { FormSelectOption } from '@/types/FormSelectOption'
import type { RecordRequestNew } from '@/types/RecordRequestNew'
import { formatDateStr } from '@/utils/date-format'

const { record = null } = defineProps<{
  record: SingleRecordWithProjectOrTaskType | RecordRequestNew | null
}>()
const sheetOpen = defineModel<boolean>()
const initialForm = {
  started_at: formatDateStr(record?.started_at, 'yyyy-MM-dd').value ?? new Date(Date.now()),
  ended_at: formatDateStr(record?.ended_at, 'yyyy-MM-dd').value ?? '',
  project_uid: record?.projects?.project_uid,
  task_uid: record?.tasks?.task_uid,
}
const form = ref<FormDataEditRecord>(initialForm)

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

const submitRecordChanges = async () => {
  if (form.value.record_uid) {
    // existing record => save it
    await recordStore.updateRecord(form.value)
  } else {
    // unsaved record => update state
    // recordStore.updateUnsavedRecord(form.value)
  }
  // const parentSelected =
  //   projects.value &&
  //   projects.value.find((element) => element.project_uid.toString() === form.value.project_uid)
  // await projectStore.refreshProject(parentSelected?.slug!)
  sheetOpen.value = false
}
</script>
<template>
  <Sheet v-model:open="sheetOpen">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Record</SheetTitle>
      </SheetHeader>
      <p>00:00:00</p>
      <vee-form @submit="submitRecordChanges">
        <app-form-field
          type="date"
          name="started_at"
          v-model="form.started_at"
          label="Start"
          :rules="{ required: true }"
        />
        <app-form-field
          type="date"
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
    </SheetContent>
  </Sheet>
</template>

<style scoped></style>
