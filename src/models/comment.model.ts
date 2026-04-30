import type { Translated } from '@/interfaces/translated'
import type { ImageModel } from '@/models/image.model'
import type { UserModel } from '@/models/user.model'
import type { Ordering } from '@/interfaces/query'
import type BaseModel from '@/models/base.model'

/**
 * @name CommentModel
 * @description Comment of a project
 * */
export interface CommentModel extends BaseModel {
  id: number
  content: string
  author: UserModel
  images: ImageModel[]
  created_at: string
  deleted_at: string
  updated_at: string
  replies: CommentModel[]
}

export type TranslatedComment = Translated<Omit<CommentModel, 'replies'>, 'content'> & {
  replies: TranslatedComment[]
}

export type CommentInputModel = Required<CommentModel> & {
  author_id: number // user_id
  reply_on_id: number
  project_id: string
  comment_id: string
}

export type CommentOutput = Required<CommentModel> & {
  replies: Array<CommentModel>
}

export type QueryFilterComments = Partial<
  {
    ordering: Ordering<'updated_at' | 'created_at'>
  } & PaginationResult
>
