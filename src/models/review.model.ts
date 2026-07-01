import type { ProjectSlugOrId } from '~/models/project.model'
import type { Translated } from '@/interfaces/translated'
import type { UserModel } from '@/models/user.model'
import type { Ordering } from '@/interfaces/query'
import type BaseModel from '@/models/base.model'

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

export type ReviewId = ReviewModel['id']

export type TranslatedReview = Translated<ReviewModel, 'title' | 'description'>

export type QueryFilterReviews = Partial<
  {
    project: number
    reviewer: number
    ordering: Ordering<'created_at' | 'updated_at'>
  } & PaginationQuery
>

export type ReviewForm = Partial<
  Pick<ReviewModel, 'id' | 'title' | 'description'> & {
    project_id: ProjectSlugOrId
    reviewer_id: ReviewModel['reviewer']['id']

    publish: boolean
    lock: boolean
  }
>
