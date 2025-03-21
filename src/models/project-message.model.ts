import BaseModel from '@/models/base.model'

/**
 * @name CommentModel
 * @description Comment of a project
 * */
export interface ProjectMessageModel extends BaseModel {
  content: string
  author: {
    email: string
    family_name: string
    given_name: string
    id: number
    people_id: string
  }
  deleted_at: Date
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
