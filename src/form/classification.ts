import type { TagClassificationModel } from 'shared-projects-frontend/models/tagclassification.model'

export const defaultTagClassificationForm = (): Partial<TagClassificationModel> => ({
  id: null,
  title: '',
  description: '',
  is_enabled_for_projects: false,
  is_enabled_for_skills: false,
})
