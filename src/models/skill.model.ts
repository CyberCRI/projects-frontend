import { TagModel } from './tag.model'

export interface SkillModel {
  id: number
  user: string
  tag: TagModel
  level: number
  level_to_reach: number
}
