import type { ProjectTab, ProjectTabItem } from 'shared-projects-frontend/models'
import { DEFAULT_ICONS_TABS } from '~/functs/constants'

export const projectTabSkeleton = (def?: Partial<ProjectTab>): ProjectTab => {
  const obj: Omit<ProjectTab, 'id'> = {
    uuid: '',
    title: 'title',
    description: 'description',
    icon: DEFAULT_ICONS_TABS.text,
    type: 'text',
    show_preview: true,
    modules: {
      items: 0,
    },
    ...(def ?? {}),
  }

  obj.icon = DEFAULT_ICONS_TABS[obj.type]

  return obj as ProjectTab
}

export const projectTabItemSkeleton = (
  def?: Partial<ProjectTabItem>
): Omit<ProjectTabItem, 'id'> => ({
  title: 'title',
  content: 'description',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...(def ?? {}),
})
