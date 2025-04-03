import type { CacheValidationKeyInfo } from '@/types/CacheValidationInfo'
import type { CacheValidationRefreshRequest } from '@/types/CacheValidationRefreshRequest'
import type { FormDataCreateTask } from '@/types/FormDataCreateTask'
import { StoreCacheKey } from '@/types/StoreCacheKeys'
import { timeStampExpired, validateCache } from '@/utils/cache-validation'
import { toISOStringWithTimezone } from '@/utils/date-format'
import {
  allTasksQuery,
  createTaskQuery,
  deleteTaskQuery,
  tasksByProjectQuery,
  taskWithParentQuery,
  updateTaskQuery,
  type TasksByProjectType,
  type TaskWithParentType,
} from '@/services/supabase-tasks-queries'
import type { PostgrestError } from '@supabase/supabase-js'
import { useMemoize } from '@vueuse/core'
import type { TaskRecordWithRpc } from '@/types/TaskRecordWithRpc'

export const useTaskStore = defineStore('Tasks-store', () => {
  const GET_METHODS_EXPIRATION = 900 // 15 min
  const allTasks = ref<TaskRecordWithRpc[] | null>()
  const allTasksByProject = ref<TasksByProjectType | null>()
  const oneTaskWithProject = ref<TaskWithParentType | null>(null)
  const _taskLastFetchTime = ref<CacheValidationKeyInfo>({})

  const getTaskKey = (uid: string) => `task-uid-${uid}`

  const _forceRefreshCache = (key: StoreCacheKey | string) => {
    return timeStampExpired({
      timeStamp: _taskLastFetchTime.value[key].timeStamp,
      invalidateAfterSeconds: GET_METHODS_EXPIRATION,
    })
  }
  const clearCache = () => {
    loadTasks
    console.log('cleared Tasks')
    loadTask.clear()
    console.log('cleared individual Tasks')
  }
  const validateCacheTask = ({ key: id, forceRefresh }: CacheValidationRefreshRequest) => {
    validateCache<
      typeof oneTaskWithProject,
      typeof taskWithParentQuery,
      typeof loadTask,
      PostgrestError
    >({
      key: getTaskKey(id as string),
      filter: id,
      reference: oneTaskWithProject,
      query: taskWithParentQuery,
      loaderFn: loadTask,
      lastFetchInfo: {
        ..._taskLastFetchTime.value[getTaskKey(id as string)],
        forceRefresh,
      },
    })
  }
  const loadTask = useMemoize(
    async (id: string) => {
      const { data, error, status } = await taskWithParentQuery(id)

      if (error) {
        useErrorStore().setError({ error, customCode: status })
      } else {
        _taskLastFetchTime.value[getTaskKey(id)] = { timeStamp: Date.now() }
      }

      return data
    },
    {
      // TODO > see https://vueuse.org/core/useMemoize/#resolving-cache-key
      getKey: (id) => getTaskKey(id),
    },
  )
  const getTask = async (id: string) => {
    oneTaskWithProject.value = null
    oneTaskWithProject.value = await loadTask(id)
    const forceRefresh = timeStampExpired({
      timeStamp: _taskLastFetchTime.value[getTaskKey(id)].timeStamp,
      invalidateAfterSeconds: GET_METHODS_EXPIRATION,
    })
    validateCacheTask({ key: id, forceRefresh })
  }
  const validateCacheAllTasksOnly = async (forceRefresh: boolean = false) =>
    validateCache<typeof allTasks, typeof allTasksQuery, typeof loadTasks, PostgrestError>({
      key: StoreCacheKey.AllTasksOnly,
      loaderFn: loadTasks,
      query: allTasksQuery,
      reference: allTasks,
      lastFetchInfo: {
        ..._taskLastFetchTime.value[StoreCacheKey.AllTasksOnly],
        forceRefresh,
      },
    })
  const loadTasks = useMemoize(async (key: string) => {
    const { data, error, status } = await allTasksQuery

    if (error) {
      useErrorStore().setError({ error, customCode: status })
    } else {
      _taskLastFetchTime.value[StoreCacheKey.AllTasksOnly] = { timeStamp: Date.now() }
    }

    return data
  })
  const getTasks = async () => {
    allTasks.value = null
    allTasks.value = await loadTasks(StoreCacheKey.AllTasksOnly)
    validateCacheAllTasksOnly(_forceRefreshCache(StoreCacheKey.AllTasksOnly))
  }
  const validateCacheAllTasksByProject = async (
    forceRefresh: boolean = false,
    project_uid: string,
  ) => {
    const key = _getTasksByProjectCacheKey(project_uid)
    validateCache<
      typeof allTasksByProject,
      typeof tasksByProjectQuery,
      typeof loadTasksByProject,
      PostgrestError
    >({
      key,
      loaderFn: loadTasksByProject,
      query: tasksByProjectQuery,
      reference: allTasksByProject,
      lastFetchInfo: {
        ..._taskLastFetchTime.value[key],
        forceRefresh,
      },
    })
  }
  const _getTasksByProjectCacheKey = (project_uid: string) =>
    `${StoreCacheKey.AllTasksByProject}-for-${project_uid}`
  const loadTasksByProject = useMemoize(async (project_uid: string) => {
    const { data, error, status } = await tasksByProjectQuery(project_uid)

    if (error) {
      useErrorStore().setError({ error, customCode: status })
    } else {
      _taskLastFetchTime.value[_getTasksByProjectCacheKey(project_uid)] = { timeStamp: Date.now() }
    }

    return data
  })
  const getTasksByProject = async (project_uid: string | null | undefined) => {
    if (!project_uid) {
      return null
    }
    allTasksByProject.value = null
    allTasksByProject.value = await loadTasksByProject(project_uid)
    validateCacheAllTasksByProject(
      _forceRefreshCache(_getTasksByProjectCacheKey(project_uid)),
      project_uid,
    )
  }

  const createTask = async (newTask: FormDataCreateTask) => {
    const { error, status } = await createTaskQuery(newTask)
    if (error) {
      useErrorStore().setError({ error, customCode: status })
    }
  }
  const updateTask = async () => {
    if (!oneTaskWithProject.value) return

    const { task_uid, projects, ...TaskProps } = oneTaskWithProject.value
    if (oneTaskWithProject.value.completed) {
      TaskProps.completed_at = toISOStringWithTimezone(new Date())
    } else {
      TaskProps.completed_at = null
    }
    TaskProps.updated_at = toISOStringWithTimezone(new Date())
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
    if (!oneTaskWithProject.value) return

    const { error } = await deleteTaskQuery(oneTaskWithProject.value.task_uid)
    if (error) {
      useErrorStore().setError({ error })
    } else {
      console.log('deleteTask>no error')
    }
  }
  const softDeleteTask = async () => {
    if (!oneTaskWithProject.value) return

    oneTaskWithProject.value.deleted = true
    oneTaskWithProject.value.deleted_at = toISOStringWithTimezone(new Date())
    updateTask()
  }

  return {
    taskWithProject: oneTaskWithProject,
    tasks: allTasks,
    tasksByProject: allTasksByProject,
    loadTask,
    clearCache,
    getTask,
    getTasks,
    getTasksByProject,
    createTask,
    updateTask,
    deleteTask,
    softDeleteTask,
  }
})
