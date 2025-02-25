import type { CacheValidationKeyInfo } from '@/types/CacheValidationInfo'
import type { CacheValidationRefreshRequest } from '@/types/CacheValidationRefreshRequest'
import type { FormDataCreateProject } from '@/types/FormDataCreateProject'
import { StoreCacheKey } from '@/types/StoreCacheKeys'
import { timeStampExpired, validateCache } from '@/utils/cache-validation'
import { toISOStringWithTimezone } from '@/utils/date-format'
import {
  allProjectsQuery,
  createProjectQuery,
  deleteProjectQuery,
  projectWithTasksBySlugQuery,
  updateProjectQuery,
} from '@/services/supabase-projects-queries'
import type { ProjectWithTasksBySlugType } from '@/services/supabase-projects-queries'
import { type PostgrestError } from '@supabase/supabase-js'
import { useMemoize } from '@vueuse/core'
import type { ProjectRecordWithRpc } from '@/types/ProjectRecordWithRpc'

export const useProjectsStore = defineStore('project-store', () => {
  const GET_METHODS_EXPIRATION = 900 // 15 min

  const projects = ref<ProjectRecordWithRpc[] | null>()
  const project = ref<ProjectWithTasksBySlugType | null>(null)
  const _projectLastFetchTime = ref<CacheValidationKeyInfo>({})

  const validateCacheProjects = async (forceRefresh: boolean = false) =>
    validateCache<typeof projects, typeof allProjectsQuery, typeof loadProjects, PostgrestError>({
      key: StoreCacheKey.AllProjects,
      loaderFn: loadProjects,
      query: allProjectsQuery,
      reference: projects,
      lastFetchInfo: {
        ..._projectLastFetchTime.value[StoreCacheKey.AllProjects],
        forceRefresh,
      },
    })
  const validateCacheProject = ({ key: slug, forceRefresh }: CacheValidationRefreshRequest) => {
    validateCache<
      typeof project,
      typeof projectWithTasksBySlugQuery,
      typeof loadProject,
      PostgrestError
    >({
      key: slug as string,
      filter: slug,
      loaderFn: loadProject,
      query: projectWithTasksBySlugQuery,
      reference: project,
      lastFetchInfo: {
        ..._projectLastFetchTime.value[slug as string],
        forceRefresh,
      },
    })
  }
  const forceRefreshOnProjects = () => {
    return timeStampExpired({
      timeStamp: _projectLastFetchTime.value[StoreCacheKey.AllProjects].timeStamp,
      invalidateAfterSeconds: GET_METHODS_EXPIRATION,
    })
  }
  const clearCache = () => {
    console.log('called clearCache')
    loadProjects.clear()
    console.log('cleared projects')
    loadProject.clear()
    console.log('cleared individual projects')
  }
  const loadProjects = useMemoize(async (key: string) => {
    const { data, error, status } = await allProjectsQuery

    if (error) {
      useErrorStore().setError({ error, customCode: status })
    } else {
      _projectLastFetchTime.value[StoreCacheKey.AllProjects] = { timeStamp: Date.now() }
    }

    return data
  })
  const getProjects = async () => {
    projects.value = null
    projects.value = await loadProjects(StoreCacheKey.AllProjects)
    validateCacheProjects(forceRefreshOnProjects())
  }
  const loadProject = useMemoize(async (slug: string) => {
    const { data, error, status } = await projectWithTasksBySlugQuery(slug)
    if (error) {
      useErrorStore().setError({ error, customCode: status })
    } else {
      _projectLastFetchTime.value[slug] = { timeStamp: Date.now() }
    }

    return data
  })
  const getProject = async (slug: string, forceRefresh: boolean = false) => {
    project.value = null
    project.value = await loadProject(slug)
    if (!forceRefresh) {
      forceRefresh = timeStampExpired({
        timeStamp: _projectLastFetchTime.value[slug].timeStamp || 0,
        invalidateAfterSeconds: GET_METHODS_EXPIRATION,
      })
    }
    validateCacheProject({ key: slug, forceRefresh })
  }
  const refreshProject = async (slug: string) => {
    getProject(slug, true)
  }
  const createProject = async (project: FormDataCreateProject) => {
    const { error, status } = await createProjectQuery(project)
    if (error) {
      useErrorStore().setError({ error, customCode: status })
    }
    validateCacheProjects(true)
  }

  // TODO > conver to generic as task store use the same logic
  const updateProject = async () => {
    if (!project.value) return

    const { project_uid, tasks, ...ProjectProps } = project.value
    ProjectProps.project_updated_at = toISOStringWithTimezone(new Date())
    console.log('updateProject', ProjectProps)

    const { count, data, error, status } = await updateProjectQuery(ProjectProps, project_uid)
    if (error) {
      useErrorStore().setError({ error, customCode: status })
    }
    if (count && count > 1) {
      useErrorStore().setError({ error: Error('Many projects updated...'), customCode: 500 })
    }
    validateCacheProject({ key: ProjectProps.project_slug, forceRefresh: true })
    // Below replaces "validateCacheProjects(true)" as when the update is done,
    // the list isn't refreshed...
    loadProjects.clear()
  }

  const deleteProject = async () => {
    if (!project.value) return

    const { error } = await deleteProjectQuery(project.value.project_uid)
    if (error) {
      useErrorStore().setError({ error })
    } else {
      console.log('deleteProject>no error')
    }
    loadProjects.clear()
  }

  return {
    project,
    projects,
    loadProject,
    loadProjects,
    clearCache,
    getProject,
    refreshProject,
    getProjects,
    createProject,
    updateProject,
    deleteProject,
  }
})
