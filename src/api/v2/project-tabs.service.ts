import type { OrganizationModel } from '~/models/organization.model'

import type { RefOrRaw } from '~/interfaces/utils'

import type { UseAsyncApiConfig, UseAsyncPaginationApiConfig } from '~/api/v2/base.service'

import {
  getAllProjectTab as fetchAllProjectTab,
  getProjectTab as fetchProjectTab,
  getAllProjectTabItem as fetchAllProjectTabItem,
  getProjectTabItem as fetchProjectTabItem,
} from '~/api/project-tabs.service'
import type { ProjectTab, ProjectTabItem } from '~/models/projects-tabs.model'
import type { ProjectSlugOrId } from '~/models/project.model'
import { onlyRefs } from '~/functs/onlyRefs'

const DEFAULT_CONFIG = {}

type Config = UseAsyncApiConfig
type ConfigPagiation = UseAsyncPaginationApiConfig

// TODO change backend with prefix organization code in url not in query
export const getAllProjectTab = (
  organization: RefOrRaw<OrganizationModel['code']>,
  projectSlugOrId: RefOrRaw<ProjectSlugOrId>,
  config: ConfigPagiation = {}
) => {
  const key = computed(() => `${unref(organization)}::project::${unref(projectSlugOrId)}::tab::all`)

  const { translateProjectTabs } = useAutoTranslate()

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchAllProjectTab(unref(projectSlugOrId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateProjectTabs,
      watch: onlyRefs([organization, projectSlugOrId]),
      keyFixed: true,
      ...config,
    }
  )
}

export const getProjectTab = (
  organization: RefOrRaw<OrganizationModel['code']>,
  projectSlugOrId: RefOrRaw<ProjectSlugOrId>,
  projectTabId: RefOrRaw<ProjectTab['id']>,
  config: Config = {}
) => {
  const key = computed(
    () => `${unref(organization)}::project::${unref(projectSlugOrId)}::tab::${unref(projectTabId)}`
  )

  const { translateProjectTab } = useAutoTranslate()

  return useAsyncAPI(
    key,
    ({ config }) =>
      fetchProjectTab(unref(projectSlugOrId), unref(projectTabId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateProjectTab,
      watch: onlyRefs([organization, projectSlugOrId, projectTabId]),
      ...config,
    }
  )
}

// tab items

export const getAllProjectTabItem = (
  organization: RefOrRaw<OrganizationModel['code']>,
  projectSlugOrId: RefOrRaw<ProjectSlugOrId>,
  projectTabId: RefOrRaw<ProjectTab['id']>,
  config: ConfigPagiation = {}
) => {
  const key = computed(
    () =>
      `${unref(organization)}::project::${unref(projectSlugOrId)}::tab::${unref(projectTabId)}:all`
  )

  const { translateProjectTabItems } = useAutoTranslate()

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchAllProjectTabItem(unref(projectSlugOrId), unref(projectTabId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateProjectTabItems,
      watch: onlyRefs([organization, projectSlugOrId, projectTabId]),
      keyFixed: true,
      ...config,
    }
  )
}

export const getProjectTabItem = (
  organization: RefOrRaw<OrganizationModel['code']>,
  projectSlugOrId: RefOrRaw<ProjectSlugOrId>,
  projectTabId: RefOrRaw<ProjectTab['id']>,
  projectTabItemId: RefOrRaw<ProjectTabItem['id']>,
  config: Config = {}
) => {
  const key = computed(
    () =>
      `${unref(organization)}::project::${unref(projectSlugOrId)}::tab::${unref(projectTabId)}::${unref(projectTabItemId)}`
  )

  const { translateProjectTabItem } = useAutoTranslate()

  return useAsyncAPI(
    key,
    ({ config }) =>
      fetchProjectTabItem(unref(projectSlugOrId), unref(projectTabId), unref(projectTabItemId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateProjectTabItem,
      watch: onlyRefs([organization, projectSlugOrId, projectTabId, projectTabItemId]),
      ...config,
    }
  )
}
