import type { TagModel } from 'shared-projects-frontend'

export const defaultTagForm = (): TagModel => ({
  id: null,
  title: '',
  title_en: '',
  title_fr: '',
  description: '',
  description_en: '',
  description_fr: '',
})
