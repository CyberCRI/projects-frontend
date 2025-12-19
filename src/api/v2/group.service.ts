import {
  getGroup as fetchGetGroup,
  getGroupProject as fetchGetGroupProject,
  getHierarchyGroups as fetchGetHierarchyGroups,
  getGroupMember as fetchGetGroupMember,
} from '@/api/groups.service'
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
  groupSlug: RefOrRaw<GroupModel['name']>,
  config = {}
) => {
  const { translateGroup } = useAutoTranslate()
  const key = computed(() => `${organizationCode}::group::${unref(groupSlug)}`)

  return useAsyncAPI(
    key,
    () => fetchGetGroup(unref(organizationCode), unref(groupSlug), { ...DEFAULT_CONFIG }),
    {
      translate: translateGroup,
      ...config,
    }
  )
}

export const getHierarchyGroups = (organizationCode: RefOrRaw<OrganizationModel['code']>) => {
  const key = computed(() => `${organizationCode}::group::hierarchy`)

  return useAsyncAPI(key, () =>
    fetchGetHierarchyGroups(unref(organizationCode), { ...DEFAULT_CONFIG })
  )
}

export const getGroupProject = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  groupId: RefOrRaw<GroupModel['id']>,
  config = {}
) => {
  const { translateProjects } = useAutoTranslate()
  const key = computed(() => `${organizationCode}::group::${unref(groupId)}::projects`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchGetGroupProject(unref(organizationCode), unref(groupId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateProjects,
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
  const key = computed(() => `${organizationCode}::group::${unref(groupId)}::members`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchGetGroupMember(unref(organizationCode), unref(groupId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateUsers<TranslatedGroupMember>(data),
      ...config,
    }
  )
}
