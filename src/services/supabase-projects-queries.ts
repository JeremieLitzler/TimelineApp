import { supabase } from '@/lib/supabaseClient'
import type { ProjectRecordWithRpc } from '@/types/ProjectRecordWithRpc'
import type { FormDataCreateProject } from '@/types/FormDataCreateProject'
import type { PostgrestSingleResponse, QueryData } from '@supabase/supabase-js'

export const createProjectQuery = async (project: FormDataCreateProject) => {
  return await supabase.from('projects').insert(project)
}
export const updateProjectQuery = async (project = {}, uid: string) => {
  const result = await supabase.from('projects').update(project).eq('project_uid', uid)
  return result // {count, data, error, status}
}
export const deleteProjectQuery = async (uid: string) => {
  return await supabase.from('projects').delete().eq('uid', uid)
}

export const allProjectsQuery = supabase.rpc('coalesce_updated_at_or_created_at_sort', {
  target_table: 'projects',
  selected_columns: '*',
  sort_direction: 'DESC',
  nulls_position: 'LAST',
}) as unknown as PostgrestSingleResponse<ProjectRecordWithRpc[]>
export type AllProjectsType = QueryData<typeof allProjectsQuery>
export const projectWithTasksBySlugQuery = (slug: string) =>
  supabase
    .from('projects')
    .select(
      `
    *,
    tasks (
      task_uid,
      task_name,
      task_slug,
      task_completed
    )
  `,
    )
    .eq('project_slug', slug)
    .single()
export type ProjectWithTasksBySlugType = QueryData<ReturnType<typeof projectWithTasksBySlugQuery>>
