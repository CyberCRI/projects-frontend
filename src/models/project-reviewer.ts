import BaseModel from '@/models/base.model'

export interface ProjectReviewerModel extends BaseModel {
    reviewer: number
}

export type ProjectReviewerInput = Required<ProjectReviewerModel> & {
    project_id: string
}
