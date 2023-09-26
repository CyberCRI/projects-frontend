import BaseModel from '@/models/base.model'

/**
 * @name ReviewModel
 * @description Review of a project
 */
export interface ReviewModel extends BaseModel {
    description: string
    title: string
    reviewer: {
        id: number
        keycloak_id: string
        people_id: string
        email: string
        given_name: string
        family_name: string
    }
}

export type ReviewModelInput = Required<ReviewModel> & {
    reviewer_id: string // keycloak_id
    project_id: string
}
