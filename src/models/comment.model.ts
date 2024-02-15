import BaseModel from '@/models/base.model'

/**
 * @name CommentModel
 * @description Comment of a project
 * */
export interface CommentModel extends BaseModel {
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

export type CommentInputModel = Required<CommentModel> & {
    author_id: number // user_id
    reply_on_id: number
    project_id: string
    comment_id: string
}

export type CommentOutput = Required<CommentModel> & {
    replies: Array<CommentModel>
}
