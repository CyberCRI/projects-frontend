import { searchPeopleAdmin as fetchSearchPeopleAdmin } from '@/api/people.service'
import { onlyRefs } from '@/functs/onlyRefs'
import { RefOrRaw } from '@/interfaces/utils'
import { OrganizationModel } from '@/models/organization.model'

const DEFAULT_CONFIG = {}

// TODO change backend with prefix organization code in url not in query
export const searchPeopleAdmin = (
  organizationId: RefOrRaw<OrganizationModel['id']>,
  config = {}
) => {
  const key = computed(() => `organizationId${unref(organizationId)}::admin::users`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchSearchPeopleAdmin(unref(organizationId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      watch: onlyRefs([organizationId]),
      ...config,
    }
  )
}
