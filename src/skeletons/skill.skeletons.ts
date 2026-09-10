import type { SkillModel } from 'shared-projects-frontend/models'
import { tagSkeleton } from '~/skeletons/project.skeletons'

export const skillSkeleton = (def?: Partial<SkillModel>): SkillModel => ({
  id: -1,
  can_mentor: false,
  needs_mentor: false,
  comment: '',
  level: 4,
  level_to_reach: 5,
  type: 'skill',
  // @ts-expect-error
  tag: tagSkeleton(),
  category: 'lorem',
  ...(def || {}),
})
