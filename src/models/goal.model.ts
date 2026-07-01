import type BaseModel from '~/models/base.model'
import type { StatusType } from '~/models/types'

import type { ProjectSlugOrId } from '~/models/project.model'
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

export type GoalForm = Partial<GoalModel> & {
  project_id?: ProjectSlugOrId
}
