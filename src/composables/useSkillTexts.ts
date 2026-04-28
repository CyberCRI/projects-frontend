import type { UserSkillModel } from '~/models/user.model'

import useTagTexts from '~/composables/useTagTexts'

export default function useSkillTexts() {
  const tagTexts = useTagTexts()

  const title = (skill: UserSkillModel) => tagTexts.title(skill.tag)

  const compareTitles = (a: UserSkillModel, b: UserSkillModel) => title(a).localeCompare(title(b))

  const description = (skill: UserSkillModel) => tagTexts.description(skill.tag)

  return { title, description, compareTitles }
}
