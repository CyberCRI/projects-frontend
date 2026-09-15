import { translateProject } from '~/composables/useAutoTranslate/translateProject'
import { TranslatedAnnouncement } from 'shared-projects-frontend/models'
import { translateEntity } from '~/composables/useAutoTranslate/utils'
import { Announcement } from '~/analytics/announcement.analytic'

export const translateAnnouncement = (
  data: Announcement,
  locale: string
): TranslatedAnnouncement => {
  if (!data) {
    return null
  }

  const translated = {
    ...translateEntity<TranslatedAnnouncement>(data, ['description', 'title'], locale),
  }
  if (data.project) {
    translated.project = translateProject(data.project, locale)
  }

  return translated
}
