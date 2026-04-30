import type { Translated } from '@/interfaces/translated'
import type { UserModel } from '@/models/user.model'
import type { Ordering } from '@/interfaces/query'
import type BaseModel from '@/models/base.model'

/**
 * @name CommentModel
 * @description Comment of a project
 * */
export interface ProjectMessageModel extends BaseModel {
  id: number
  content: string
  author: UserModel
  created_at: string
  deleted_at: string
  updated_at: string
  replies: ProjectMessageModel[]
}

export type TranslatedProjectMessage = Translated<
  Omit<ProjectMessageModel, 'replies'>,
  'content'
> & {
  replies: TranslatedProjectMessage[]
}

export type ProjectMessageInputModel = Required<ProjectMessageModel> & {
  author_id: number // user_id
  reply_on: number // // reply_on_id in comment
  project_id: string
  project_message_id: string
}

export type ProjectMessageOutput = Required<ProjectMessageModel> & {
  replies: Array<ProjectMessageModel>
}

export type QueryFilterProjectMessage = Partial<
  {
    ordering: Ordering<'created_at' | 'updated_at'>
  } & PaginationQuery
>
