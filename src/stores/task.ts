import type { CacheValidationKeyInfo } from '@/types/CacheValidationInfo'
import type { CacheValidationRefreshRequest } from '@/types/CacheValidationRefreshRequest'
import type { FormDataCreateTask } from '@/types/FormDataCreateTask'
import { StoreCacheKey } from '@/types/StoreCacheKeys'
import { timeStampExpired, validateCache } from '@/utils/cache-validation'
import { toISOStringWithTimezone } from '@/utils/date-format'
import {
  createTaskQuery,
  deleteTaskQuery,
  taskWithParentQuery,
  updateTaskQuery,
  type TaskWithParentType,
} from '@/services/supabase-tasks-queries'
import type { PostgrestError } from '@supabase/supabase-js'
import { useMemoize } from '@vueuse/core'

export const useTaskStore = defineStore('Tasks-store', () => {
  const GET_METHODS_EXPIRATION = 900 // 15 min
  const taskWithProject = ref<TaskWithParentType | null>(null)
  const TaskLastFetchTime = ref<CacheValidationKeyInfo>({})

  const getTaskKey = (id: string) => `subProject-id-${id}`

  const validateCacheTask = ({ key: id, forceRefresh }: CacheValidationRefreshRequest) => {
    validateCache<
      typeof taskWithProject,
      typeof taskWithParentQuery,
      typeof loadTask,
      PostgrestError
    >({
      key: getTaskKey(id as string),
      filter: id,
      reference: taskWithProject,
      query: taskWithParentQuery,
      loaderFn: loadTask,
      lastFetchInfo: {
        ...TaskLastFetchTime.value[getTaskKey(id as string)],
        forceRefresh,
      },
    })
  }
  const clearCache = () => {
    console.log('cleared Tasks')
    loadTask.clear()
    console.log('cleared individual Tasks')
  }

  const loadTask = useMemoize(
    async (id: string) => {
      const { data, error, status } = await taskWithParentQuery(id)

      if (error) {
        useErrorStore().setError({ error, customCode: status })
      } else {
        TaskLastFetchTime.value[getTaskKey(id)] = { timeStamp: Date.now() }
      }

      return data
    },
    {
      // TODO > see https://vueuse.org/core/useMemoize/#resolving-cache-key
      getKey: (id) => getTaskKey(id),
    },
  )
  const getTask = async (id: string) => {
    taskWithProject.value = null
    taskWithProject.value = await loadTask(id)
    const forceRefresh = timeStampExpired({
      timeStamp: TaskLastFetchTime.value[getTaskKey(id)].timeStamp,
      invalidateAfterSeconds: GET_METHODS_EXPIRATION,
    })
    validateCacheTask({ key: id, forceRefresh })
  }
  const createTask = async (subProject: FormDataCreateTask) => {
    const { error, status } = await createTaskQuery(subProject)
    if (error) {
      useErrorStore().setError({ error, customCode: status })
    }
  }
  const updateTask = async () => {
    if (!taskWithProject.value) return

    const { task_uid, projects, ...TaskProps } = taskWithProject.value
    TaskProps.task_updated_at = toISOStringWithTimezone(new Date())
    const { count, data, error, status } = await updateTaskQuery(TaskProps, task_uid)
    if (error) {
      useErrorStore().setError({ error, customCode: status })
    }
    if (count && count > 1) {
      useErrorStore().setError({ error: Error('Many projects updated...'), customCode: 500 })
    }
    validateCacheTask({ key: task_uid, forceRefresh: true })
  }
  const deleteTask = async () => {
    if (!taskWithProject.value) return

    const { error } = await deleteTaskQuery(taskWithProject.value.task_uid)
    if (error) {
      useErrorStore().setError({ error })
    } else {
      console.log('deleteTask>no error')
    }
  }

  return {
    taskWithProject,
    loadTask,
    clearCache,
    getTask,
    createTask,
    updateTask,
    deleteTask,
  }
})
