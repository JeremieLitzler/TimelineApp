import { supabase } from '@/lib/supabaseClient'
import type { RecordRequestNew } from '@/types/RecordRequestNew'
import type { QueryData } from '@supabase/supabase-js'

export const createRecordQuery = async (record: RecordRequestNew) => {
  const { projects, tasks, ...NewRecordProps } = record
  const newRecord = {
    ...NewRecordProps,
    project_uid: projects?.project_uid,
    task_uid: tasks?.task_uid,
  }
  return await supabase.from('records').insert(newRecord)
}
export const updateRecordQuery = async (record = {}, uid: string) => {
  console.log('supabase-records-queries > updateRecordQuery called...')
  const result = await supabase.from('records').update(record).eq('record_uid', uid)
  return result // {count, data, error, status}
}
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
        project_uid,
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
  .order('created_at', { ascending: false })

export type AllRecordsWithProjectOrTaskType = QueryData<typeof allRecordsWithProjectOrTaskQuery>
//// This type will infer the type of a single element within the
//// AllRecordsWithProjectOrTaskType array. If AllRecordsWithProjectOrTaskType is not an
//// array type, it will default to the never type.
// export type SingleRecordWithProjectOrTaskType = AllRecordsWithProjectOrTaskType extends (infer T)[] ? T : never;
//
//// However, if you know that AllRecordsWithProjectOrTaskType is always an array, you can
//// simply use the following approach for clarity
//// This method directly indexes into the array type to get the type of its elements.
export type SingleRecordWithProjectOrTaskType = AllRecordsWithProjectOrTaskType[number]
