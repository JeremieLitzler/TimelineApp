import { supabase } from '@/lib/supabaseClient'
import type { QueryData } from '@supabase/supabase-js'

// export const createTaskQuery = async (task: FormDataCreateTask) => {
//   const { project_uid, ...props } = task
//   return await supabase.from('tasks').insert({ ...props, project_uid })
// }
// export const updateTaskQuery = async (task = {}, uid: string) => {
//   const result = await supabase.from('tasks').update(task).eq('task_uid', uid)
//   return result // {count, data, error, status}
// }
// export const deleteTaskQuery = async (uid: string) => {
//   return await supabase.from('tasks').delete().eq('task_uid', uid)
// }

/**
 * The following doesn't work.
 * Continue with:
 * - https://github.com/orgs/supabase/discussions/13033
 * - https://github.com/orgs/supabase/discussions/1393
 * - https://www.perplexity.ai/search/how-do-you-query-with-supabase-pNCzPOPJSjGoSxQES33Lkw
 * 
 * The SQL request to run is:
 * 
    select 
      records.*,
      projects.name as project_name,
      projects.hex_color,
      projects.slug as project_slug,
      projects.archived as project_archived,
      tasks.task_uid as tasks_task_uid,
      tasks.name as task_name,
      tasks.completed as task_completed
    from records records 
      inner join projects projects on projects.project_uid = records.project_uid
      left join tasks tasks on records.task_uid = tasks.task_uid
    where records.deleted = false
 *
 */
export const allRecordsWithProjectOrTaskQuery = supabase
  .from('records')
  .select(
    `
    *,
    projects!inner (
      name,
      hex_color,
      slug,
      archived
    ),
    tasks (
      task_uid,
      name,
      completed
    )
  `,
  )
  .eq('deleted', false)

export type AllRecordsWithProjectOrTaskType = QueryData<typeof allRecordsWithProjectOrTaskQuery>
