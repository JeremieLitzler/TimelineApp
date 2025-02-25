import { supabase } from '@/lib/supabaseClient'
import type { FormDataCreateTask } from '@/types/FormDataCreateTask'
import type { QueryData } from '@supabase/supabase-js'

export const createTaskQuery = async (task: FormDataCreateTask) => {
  const { project_uid, ...task_props } = task
  return await supabase.from('tasks').insert({ ...task_props, project_uid })
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
      project_name,
      project_slug
    )
  `,
    )
    .eq('task_uid', uid)
    .single()
export type TaskWithParentType = QueryData<ReturnType<typeof taskWithParentQuery>>
