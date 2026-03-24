import { Translated } from '@/interfaces/translated'
import BaseModel from '@/models/base.model'
import { BaseTranslatedLocationModel } from '@/models/location.model'

/**
 * @name NewsModel
 * @description News of an organization
 */
export interface EventModel extends BaseModel {
  id: number
  title: string
  content: string
  event_date: string
  created_at?: string
  updated_at?: string
  visible_by_all: boolean
  people_groups: string[]
}

export type EventInput = Required<Omit<EventModel, 'id' | 'created_at' | 'updated_at'>>

export type EventForm = Omit<EventInput, 'people_groups'> & {
  people_groups: {
    [key: number]: boolean
  }
}

export type TranslatedEventModel = Translated<EventModel, 'title' | 'content'> & {
  location: BaseTranslatedLocationModel
}

export type QueryFilterEvent = Partial<{
  ordering: 'event_date' | '-event_date'
  from_date: string
  to_date: string
}>
