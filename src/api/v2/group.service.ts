import {
  getGroup as fetchGetGroup,
  getGroupProject as fetchGetGroupProject,
  getHierarchyGroups as fetchGetHierarchyGroups,
  getGroupMember as fetchGetGroupMember,
} from '@/api/groups.service'
import { onlyRefs } from '@/functs/onlyRefs'
import { RefOrRaw } from '@/interfaces/utils'
import { GroupModel, TranslatedGroupMember } from '@/models/group.model'
import { OrganizationModel } from '@/models/organization.model'

const DEFAULT_CONFIG = {
  headers: {
    'Cache-Control': 'max-age=60',
  },
}

export const getGroup = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  groupId: RefOrRaw<GroupModel['id']>,
  config = {}
) => {
  const { translateGroup } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::group::${unref(groupId)}`)
  watch(key, () => console.log(`key`, key.value), { immediate: true })

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

export const getHierarchyGroups = (organizationCode: RefOrRaw<OrganizationModel['code']>) => {
  const key = computed(() => `${unref(organizationCode)}::group::hierarchy`)

  return useAsyncAPI(
    key,
    () => fetchGetHierarchyGroups(unref(organizationCode), { ...DEFAULT_CONFIG }),
    {
      watch: onlyRefs([organizationCode]),
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
  const { translateUsers } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::group::${unref(groupId)}::members`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchGetGroupMember(unref(organizationCode), unref(groupId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateUsers<TranslatedGroupMember>(data),
      watch: onlyRefs([organizationCode, groupId]),
      ...config,
    }
  )
}
