import { translateEntity, translateMany } from '~/composables/useAutoTranslate/utils'
import { translateTemplate } from '~/composables/useAutoTranslate/translateTemplate'
import { ProjectModel, TranslatedProject } from 'shared-projects-frontend/models'

export const translateProject = (data: ProjectModel, locale: string): TranslatedProject => {
  if (!data) {
    return null
  }

  const translated = {
    ...translateEntity<TranslatedProject>(data, ['description', 'title', 'purpose'], locale),
  }
  if (data.template) {
    translated.template = translateTemplate(data.template, locale)
  }
  if (data.categories) {
    translated.categories = translateMany(translateCategory, data.categories, locale)
  }
  if (data.tags) {
    translated.tags = translateMany(translateTag, data.tags, locale)
  }

  return translated
}
