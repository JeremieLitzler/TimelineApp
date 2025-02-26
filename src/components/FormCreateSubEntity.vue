<script setup lang="ts">
import { Form as VeeForm } from 'vee-validate'

import type { FormDataCreateTask } from '@/types/FormDataCreateTask'
import type { FormSelectOption } from '@/types/FormSelectOption'

const { slug } = useRoute('/projects/[slug]').params
const sheetOpen = defineModel<boolean>()
const form = ref<FormDataCreateTask>({
  name: '',
  slug: '',
  uid: '',
})

const selectOptions = ref({
  projects: [] as FormSelectOption[],
  profiles: [] as FormSelectOption[],
})

const authStore = useAuthStore()
const { profile: currentUser } = storeToRefs(authStore)
const entityStore = useProjectsStore()
const { projects, project } = storeToRefs(entityStore)
const profileStore = useProfileStore()
const { profiles } = storeToRefs(profileStore)
const { createTask } = useTaskStore()
const setProjectsOptions = async () => {
  await entityStore.getProjects()
  await entityStore.getProject(slug)
  form.value.uid = project.value?.project_uid.toString() || ''

  if (!projects.value) return

  projects.value.forEach((entityEl) => {
    selectOptions.value.projects.push({
      label: entityEl.name,
      value: entityEl.project_uid,
      selected: entityEl.project_uid == project.value?.project_uid,
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

const submitNewTask = async () => {
  await createTask(form.value)
  const parentSelected =
    projects.value &&
    projects.value.find((element) => element.project_uid.toString() === form.value.uid)
  await entityStore.refreshProject(parentSelected?.slug!)
  sheetOpen.value = false
}
</script>
<template>
  <Sheet v-model:open="sheetOpen">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Let's create a new Sub Project</SheetTitle>
      </SheetHeader>
      <vee-form @submit="submitNewTask">
        <app-form-field
          type="text"
          name="sub_entity_name"
          v-model="form.name"
          label="Name"
          :rules="{ required: true, regex: /^(.){3,255}$/ }"
        />
        <!-- <app-form-field
          class=""
          as="select"
          name="sub_entity_profile_id"
          v-model="form.profile_id"
          label="Assignee"
          placeholder="Select an Assignee"
          rules="required"
        >
          <option value="" disabled>Select a profile</option>
          <option
            v-for="profile in selectOptions.profiles"
            :key="profile.value"
            :value="profile.value"
          >
            {{ profile.label }}
          </option></app-form-field
        > -->
        <app-form-field
          as="select"
          name="sub_entity_uid"
          v-model="form.uid"
          label="Project"
          placeholder="Select an Project"
          rules="required"
        >
          <option value="" disabled>Select an entity</option>
          <option
            v-for="entityEl in selectOptions.projects"
            :key="entityEl.value.toString()"
            :value="entityEl.value.toString()"
            :selected="entityEl.selected"
          >
            {{ entityEl.label }}
          </option>
        </app-form-field>
        <button type="submit" class="btn btn-primary">Create</button>
      </vee-form>
    </SheetContent>
  </Sheet>
</template>

<style scoped></style>
