import type { OrganizationModel } from '~/models/organization.model'

import type { RefOrRaw } from '~/interfaces/utils'

import { getUserMentorship as fetchUserMentorship } from '~/api/mentorship.service'
import type { UseAsyncPaginationApiConfig } from '~/api/v2/base.service'

import { onlyRefs } from '~/functs/onlyRefs'

const DEFAULT_CONFIG = {}

type ConfigPagination = UseAsyncPaginationApiConfig

export const getUserMentorship = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  config: ConfigPagination = {}
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
