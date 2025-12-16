import { getGroupProject as fetchGetGroupProject } from '@/api/groups.service'
import { RefOrRaw } from '@/interfaces/utils'
import { GroupModel } from '@/models/group.model'
import { OrganizationModel } from '@/models/organization.model'

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
