import { Ordering } from '@/interfaces/query'
import { Translated } from '@/interfaces/translated'
import BaseModel from '@/models/base.model'

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
}

export type TranslatedBlogEntry = Translated<BlogEntryModel, 'title' | 'content'>

export type QueryFilterBlogEntry = Partial<
  {
    ordering: Ordering<'created_at' | 'updated_at'>
  } & paginationConfig
>

export type BlogEntryOutput = Required<BlogEntryModel>

export type BlogEntryInput = Required<BlogEntryModel> & {
  project_id: string
  blog_entry_id: string
}
