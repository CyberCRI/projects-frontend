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
}

// can be id or id in string
export type InstructionId = InstructionModel['id'] | string

export type InstructionOutput = BaseModel & Required<InstructionModel>

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
