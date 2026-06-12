import type { ProjectTab, ProjectTabItem } from '~/models/projects-tabs.model'
import { DEFAULT_ICONS_TABS } from '~/functs/constants'

export const projectTabSkeleton = (def?: Partial<ProjectTab>): ProjectTab => {
  const obj: ProjectTab = {
    title: 'title',
    description: 'description',
    icon: DEFAULT_ICONS_TABS.text,
    type: 'text',
    id: -1,
    modules: {
      items: 0,
    },
    ...(def ?? {}),
  }

  obj.icon = DEFAULT_ICONS_TABS[obj.type]

  return obj
}

export const projectTabItemSkeleton = (def?: Partial<ProjectTabItem>): ProjectTabItem => ({
  title: 'title',
  content: 'description',
  id: -1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...(def ?? {}),
})
