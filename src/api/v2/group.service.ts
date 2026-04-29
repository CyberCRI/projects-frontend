import type { OrganizationModel } from '~/models/organization.model'
import type { PeopleGroupIdOrSlug } from '~/models/invitation.model'

import type { RefOrRaw } from '~/interfaces/utils'

import {
  getGroup as fetchGetGroup,
  getGroupMember as fetchGetGroupMember,
  getGroupProject as fetchGetGroupProject,
  getGroupSimilar as fetchGetGroupSimilar,
  getHierarchyGroups as fetchGetHierarchyGroups,
  getSubGroup as fetchGetSubGroup,
  getGroupAllLocations as fetchGroupAllLocations,
  getGroupEvent as fetchGroupEvent,
  getGroupGallery as fetchGroupGallery,
  getGroupNews as fetchGroupNews,
} from '~/api/groups.service'
import type { UseAsyncApiConfig, UseAsyncPaginationApiConfig } from '~/api/v2/base.service'

import useAsyncPaginationAPI from '~/composables/useAsyncPaginationAPI'
import useAsyncAPI from '~/composables/useAsyncAPI'

import { onlyRefs } from '~/functs/onlyRefs'

const DEFAULT_CONFIG = {}

type Config = UseAsyncApiConfig
type ConfigPagination = UseAsyncPaginationApiConfig

export const getGroup = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  groupId: RefOrRaw<PeopleGroupIdOrSlug>,
  config: Config = {}
) => {
  const { translateGroup } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::group::${unref(groupId)}`)

  return useAsyncAPI(
    key,
    () => fetchGetGroup(unref(organizationCode), unref(groupId), { ...DEFAULT_CONFIG }),
    {
      translate: translateGroup,
      watch: onlyRefs([organizationCode, groupId]),
      ...config,
    }
  )
}

export const getHierarchyGroups = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  config: Config = {}
) => {
  const { translateGroup } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::hierarchy-groups`)

  return useAsyncAPI(
    key,
    ({ config }) =>
      fetchGetHierarchyGroups(unref(organizationCode), { ...DEFAULT_CONFIG, ...config }),
    {
      translate: translateGroup,
      watch: onlyRefs([organizationCode]),
      ...config,
    }
  )
}

export const getGroupProject = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  groupId: RefOrRaw<PeopleGroupIdOrSlug>,
  config: ConfigPagination = {}
) => {
  const { translateProjects } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::group::${unref(groupId)}::projects`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchGetGroupProject(unref(organizationCode), unref(groupId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateProjects,
      watch: onlyRefs([organizationCode, groupId]),
      ...config,
    }
  )
}

export const getGroupMember = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  groupId: RefOrRaw<PeopleGroupIdOrSlug>,
  config: ConfigPagination = {}
) => {
  const key = computed(() => `${unref(organizationCode)}::group::${unref(groupId)}::members`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchGetGroupMember(unref(organizationCode), unref(groupId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      watch: onlyRefs([organizationCode, groupId]),
      ...config,
    }
  )
}

export const getGroupSimilar = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  groupId: RefOrRaw<PeopleGroupIdOrSlug>,
  config: ConfigPagination = {}
) => {
  const { translateGroups } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::group::${unref(groupId)}::similars`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchGetGroupSimilar(unref(organizationCode), unref(groupId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateGroups,
      watch: onlyRefs([organizationCode, groupId]),
      ...config,
    }
  )
}

export const getSubGroup = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  groupId: RefOrRaw<PeopleGroupIdOrSlug>,
  config: ConfigPagination = {}
) => {
  const { translateGroups } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::group::${unref(groupId)}::subgroup`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchGetSubGroup(unref(organizationCode), unref(groupId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateGroups,
      watch: onlyRefs([organizationCode, groupId]),
      ...config,
    }
  )
}

export const getGroupAllLocations = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  groupId: RefOrRaw<PeopleGroupIdOrSlug>,
  config: Config = {}
) => {
  const { translateProjectLocations } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::group::${unref(groupId)}::locations`)

  return useAsyncAPI(
    key,
    ({ config }) =>
      fetchGroupAllLocations(unref(organizationCode), unref(groupId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateProjectLocations,
      watch: onlyRefs([organizationCode, groupId]),
      ...config,
    }
  )
}

export const getGroupGallery = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  groupId: RefOrRaw<PeopleGroupIdOrSlug>,
  config: ConfigPagination = {}
) => {
  const key = computed(() => `${unref(organizationCode)}::group::${unref(groupId)}::gallery`)

  return useAsyncPaginationAPI(
    key,
    async ({ config }) => {
      return fetchGroupGallery(unref(organizationCode), unref(groupId), {
        ...DEFAULT_CONFIG,
        ...config,
      })
    },
    {
      watch: onlyRefs([organizationCode, groupId]),
      ...config,
    }
  )
}

export const getGroupNews = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  groupId: RefOrRaw<PeopleGroupIdOrSlug>,
  config: ConfigPagination = {}
) => {
  const key = computed(() => `${unref(organizationCode)}::group::${unref(groupId)}::news`)

  const { translateNews } = useAutoTranslate()

  return useAsyncPaginationAPI(
    key,
    async ({ config }) => {
      return fetchGroupNews(unref(organizationCode), unref(groupId), {
        ...DEFAULT_CONFIG,
        ...config,
      })
    },
    {
      watch: onlyRefs([organizationCode, groupId]),
      translate: translateNews,
      ...config,
    }
  )
}

export const getGroupEvent = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  groupId: RefOrRaw<PeopleGroupIdOrSlug>,
  config: ConfigPagination = {}
) => {
  const key = computed(() => `${unref(organizationCode)}::group::${unref(groupId)}::event`)

  const { translateEvents } = useAutoTranslate()

  return useAsyncPaginationAPI(
    key,
    async ({ config }) => {
      return fetchGroupEvent(unref(organizationCode), unref(groupId), {
        ...DEFAULT_CONFIG,
        ...config,
      })
    },
    {
      watch: onlyRefs([organizationCode, groupId]),
      translate: translateEvents,
      ...config,
    }
  )
}
