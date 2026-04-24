import { Ordering } from '@/interfaces/query'
import { Translated } from '@/interfaces/translated'
import BaseModel from '@/models/base.model'

/**
 * @name CommentModel
 * @description Comment of a project
 * */
export interface ProjectMessageModel extends BaseModel {
  id: number
  content: string
  author: {
    email: string
    family_name: string
    given_name: string
    id: number
    people_id: string
  }
  created_at: string
  deleted_at: string
  updated_at: string
}

export type TranslatedProjectMessage = Translated<ProjectMessageModel, 'content'>

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
