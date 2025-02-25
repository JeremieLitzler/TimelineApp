<script setup lang="ts">
import { slugify } from '@/utils/slugify'
import { Form as VeeForm } from 'vee-validate'

import type { FormDataCreateProject } from '@/types/FormDataCreateProject'

const sheetOpen = defineModel<boolean>()
const form = ref<FormDataCreateProject>({
  project_name: '',
  project_slug: '',
  project_hex_color: '',
})

const authStore = useAuthStore()
const { profile: currentUser } = storeToRefs(authStore)
const { createProject } = useProjectsStore()

// Fill in the slug as the name is typed
// TODO : make reusable functionnality between project and task
let userEditedSlug = ref(false)
const updateSlug = () => {
  if (!form.value?.project_name) return
  if (!userEditedSlug.value) {
    form.value.project_slug = slugify(form.value.project_name)
  }
}
const enterSlugEditing = () => (userEditedSlug.value = true)
const exitSlugEditing = () => {
  const computedSlug = slugify(form.value.project_name)
  if (form.value.project_slug === '') {
    userEditedSlug.value = false
  } else if (form.value.project_slug !== computedSlug) {
    // since the slug is different from the computed slug from name
    // the auto computation of the slug is disabled
    userEditedSlug.value = true
    return
  } else {
    // since the slug is the same from the computed slug from name
    // the auto computation of the slug is enabled
    userEditedSlug.value = false
    return
  }
}
// Handle new Project creation
const submitNewProject = async () => {
  await createProject(form.value)
  sheetOpen.value = false
}
</script>
<template>
  <Sheet v-model:open="sheetOpen">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Let's create a new Project</SheetTitle>
      </SheetHeader>
      <vee-form @submit="submitNewProject">
        <app-form-field
          type="text"
          name="entity_name"
          v-model="form.project_name"
          label="Name"
          :rules="{ required: true, regex: /^(.){3,60}$/ }"
          @input="updateSlug"
        />
        <app-form-field
          type="text"
          name="project_slug"
          v-model="form.project_slug"
          label="Slug"
          :rules="{ required: true, regex: /^([a-z0-9-]){3,60}$/ }"
          @focusin="enterSlugEditing"
          @blur="exitSlugEditing"
        />
        <!-- TODO: finish color input -->
        <app-form-field
          type="color"
          name="project_hex_color"
          v-model="form.project_hex_color"
          label="Color"
          :rules="{ required: true, regex: /^(.){3,60}$/ }"
        />
        <button type="submit" class="btn btn-primary">Create</button>
      </vee-form>
    </SheetContent>
  </Sheet>
</template>

<style scoped></style>
