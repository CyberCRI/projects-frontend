import BaseModel from '@/models/base.model'

/**
 * @name FollowModel
 * @description User who follow a project
 */
export interface FollowModel extends BaseModel {
  follower: {
    id: number
    email: string
    given_name: string
    family_name: string
  }
}

export type FollowInput = {
  project_id?: string
  follower_id: number
}

export type FollowCategoryInput = {
  category_id?: number
  follower_id: number
}

export type UnfollowCategoryInput = {
  category_follow_id: number
  follower_id: number
}

export type FollowedProjectRef = {
  project_id: string
}

export type AddManyFollowedProject = {
  follows: FollowedProjectRef[]
}

export type FollowOutput = Required<FollowModel>

export type FollowManyOutput = Required<FollowOutput> & {
  id: number
  project: {
    id: string
  }
}

export type FollowOutputList = FollowManyOutput[]
