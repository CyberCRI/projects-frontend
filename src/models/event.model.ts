import BaseModel from '@/models/base.model'

/**
 * @name NewsModel
 * @description News of an organization
 */
export interface EventModel extends BaseModel {
  id: number
  title: string
  content: string
  event_date: Date | string
  people_groups: string[]
}

export type EventOutput = BaseModel & Required<EventModel>

export type EventInput = Required<Omit<EventModel, 'id'>> & {
  organization_code: string
}
