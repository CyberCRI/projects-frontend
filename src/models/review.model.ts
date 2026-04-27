import { Ordering } from '@/interfaces/query'
import { Translated } from '@/interfaces/translated'
import BaseModel from '@/models/base.model'
import { UserModel } from '@/models/user.model'

/**
 * @name ReviewModel
 * @description Review of a project
 */
export interface ReviewModel extends BaseModel {
  id: number
  description: string
  title: string
  reviewer: UserModel
  created_at: string
  updated_at: string
}

export type ReviewModelInput = Required<ReviewModel> & {
  reviewer_id: string
  project_id: string
}

export type TranslatedReview = Translated<ReviewModel, 'title' | 'description'>

export type QueryFilterReviews = Partial<
  {
    project: number
    reviewer: number
    ordering: Ordering<'created_at' | 'updated_at'>
  } & PaginationQuery
>
