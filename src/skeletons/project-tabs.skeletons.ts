import { ProjectTab } from '~/models/projects-tabs.model'

export const projectTabSkeleton = (def?: Partial<ProjectTab>): ProjectTab => ({
  title: 'title',
  description: 'description',
  icon: null,
  type: 'blog',
  id: -1,
})
