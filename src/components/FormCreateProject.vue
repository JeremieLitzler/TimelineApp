<script setup lang="ts">
import { slugify } from '@/utils/slugify'
import { Form as VeeForm } from 'vee-validate'

import type { FormDataCreateProject } from '@/types/FormDataCreateProject'

const sheetOpen = defineModel<boolean>()
const initialForm = {
  name: '',
  slug: '',
  hex_color: '#1d4ed8',
}
const form = ref<FormDataCreateProject>({ ...initialForm })

const authStore = useAuthStore()
const { profile: currentUser } = storeToRefs(authStore)
const { createProject } = useProjectsStore()

// Fill in the slug as the name is typed
// TODO : make reusable functionnality between project and task
let userEditedSlug = ref(false)
const updateSlug = () => {
  if (!form.value?.name) return
  if (!userEditedSlug.value) {
    form.value.slug = slugify(form.value.name)
  }
}
const enterSlugEditing = () => (userEditedSlug.value = true)
const exitSlugEditing = () => {
  const computedSlug = slugify(form.value.name)
  if (form.value.slug === '') {
    userEditedSlug.value = false
  } else if (form.value.slug !== computedSlug) {
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
  await createProject({ ...form.value })
  sheetOpen.value = false
  form.value = initialForm
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
          name="name"
          v-model="form.name"
          label="Name"
          :rules="{ required: true, regex: /^(.){3,60}$/ }"
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
        <!-- TODO: finish color input -->
        <app-form-field as="color" label="Color" name="hex_color" v-model="form.hex_color">
          <AppInputLiveEditColor
            v-model="form.hex_color"
            :show-icon="false"
            placeholder="Change your color by click the circle ⏩"
          />
        </app-form-field>
        <button type="submit" class="btn btn-primary">Create</button>
      </vee-form>
    </SheetContent>
  </Sheet>
</template>

<style scoped></style>
