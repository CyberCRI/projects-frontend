import {
  getGroup as fetchGetGroup,
  getGroupProject as fetchGetGroupProject,
  getHierarchyGroups as fetchGetHierarchyGroups,
  getGroupMember as fetchGetGroupMember,
  getGroupSimilar as fetchGetGroupSimilar,
  getSubGroup as fetchGetSubGroup,
} from '@/api/groups.service'
import useAsyncAPI from '@/composables/useAsyncAPI'
import useAsyncPaginationAPI from '@/composables/useAsyncPaginationAPI'
import { onlyRefs } from '@/functs/onlyRefs'
import { RefOrRaw } from '@/interfaces/utils'
import { GroupModel } from '@/models/group.model'
import { OrganizationModel } from '@/models/organization.model'

const DEFAULT_CONFIG = {}

export const getGroup = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  groupId: RefOrRaw<GroupModel['id']>,
  config = {}
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
  config = {}
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
  groupId: RefOrRaw<GroupModel['id']>,
  config = {}
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
  groupId: RefOrRaw<GroupModel['id']>,
  config = {}
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
  groupId: RefOrRaw<GroupModel['id']>,
  config = {}
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
  groupId: RefOrRaw<GroupModel['id']>,
  config = {}
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
