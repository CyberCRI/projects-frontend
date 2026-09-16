import type { SkillModel } from 'shared-projects-frontend/models'

import useTagTexts from '~/composables/useTagTexts'

export default function useSkillTexts() {
  const tagTexts = useTagTexts()

  const title = (skill: SkillModel) => tagTexts.title(skill.tag)

  const compareTitles = (a: SkillModel, b: SkillModel) => title(a).localeCompare(title(b))

  const description = (skill: SkillModel) => tagTexts.description(skill.tag)

  return { title, description, compareTitles }
}
