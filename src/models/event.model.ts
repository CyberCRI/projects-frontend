import { Translated } from '@/interfaces/translated'
import BaseModel from '@/models/base.model'
import { BaseLocationModel, BaseTranslatedLocationModel } from '@/models/location.model'

/**
 * @name NewsModel
 * @description News of an organization
 */
export interface EventModel extends BaseModel {
  id: number
  title: string
  content: string
  start_date: Date | string
  end_date: Date | string
  created_at?: Date | string
  updated_at?: Date | string
  visible_by_all: boolean
  location: BaseLocationModel | null
  people_groups: string[]
}

export type EventOutput = BaseModel & Required<EventModel>

export type EventInput = Required<Omit<EventModel, 'id' | 'created_at' | 'updated_at'>> & {
  organization_code: string
}

export type TranslatedEventModel = Translated<EventModel, 'title' | 'content'> & {
  location: BaseTranslatedLocationModel
}
