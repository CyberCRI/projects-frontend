import { TemplateModel } from '~/models/template.model'

export const templateSkeleton = (def?: Partial<TemplateModel>): TemplateModel => ({
  id: -1,
  name: 'name',
  description: 'description',
  language: '',
  images: [],
  organization: null,
  categories: [],
  project_title: 'project_title',
  project_description: 'project_description',
  project_purpose: 'project_purpose',
  project_tags: [],
  blogentry_title: 'blogentry_title',
  blogentry_content: 'blogentry_content',
  goal_title: 'goal_title',
  goal_description: 'goal_description',
  review_title: 'review_title',
  review_description: 'review_description',
  comment_content: 'comment_content',
  ...(def || {}),
})
