import type { IProject } from './IProject'
import type { ITask } from './ITask'

export interface FormDataEditRecord {
  started_at: string
  ended_at: string
  record_uid?: string | undefined
  project_uid?: string | undefined
  task_uid?: string | undefined
}
