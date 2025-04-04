export default function useTagTexts() {
  const { locale } = useI18n()

  const title = (tag) => {
    return tag[`title_${locale.value}`] || tag.title
  }

  const description = (tag) => {
    return tag[`description_${locale.value}`] || tag.description
  }

  return {
    title,
    description,
  }
}
