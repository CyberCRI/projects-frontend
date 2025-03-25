import BaseModel from '@/models/base.model'

/**
 * @name NewsModel
 * @description News of an organization
 */
export interface InstructionModel extends BaseModel {
  id: number
  title: string
  content: string
  publication_date: Date | string
  people_groups: string[]
  has_to_be_notified: boolean
}

export type InstructionOutput = BaseModel & Required<InstructionModel>

export type InstructionInput = Required<InstructionModel> & {
  organization_code: string
}
