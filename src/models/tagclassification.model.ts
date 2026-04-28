import type { OrganizationModel } from '~/models/organization.model'
import type { LanguageType, TagType } from '~/models/types'
import type { TagModel } from '~/models/tag.model'
import type BaseModel from '~/models/base.model'

export type TagClassificationModel = BaseModel & {
  id: number
  type: TagType
  organization: OrganizationModel
  is_public: boolean
  title: string
  slug: string
  outdated_slugs: string[]
  description: string
  tags: TagModel[]
}

export type QueryFilterTagClassification = Partial<
  {
    search: string
    language: LanguageType
  } & PaginationQuery
>
