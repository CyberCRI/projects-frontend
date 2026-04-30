import type { TagModel } from '~/models/tag.model'

export const defaultForm = (): TagModel => ({
  id: null,
  title: '',
  title_en: '',
  title_fr: '',
  description: '',
  description_en: '',
  description_fr: '',
})
