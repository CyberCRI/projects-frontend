import BaseModel from '@/models/base.model'
import { ProjectModel } from '@/models/project.model'

export interface AnnouncementModel extends BaseModel {
    description: string
    title: string
    type: string
    project: ProjectModel
    status: string
    deadline: Date
    is_remunerated: boolean
}

export type AnnouncementInput = Required<AnnouncementModel> & {
    project_id: string
}

export type AnnouncementApplyInput = {
    project_id: string
    announcement_id: number
    applicant_name: string
    applicant_firstname: string
    applicant_email: string
    applicant_message: string
}

export type AnnouncementOutput = Required<AnnouncementModel>
