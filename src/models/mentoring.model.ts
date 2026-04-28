import type { OrganizationModel } from '~/models/organization.model'
import type { SkillModel } from '~/models/skill.model'
import type { UserModel } from '~/models/user.model'

export type Mentoring = {
  organization: OrganizationModel
  mentor: UserModel
  mentoree: UserModel
  skill: SkillModel
  create_by: UserModel
  status: 'pending' | 'accepted' | 'rejected'
}
