import {
  getGroup as fetchGetGroup,
  getGroupProject as fetchGetGroupProject,
} from '@/api/groups.service'
import { RefOrRaw } from '@/interfaces/utils'
import { GroupModel } from '@/models/group.model'
import { OrganizationModel } from '@/models/organization.model'

export const getGroup = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  groupId: RefOrRaw<GroupModel['id']>
) => {
  const { translateGroup } = useAutoTranslate()
  const key = computed(() => `group-${unref(groupId)}-projects`)

  return useAsyncAPI(key, () => fetchGetGroup(unref(organizationCode), unref(groupId)), {
    translate: translateGroup,
  })
}

export const getGroupProject = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  groupId: RefOrRaw<GroupModel['id']>,
  config = {}
) => {
  const { translateProjects } = useAutoTranslate()
  const key = computed(() => `group-${unref(groupId)}-projects`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) => fetchGetGroupProject(unref(organizationCode), unref(groupId), config),
    {
      translate: translateProjects,
      ...config,
    }
  )
}
