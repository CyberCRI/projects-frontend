import type { OrganizationModel } from '~/models/organization.model'

import type { RefOrRaw } from '~/interfaces/utils'

import type { UseAsyncPaginationApiConfig } from '~/api/v2/base.service'

import { getAllProjectCategories as fetchAllProjectCategories } from '~/api/project-categories.service'
import { onlyRefs } from '~/functs/onlyRefs'

const DEFAULT_CONFIG = {}

type ConfigPagination = UseAsyncPaginationApiConfig

// TODO change backend with prefix organization code in url not in query
export const getAllProjectCategories = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  config: ConfigPagination = {}
) => {
  const { translateCategories } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::category::all`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchAllProjectCategories(unref(organizationCode), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateCategories,
      watch: onlyRefs([organizationCode]),
      ...config,
    }
  )
}
