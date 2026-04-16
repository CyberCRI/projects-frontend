import { getUserMentorship as fetchUserMentorship } from '@/api/mentorship.service'
import { onlyRefs } from '@/functs/onlyRefs'
import { RefOrRaw } from '@/interfaces/utils'
import { OrganizationModel } from '@/models/organization.model'

const DEFAULT_CONFIG = {}

export const getUserMentorship = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  config = {}
) => {
  const key = computed(() => `${unref(organizationCode)}::mentoring`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchUserMentorship(unref(organizationCode), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      watch: onlyRefs([organizationCode]),
      ...config,
    }
  )
}
