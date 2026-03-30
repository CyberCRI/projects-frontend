import { Translated } from '@/interfaces/translated'
import BaseModel from '@/models/base.model'
import { ImageModel } from '@/models/image.model'
import { PeopleGroupModel } from '@/models/invitation.model'
import { BaseLocationModel, BaseTranslatedLocationModel } from '@/models/location.model'
import { OrganizationModel } from '@/models/organization.model'

/**
 * @name NewsModel
 * @description News of an organization
 */
export interface NewsModel extends BaseModel {
  id: number
  title: string
  content: string
  images: NewsImageModel[]
  header_image?: ImageModel
  publication_date: string
  people_groups: PeopleGroupModel[]
  created_at: string
  updated_at: string
  organization: OrganizationModel
  visible_by_all: boolean
  location: BaseLocationModel
}

export type TranslatedNews = Omit<Translated<NewsModel, 'title' | 'content'>, 'location'> & {
  location: BaseTranslatedLocationModel
}

export interface NewsImageModel {
  file: string
  name: string
  gallery: string
}

export type NewsOutput = BaseModel &
  Required<NewsModel> & {
    images?: Array<NewsImageModel>
  }

export type NewsInput = Required<NewsModel> & {
  organization_code: string
}

export interface HeaderImage {
  id: number
  name: string
  url: string
  height: number
  width: number
  created_at: Date
  variations: {
    full: string
    large: string
    medium: string
    original: string
    small: string
  }
}

export type NewsHeaderOutput = {
  id: number
  name: string
  url: string
  height: number
  width: number
  created_at: Date
}

export type QueryFilterNews = Partial<{
  ordering: 'publication_date' | '-publication_date'
  from_date: string
}>
