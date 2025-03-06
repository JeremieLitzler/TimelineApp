<script setup lang="ts">
import { Form as VeeForm } from 'vee-validate'

import type { FormDataCreateTask } from '@/types/FormDataCreateTask'
import type { FormSelectOption } from '@/types/FormSelectOption'

const { slug: projectSlug } = useRoute('/projects/[slug]').params
const sheetOpen = defineModel<boolean>()
const initialForm = {
  name: '',
  slug: '',
  project_uid: '',
}
const form = ref<FormDataCreateTask>(initialForm)

const selectOptions = ref({
  projects: [] as FormSelectOption[],
  profiles: [] as FormSelectOption[],
})

const authStore = useAuthStore()
const { profile: currentUser } = storeToRefs(authStore)
const projectStore = useProjectsStore()
const { projects, project } = storeToRefs(projectStore)
const profileStore = useProfileStore()
const { profiles } = storeToRefs(profileStore)
const { createTask } = useTaskStore()
const setProjectsOptions = async () => {
  await projectStore.getProjects()
  await projectStore.getProject(projectSlug)
  form.value.project_uid = project.value?.project_uid.toString() || ''

  if (!projects.value) return

  projects.value.forEach((projectEl) => {
    selectOptions.value.projects.push({
      label: projectEl.name,
      value: projectEl.project_uid,
      selected: projectEl.project_uid == project.value?.project_uid,
    })
  })
}

const setProfilesOptions = async () => {
  await profileStore.getProfiles()

  if (!profiles.value) return

  profiles.value.forEach((profile) => {
    selectOptions.value.profiles.push({ label: profile.full_name, value: profile.id })
  })
}

await Promise.all([setProjectsOptions(), setProfilesOptions()])

// Fill in the slug as the name is typed
const { slug: slugTask, enterSlugEditing, exitSlugEditing, updateSlug } = useSlug(form)
watch(
  () => slugTask.value,
  () => {
    form.value.slug = slugTask.value
  },
)

const submitNewTask = async () => {
  await createTask(form.value)
  const parentSelected =
    projects.value &&
    projects.value.find((element) => element.project_uid.toString() === form.value.project_uid)
  await projectStore.refreshProject(parentSelected?.slug!)
  sheetOpen.value = false
}
</script>
<template>
  <Sheet v-model:open="sheetOpen">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Let's create a new task</SheetTitle>
      </SheetHeader>
      <vee-form @submit="submitNewTask">
        <app-form-field
          type="text"
          name="name"
          v-model="form.name"
          label="Name"
          :rules="{ required: true, regex: /^(.){3,255}$/ }"
          @input="updateSlug"
        />
        <app-form-field
          type="text"
          name="slug"
          v-model="form.slug"
          label="Slug"
          :rules="{ required: true, regex: /^([a-z0-9-]){3,60}$/ }"
          @focusin="enterSlugEditing"
          @blur="exitSlugEditing"
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
        <button type="submit" class="btn btn-primary">Create</button>
      </vee-form>
    </SheetContent>
  </Sheet>
</template>

<style scoped></style>
