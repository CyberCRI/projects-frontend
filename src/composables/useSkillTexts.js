import useTagTexts from '@/composables/useTagTexts.js'

export default function useSkillTexts() {
  const tagTexts = useTagTexts()

  function title(skill) {
    return tagTexts.title(skill.tag)
  }

  function compareTitles(a, b) {
    return title(a).localeCompare(title(b))
  }

  function description(skill) {
    return tagTexts.description(skill.tag)
  }
  return { title, description, compareTitles }
}
