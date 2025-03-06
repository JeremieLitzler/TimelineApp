<script setup lang="ts">
import { formatDateStrToUserFriendly } from '@/utils/date-format'

const router = useRouter()
const { task_uid } = useRoute('/tasks/[task_uid]').params
const store = useTaskStore()
const entityStore = useProjectsStore()

const { taskWithProject } = storeToRefs(store)

watch(
  () => taskWithProject.value?.name,
  () => {
    console.log('watch sub-entity', taskWithProject.value)

    usePageStore().pageData.title = `Sub-Project: ${taskWithProject.value?.name || 'Not Sub-Project found'}`
  },
)

await store.getTask(task_uid)
// Update logic
const updateTask = () => {
  console.log('updateTask triggered', taskWithProject.value)

  store.updateTask()
}

// Delete Logic
const deleting = ref(false)
const softDeleteTask = async () => {
  const parentSlug = taskWithProject.value?.projects?.slug
  deleting.value = true
  console.log('deleteTask>deleting...')
  await store.softDeleteTask()
  console.log('deleteTask>deleted!')
  await entityStore.refreshProject(parentSlug!)
  router.push(`/projects/${parentSlug}`)
}
</script>

<template>
  <div class="lg:container flex flex-col justify-center items-center">
    <Button variant="destructive" class="self-end mt-4 w-full max-w-20" @click="softDeleteTask">
      <span v-if="deleting" class="mr-0 animate-spin">
        <LoaderCircle />
      </span>
      <span v-else class="text-white mr-0">
        <Trash2 />
      </span>
      Delete</Button
    >
    <section class="mt-4 border rounded-lg w-full">
      <Table v-if="taskWithProject">
        <TableRow>
          <TableHead> Name </TableHead>
          <TableCell>
            <AppInputLiveEditText
              type="text"
              v-model="taskWithProject.name"
              @@commit="updateTask"
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead> Slug </TableHead>
          <TableCell>
            {{ taskWithProject.slug }}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead> Completed? </TableHead>
          <TableCell title="Click the icon to toggle the value">
            <AppInputLiveEditStatus v-model="taskWithProject.completed" @@commit="updateTask" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead> Completed On </TableHead>
          <TableCell>
            {{ formatDateStrToUserFriendly(taskWithProject.completed_at) }}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead> Project </TableHead>
          <TableCell>
            <RouterLink
              class="underline hover:bg-muted block w-full font-medium"
              :to="`/projects/${taskWithProject.projects?.slug}`"
              >{{ taskWithProject.projects?.name }}</RouterLink
            >
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead> Created On </TableHead>
          <TableCell>
            {{ formatDateStrToUserFriendly(taskWithProject.created_at) }}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead> Last Updated On </TableHead>
          <TableCell>
            {{ formatDateStrToUserFriendly(taskWithProject.updated_at) }}
          </TableCell>
        </TableRow>
      </Table>
    </section>
  </div>
</template>

<style scoped>
th {
  @apply w-[100px];
}

h2 {
  @apply mb-4 text-lg font-semibold w-fit;
}

.table-container {
  @apply overflow-hidden overflow-y-auto rounded-md h-80;
}
</style>
