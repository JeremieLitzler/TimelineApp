<script setup lang="ts">
import { RouterPathEnum } from '@/types/RouterPathEnum'
import { formatDateStrToUserFriendly } from '@/utils/date-format'

/**
 * TODO: Passing the route path to useRoute solve the TypeScript error on accessing `slug` param
 */
const router = useRouter()
const { slug } = useRoute('/projects/[slug]').params
const store = useProjectsStore()
const { project } = storeToRefs(store)

// TODO > make sure to place the watch before the async method that load the data!
// Otherwise, the watcher never gets called
watch(
  () => project.value?.project_name,
  () => {
    console.log('watch project', project.value)

    usePageStore().pageData.title = `Project: ${project.value?.project_name || 'Not entity found'}`
  },
)

await store.getProject(slug)

const noTasks = computed(() => project.value?.tasks?.length === 0)
// Update logic
const updateProject = () => {
  store.updateProject()
}

// Delete Logic
const deleting = ref(false)
const deleteProject = async () => {
  deleting.value = true
  console.log('deleteProject>deleting...')
  await store.deleteProject()
  console.log('deleteProject>deleted!')
  router.push('/projects')
}

// Add new sub entity logic
const openModal = ref(false)
</script>

<template>
  <div class="lg:container flex flex-col justify-center items-center">
    <FormCreateTask v-model="openModal" />
    <Button variant="destructive" class="self-end mt-4 w-full max-w-20" @click="deleteProject">
      <span v-if="deleting" class="animate-spin">
        <LoaderCircle />
      </span>
      <span v-else class="text-white">
        <Trash2 />
      </span>
      Delete</Button
    >
    <Table v-if="project" class="mt-4 border table-container">
      <TableRow>
        <TableHead> Name </TableHead>
        <TableCell>
          <AppInputLiveEditText
            type="text"
            v-model="project.project_name"
            @@commit="updateProject"
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableHead> Slug </TableHead>
        <TableCell>
          {{ project.project_slug }}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableHead> Created On </TableHead>
        <TableCell>
          {{ formatDateStrToUserFriendly(project.project_created_at) }}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableHead> Last Updated On </TableHead>
        <TableCell>
          {{ formatDateStrToUserFriendly(project.project_updated_at) }}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableHead> Archived? </TableHead>
        <TableCell>
          <AppInputLiveEditStatus v-model="project.project_archived" @@commit="updateProject" />
        </TableCell>
      </TableRow>
    </Table>
    <section v-if="project" class="mt-4 flex flex-col w-full">
      <h2>Tasks</h2>
      <Button v-if="!noTasks" @click="openModal = !openModal" class="mb-4 self-end">+ Add</Button>
      <div class="border table-container">
        <article v-if="noTasks" class="flex flex-col">
          <Button @click="openModal = !openModal" class="mt-4 mr-4 mb-8 self-end">+ Add</Button>
          <p class="text-center">No task found.</p>
        </article>
        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead> Name </TableHead>
              <TableHead> Status </TableHead>
              <TableHead> Due Date </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="task in project.tasks" :key="task.task_uid">
              <TableCell class="p-0"
                ><RouterLink
                  :to="`${RouterPathEnum.Tasks}/${task.task_uid}`"
                  :key="task.task_uid"
                  class="text-left underline hover:bg-muted block w-full font-medium p-4"
                  >{{ task.task_name }}</RouterLink
                ></TableCell
              >
              <TableCell
                ><AppInputLiveEditStatus
                  v-model="task.task_completed"
                  :readonly="true"
                  :show-tool-tip="false"
              /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
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
