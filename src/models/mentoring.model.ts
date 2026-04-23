import BaseModel from '@/models/base.model'
import { OrganizationModel } from '@/models/organization.model'
import { SkillModel } from '@/models/skill.model'
import { UserModel } from '@/models/user.model'

export interface Mentoring extends BaseModel {
  id: number
  organization: OrganizationModel
  mentor: UserModel
  mentoree: UserModel
  skill: SkillModel
  status: 'pending' | 'accepted' | 'rejected'
  create_by: UserModel | null
  created_at: string
}

export type MentoringContactForm = {
  title: string
  reply_to: string
  content: string
}
