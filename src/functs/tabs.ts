import {
  DEFAULT_PROJECT_TABS_ORDER,
  PROJECT_MODULE_ICON,
  PROJECT_MODULE_TITLE,
  PROJECT_TABS,
} from '~/functs/constants'
import type {
  ProjectModel,
  ProjectTab,
  ProjectTabType,
  TranslatedProjectTab,
} from 'shared-projects-frontend/models'
import { translateProjectTab } from 'shared-projects-frontend/translate'
import { defaultProjectTabForm } from '~/form/project-tabs'
import { sortBy } from 'es-toolkit'

export const defaultTab = (key: ProjectTab['type']) => {
  const { t } = useNuxtI18n()
  return translateProjectTab(
    {
      ...defaultProjectTabForm(),
      type: key,
      title: t(PROJECT_MODULE_TITLE[key]),
      icon: PROJECT_MODULE_ICON[key],
      show_preview: true,
      show_tab: true,
      description: '',
      id: null,
      order: -100 - DEFAULT_PROJECT_TABS_ORDER.findIndex((type) => type === key),
      slug: '',
      uuid: null,
      modules: {
        items: 0,
      },
    },
    'en'
  )
}

export const getTab = (
  tabs: TranslatedProjectTab[],
  key: ProjectTab['id'] | ProjectTab['type']
): TranslatedProjectTab => {
  // key is 'id'
  if (typeof key === 'number') {
    return tabs.find((el) => el.id === key)
  }

  return tabs.find((tab) => tab.type === key)
}

export const sanitizeTabs = (tabs: TranslatedProjectTab[], modules: ProjectModel['modules']) => {
  const customTabs: TranslatedProjectTab[] = []

  const addTab = (type: ProjectTabType) => {
    if (!getTab(tabs, type)) {
      customTabs.push({
        ...defaultTab(type),
        modules: {
          items: modules[type] || 0,
        },
      })
    }
  }

  Object.keys(PROJECT_TABS).forEach((type: ProjectTabType) => addTab(type))
  customTabs.push(...tabs)

  return sortBy(customTabs, ['order'])
}
