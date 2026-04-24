import { Ordering } from '@/interfaces/query'
import BaseModel from '@/models/base.model'

/**
 * @name ReviewModel
 * @description Review of a project
 */
export interface ReviewModel extends BaseModel {
  id: number
  description: string
  title: string
  reviewer: {
    id: number
    email: string
    given_name: string
    family_name: string
  }
  created_at: string
  updated_at: string
}

export type ReviewModelInput = Required<ReviewModel> & {
  reviewer_id: string
  project_id: string
}

export type QueryFilterReviews = Partial<{
  project: number
  reviewer: number
  ordering: Ordering<'created_at' | 'updated_at'>
}> &
  PaginationQuery
