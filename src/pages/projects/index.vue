<template>
  <div class="flex flex-col">
    <Button @click="openModal = !openModal" class="mb-4 self-end">+ Add</Button>
    <FormCreateProject v-model="openModal" />
    <DataTable v-if="projects" :columns :data="projects" />
  </div>
</template>

<script setup lang="ts">
usePageStore().pageData.title = 'Projects'

import { columns } from '@/utils/datatable-columns-entity'

const entityStore = useProjectsStore()
const { projects } = storeToRefs(entityStore)
// `projects` is reactive from the store.
// as soon as the `getProjects` is called and done,
// the projects are loaded
await entityStore.getProjects()

// Add new sub entity logic
const openModal = ref(false)
</script>

<style scoped></style>
