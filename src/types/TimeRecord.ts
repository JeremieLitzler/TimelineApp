import type { IProject } from './IProject'
import type { ITask } from './ITask'

export class TimeRecord {
  record_uid?: string
  started_at?: string
  ended_at?: string
  updated_at?: string
  projects?: IProject | null
  tasks?: ITask | null
}
