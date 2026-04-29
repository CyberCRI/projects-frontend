import type BaseModel from '~/models/base.model'
import type { StatusType } from '~/models/types'

import type { Translated } from '~/interfaces/translated'

/**
 * @name GoalModel
 * @description Goal of a project
 */
export interface GoalModel extends BaseModel {
  id: number
  title: string
  description: string
  deadline_at: string
  status: StatusType
}

export type TranslatedGoal = Translated<GoalModel, 'title' | 'description'>

export type GoalInput = Required<GoalModel> & {
  project_id: string
  goal_id: string
}

export type GoalForm = Omit<GoalModel, 'id'> & {
  id?: GoalModel['id']
}

export type GoalOutput = Required<GoalModel>
