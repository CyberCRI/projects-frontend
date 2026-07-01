import type { ProjectSlugOrId } from '~/models/project.model'
import type { Translated } from '@/interfaces/translated'
import type { Ordering } from '@/interfaces/query'
import type BaseModel from '@/models/base.model'

/**
 * @name BlogEntryModel
 * @description Article/Blog attached to a project
 */
export interface BlogEntryModel extends BaseModel {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string
  images?: number[]
}

export type BlogEntryId = BlogEntryModel['id']
export type TranslatedBlogEntry = Translated<BlogEntryModel, 'title' | 'content'>

export type QueryFilterBlogEntry = Partial<
  {
    ordering: Ordering<'created_at' | 'updated_at'>
  } & paginationConfig
>

export type BlogEntryForm = Omit<BlogEntryModel, 'id' | 'created_at' | 'updated_at'> & {
  id?: BlogEntryModel['id']
  created_at?: Date | string
  images_ids: number[]
  project_id?: ProjectSlugOrId
}
