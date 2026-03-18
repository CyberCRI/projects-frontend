import { Translated } from '@/interfaces/translated'
import BaseModel from '@/models/base.model'
import { EventModel, TranslatedEventModel } from '@/models/event.model'
import { NewsModel, TranslatedNews } from '@/models/news.model'
import { ProjectModel, TranslatedProject } from '@/models/project.model'
import { LocationType } from '@/models/types'

export interface BaseLocationModel extends BaseModel {
  id: number
  lat: number
  lng: number
  type: LocationType
  title: string
  description: string
}

export type BaseTranslatedLocationModel = Translated<BaseLocationModel, 'title' | 'description'>

export interface NewsLocation extends BaseLocationModel {
  news: NewsModel
}

export interface TranslatedNewsLocation extends BaseTranslatedLocationModel {
  news: TranslatedNews
}

export interface EventLocation extends BaseLocationModel {
  event: EventModel
}

export interface TranslatedEventLocation extends BaseTranslatedLocationModel {
  event: TranslatedEventModel
}

export interface LocationModel extends BaseLocationModel {
  project: ProjectModel
}

export type TranslatedLocation = BaseTranslatedLocationModel & {
  project: TranslatedProject
}

export type LocationInput = Required<LocationModel> & {
  project_id: string
}

export type LocationOutput = Omit<Required<LocationModel>, 'project'>

export type LocationForm = Partial<
  Omit<LocationModel, 'id' | 'project'> & {
    id?: LocationModel['id']
  }
>

export type ProjectLocationForm = LocationForm & {
  project_id: string
}

export type AnyLocation = BaseLocationModel & { [key: string]: any }
export type AnyTranslatedLocation = Omit<BaseTranslatedLocationModel, '$t'> & {
  $t?: BaseTranslatedLocationModel['$t']
  [key: string]: any
}
