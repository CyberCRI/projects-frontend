import BaseModel from '@/models/base.model'

/**
 * @name BlogEntryModel
 * @description Article/Blog attached to a project
 */
export interface BlogEntryModel extends BaseModel {
  id: number
  title: string
  content: string
}

export type BlogEntryOutput = Required<BlogEntryModel>

export type BlogEntryInput = Required<BlogEntryModel> & {
  project_id: string
  blog_entry_id: string
}
