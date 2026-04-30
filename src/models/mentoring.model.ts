import type { OrganizationModel } from '@/models/organization.model'
import type { SkillModel } from '@/models/skill.model'
import type { UserModel } from '@/models/user.model'
import type BaseModel from '@/models/base.model'

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
