import type { ProjectModel, TranslatedProject } from '@/models/project.model'
import type { OrganizationModel } from '@/models/organization.model'
import type { Translated } from '@/interfaces/translated'
import type { Ordering } from '@/interfaces/query'
import type BaseModel from '@/models/base.model'

export interface AnnouncementModel extends BaseModel {
  id: number
  description: string
  title: string
  type: 'na' | 'participant' | 'job' | 'traineeship'
  project: ProjectModel
  status: 'open' | 'closed'
  deadline: string
  is_remunerated: boolean
  updated_at: string
  created_at: string
}

export type TranslatedAnnouncement = Omit<
  Translated<AnnouncementModel, 'title' | 'description'>,
  'project'
> & {
  project: TranslatedProject
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

export type QueryFilterAnnouncement = Partial<{
  ordering: Ordering<'created_at' | 'updated_at' | 'deadline'>
  organizations: OrganizationModel['code'][]
  from_date: string
  to_date: string
  from_date_or_none: string
  to_date_or_none: string
}>
