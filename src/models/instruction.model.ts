import type { PeopleGroupModel } from '~/models/invitation.model'
import type BaseModel from '~/models/base.model'

import type { Translated } from '~/interfaces/translated'
import type { Ordering } from '~/interfaces/query'

/**
 * @name NewsModel
 * @description News of an organization
 */
export interface InstructionModel extends BaseModel {
  id: number
  title: string
  content: string
  publication_date: Date | string
  people_groups: PeopleGroupModel[]
  has_to_be_notified: boolean
  visible_by_all: boolean
}

// can be id or id in string
export type InstructionId = InstructionModel['id'] | string

export type InstructionOutput = Required<InstructionModel>
export type InstructionForm = Omit<InstructionModel, 'id' | 'people_groups'> & {
  id?: number
  people_groups: any
}

export type InstructionInput = Required<InstructionModel> & {
  organization_code: string
}

export type TranslatedInstruction = Translated<InstructionModel, 'title' | 'content'>

export type QueryFilterInstruction = Partial<{
  ordering: Ordering<'publication_date' | 'updated_at' | 'created_at'>
  from_date: string
  to_date: string
}> &
  Partial<PaginationQuery>
