import type { SkillModel } from 'shared-projects-frontend/models'

export type UserMentorShip = 'mentoree' | 'mentor'
export type MentorShip = {
  [key: SkillModel['id']]: UserMentorShip
}
