import type { TagModel } from 'shared-projects-frontend'

export default function useTagTexts() {
  const { locale } = useNuxtI18n()

  const title = (tag: TagModel): string => {
    return tag[`title_${locale.value}`] || tag.title
  }

  const description = (tag: TagModel): string => {
    return tag[`description_${locale.value}`] || tag.description
  }

  return {
    title,
    description,
  }
}
