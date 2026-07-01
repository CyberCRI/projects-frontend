import type { BaseLocationModel, BaseTranslatedLocationModel } from '~/models/location.model'
import type { OrganizationModel } from '~/models/organization.model'
import type { PeopleGroupModel } from '@/models/people-group.model'
import type { ImageModel } from '~/models/image.model'
import type BaseModel from '~/models/base.model'

import type { Translated } from '~/interfaces/translated'
import type { Ordering } from '~/interfaces/query'

import type { ImageSizeConverted } from '~/functs/imageSizesUtils'

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

export interface NewsImageModel {
  file: string
  name: string
  gallery: string
}

export type TranslatedNews = Omit<Translated<NewsModel, 'title' | 'content'>, 'location'> & {
  location: BaseTranslatedLocationModel
}

export type NewsOutput = BaseModel &
  Required<NewsModel> & {
    images?: Array<NewsImageModel>
  }

export type NewsInput = Required<
  Omit<NewsModel, 'id' | 'created_at' | 'updated_at' | 'organization' | 'images'>
>

export type NewsForm = Omit<NewsInput, 'people_groups'> & {
  organization_code?: string
  imageSizes?: ImageSizeConverted
  people_groups: {
    [key: number]: boolean
  }
}

export type QueryFilterNews = Partial<
  {
    ordering: Ordering<'created_at' | 'updated_at' | 'publication_date'>
    from_date: string
    to_date: string
    serializer: 'light'
  } & PaginationQuery
>
