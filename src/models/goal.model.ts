import BaseModel from '@/models/base.model'
import { StatusType } from '@/models/types'

/**
 * @name GoalModel
 * @description Goal of a project
 */
export interface GoalModel extends BaseModel {
  title: string
  description: string
  deadline_at: Date
  status: StatusType
}

export type GoalInput = Required<GoalModel> & {
  project_id: string
  goal_id: string
}

export type GoalOutput = Required<GoalModel>
