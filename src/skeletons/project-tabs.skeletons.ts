import type { ProjectTab, ProjectTabItem } from '~/models/projects-tabs.model'

export const projectTabSkeleton = (def?: Partial<ProjectTab>): ProjectTab => ({
  title: 'title',
  description: 'description',
  icon: null,
  id: -1,
  modules: {
    items: 0,
  },
  ...(def ?? {}),
})

export const projectTabItemSkeleton = (def?: Partial<ProjectTabItem>): ProjectTabItem => ({
  title: 'title',
  content: 'description',
  id: -1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...(def ?? {}),
})
