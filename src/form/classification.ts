import type { TagClassificationModel } from '~/models/tagclassification.model'

export const defaultForm = (): Partial<TagClassificationModel> => ({
  id: null,
  title: '',
  description: '',
  is_enabled_for_projects: false,
  is_enabled_for_skills: false,
})
