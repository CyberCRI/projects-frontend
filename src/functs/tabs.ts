import type {
  ProjectModel,
  ProjectTab,
  ProjectTabType,
  TemplateTabForm,
  TranslatedProjectTab,
} from 'shared-projects-frontend/models'
import {
  DEFAULT_PROJECT_TABS_ORDER,
  PROJECT_MODULE_ICON,
  PROJECT_MODULE_TITLE,
  PROJECT_TABS,
} from '~/functs/constants'
import { translateProjectTab } from 'shared-projects-frontend/translate'
import { defaultProjectTabForm } from '~/form/project-tabs'
import { defaultTemplateTabForm } from '~/form/template'
import { omit, sortBy } from 'es-toolkit'

// check if tabtyp is a custom tab (not projectTab "fixed")
export const isCustomTab = (type: ProjectTabType) => {
  if (type === 'text' || type === 'blog') {
    return false
  }
  return true
}

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
      order: DEFAULT_PROJECT_TABS_ORDER.findIndex((type) => type === key),
      slug: '',
      uuid: null,
      modules: {
        items: 0,
      },
    },
    'en'
  )
}

export const getTab = <T extends { id?: ProjectTab['id']; type?: ProjectTab['type'] }>(
  tabs: T[],
  key: ProjectTab['id'] | ProjectTab['type']
): T => {
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

  return sortBy(customTabs, [
    'order',
    (tab) => {
      if (isCustomTab(tab.type)) {
        // @ts-expect-error ignore tab.type is filtered in isCustomTab
        return DEFAULT_PROJECT_TABS_ORDER.indexOf(tab.type)
      }
      return tab.$t.title
    },
  ])
}

export const sanitizeTabsTemplate = (tabs: TemplateTabForm[]) => {
  const customTabs: TemplateTabForm[] = []

  const addTab = (type: ProjectTabType) => {
    if (!getTab(tabs, type)) {
      customTabs.push({
        ...defaultTemplateTabForm(),
        ...omit(defaultTab(type), ['$t', 'project']),
      })
    }
  }

  Object.keys(PROJECT_TABS).forEach((type: ProjectTabType) => addTab(type))
  customTabs.push(...tabs)

  return sortBy(customTabs, [
    'order',
    (tab) => {
      if (isCustomTab(tab.type)) {
        // @ts-expect-error ignore tab.type is filtered in isCustomTab
        return DEFAULT_PROJECT_TABS_ORDER.indexOf(tab.type)
      }
      return tab.title
    },
  ])
}
