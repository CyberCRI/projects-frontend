import type { OrganizationModel } from 'shared-projects-frontend/models'

import type { RefOrRaw } from '~/interfaces/utils'

import { searchUserAdmin as fetchsearchUserAdmin } from 'shared-projects-frontend/apis'
import type { UseAsyncPaginationApiConfig } from '~/api/v2/base.service'

import { onlyRefs } from '~/functs/onlyRefs'

const DEFAULT_CONFIG = {}

type ConfigPagination = UseAsyncPaginationApiConfig

// TODO change backend with prefix organization code in url not in query
export const searchUserAdmin = (
  organizationId: RefOrRaw<OrganizationModel['id']>,
  config: ConfigPagination = {}
) => {
  const key = computed(() => `organizationId${unref(organizationId)}::admin::users`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchsearchUserAdmin(unref(organizationId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      watch: onlyRefs([organizationId]),
      ...config,
    }
  )
}
