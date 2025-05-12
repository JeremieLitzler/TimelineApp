import type { IProject } from './IProject'
import type { ITask } from './ITask'

export type TimeRecordRequestNew = {
  started_at: string
  ended_at?: string
  projects?: IProject | null
  tasks?: ITask | null
}
