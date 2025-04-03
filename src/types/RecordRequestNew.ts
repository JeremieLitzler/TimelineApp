import type { IProject } from './IProject'
import type { ITask } from './ITask'

export type RecordRequestNew = {
  started_at: string
  ended_at?: string
  record_uid?: string | undefined
  projects?: IProject | null
  tasks?: ITask | null
}
