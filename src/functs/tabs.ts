import type {
  Language,
  ProjectModel,
  ProjectTab,
  ProjectTabType,
  TemplateTab,
  TemplateTabForm,
  TranslatedProjectTab,
  TranslatedTemplate,
} from 'shared-projects-frontend/models'
import {
  DEFAULT_PROJECT_TABS_ORDER,
  PROJECT_MODULE_ICON,
  PROJECT_MODULE_TITLE,
  PROJECT_TABS,
} from '~/functs/constants'
import { translateProjectTab } from 'shared-projects-frontend/translate'
import { getFirstTextNotEmpty, textIsEmpty } from '~/functs/tiptap'
import { defaultProjectTabForm } from '~/form/project-tabs'
import { defaultTemplateTabForm } from '~/form/template'
import { omit, sortBy } from 'es-toolkit'

// check if tabtyp is a custom tab (not projectTab "fixed")
export const isCustomTab = (type: ProjectTabType) => {
  const types: ProjectTabType[] = ['text', 'blog']
  return types.includes(type)
}

// check if tab have templates prefix
export const tabHaveTemplate = (type: ProjectTabType) => {
  const types: ProjectTabType[] = ['text', 'blog', 'blogs', 'goals', 'description', 'comments']
  return types.includes(type)
}

export const tabHaveTemplateTitle = (type: ProjectTabType) => {
  const types: ProjectTabType[] = ['text', 'blog', 'blogs', 'goals']
  return types.includes(type)
}

export const defaultTab = (key: ProjectTab['type'], locale: Language = null) => {
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
    locale
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

export const sanitizeTabs = (
  tabs: TranslatedProjectTab[],
  modules: ProjectModel['modules'],
  locale: Language = null,
  projectDescription: string | null = null
) => {
  const customTabs: TranslatedProjectTab[] = []

  const addTab = (type: ProjectTabType) => {
    if (!getTab(tabs, type)) {
      customTabs.push({
        ...defaultTab(type, locale),
        modules: {
          items: modules[type] || 0,
        },
      })
    }
  }

  Object.keys(PROJECT_TABS).forEach((type: ProjectTabType) => addTab(type))
  customTabs.push(...tabs)

  // this is a fix to set number items for descriptions projects (need change to backend)
  customTabs.forEach((tab) => {
    if (tab.type === 'description') {
      tab.modules.items = textIsEmpty(projectDescription) ? 0 : 1
    }
  })

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

export const sanitizeTabsTemplate = (tabs: TemplateTabForm[], locale: Language = null) => {
  const customTabs: TemplateTabForm[] = []

  const addTab = (type: ProjectTabType) => {
    if (!getTab(tabs, type)) {
      customTabs.push({
        ...defaultTemplateTabForm(),
        ...omit(defaultTab(type, locale), ['$t', 'project']),
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

export const getTemplateType = (
  tabType: ProjectTabType,
  template: TranslatedTemplate | null
): Pick<TemplateTab, 'content_item' | 'title_item'> => {
  const base = { title_item: '', content_item: '' }

  if (template) {
    if (tabType === 'goals') {
      base.title_item = template.goal_title
      base.content_item = template.goal_description
    } else if (tabType === 'comments') {
      base.content_item = template.comment_content
    } else if (tabType === 'blogs') {
      base.title_item = template.blogentry_title
      base.content_item = template.blogentry_content
    } else if (tabType === 'description') {
      base.content_item = template.project_description
    }

    const findedTab = template?.tabs?.find((tabTemplate) => tabTemplate.type === tabType)
    if (findedTab) {
      return {
        title_item: getFirstTextNotEmpty([findedTab.title_item, base.title_item]) || '',
        content_item: getFirstTextNotEmpty([findedTab.content_item, base.content_item]) || '',
      }
    }
  }
  return { title_item: '', content_item: '' }
}

export const getTemplateUUID = (
  tabUUID: TranslatedProjectTab['uuid'],
  template: TranslatedTemplate | null
): Pick<TemplateTab, 'content_item' | 'title_item'> => {
  if (template) {
    const findedTab = template?.tabs?.find((tabTemplate) => tabTemplate.uuid === tabUUID)
    if (findedTab) {
      return {
        title_item: findedTab.title_item,
        content_item: findedTab.content_item,
      }
    }
  }
  return { title_item: '', content_item: '' }
}
