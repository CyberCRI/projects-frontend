import { Ordering } from '@/interfaces/query'
import { Translated } from '@/interfaces/translated'
import BaseModel from '@/models/base.model'
import { ImageModel } from '@/models/image.model'

/**
 * @name CommentModel
 * @description Comment of a project
 * */
export interface CommentModel extends BaseModel {
  id: number
  content: string
  author: {
    email: string
    family_name: string
    given_name: string
    id: number
    people_id: number
  }
  images: ImageModel[]
  created_at: string
  deleted_at: string
  updated_at: string
}

export type TranslatedComment = Translated<CommentModel, 'content'>

export type CommentInputModel = Required<CommentModel> & {
  author_id: number // user_id
  reply_on_id: number
  project_id: string
  comment_id: string
}

export type CommentOutput = Required<CommentModel> & {
  replies: Array<CommentModel>
}

export type QueryFilterComments = Partial<{
  ordering: Ordering<'updated_at' | 'created_at'>
}> &
  PaginationResult
