import { supabase } from '@/lib/supabaseClient'
import type { FormDataCreateTask } from '@/types/FormDataCreateTask'
import type { UniqueConstraintTask } from '@/types/UniqueTaskConstraint'
import type { QueryData } from '@supabase/supabase-js'

export const createTaskQuery = async (task: FormDataCreateTask) => {
  const { project_uid, ...props } = task
  return await supabase.from('tasks').insert({ ...props, project_uid })
}
export const updateTaskQuery = async (task = {}, uid: string) => {
  const result = await supabase.from('tasks').update(task).eq('task_uid', uid)
  return result // {count, data, error, status}
}
export const deleteTaskQuery = async (uid: string) => {
  return await supabase.from('tasks').delete().eq('task_uid', uid)
}
export const taskWithParentQuery = (uid: string) =>
  supabase
    .from('tasks')
    .select(
      `
    *,
    projects (
      project_uid,
      name,
      slug
    )
  `,
    )
    .eq('task_uid', uid)
    .single()
export type TaskWithParentType = QueryData<ReturnType<typeof taskWithParentQuery>>

export const taskSlugForProjectAvailable = async ({ projectUid, slug }: UniqueConstraintTask) => {
  if (!projectUid || !slug) {
    console.warn(
      `Calling taskSlugForProjectAvailable with either projectUid (<${projectUid}>) or slug are undefined (<${slug}>) > returning`,
      true,
    )
    return true
  }
  const { data, error } = await supabase
    .from('tasks')
    .select('task_uid')
    .eq('project_uid', projectUid)
    .eq('slug', slug)

  if (error) {
    console.error('Error querying taskSlugForProjectAvailable:', error.message)
    throw error
  }
  const result = data.length === 0
  return result
}
