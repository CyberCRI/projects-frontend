import { getOrganizationFiles as fetchOrganizationFiles } from 'shared-projects-frontend/apis'
import type { OrganizationModel } from 'shared-projects-frontend/models'
import type { UseAsyncPaginationApiConfig } from '@/api/v2/base.service'
import type { RefOrRaw } from '~/interfaces/utils'
import { onlyRefs } from '@/functs/onlyRefs'

const DEFAULT_CONFIG = {}

type ConfigPagination = UseAsyncPaginationApiConfig

export const getOrganizationFiles = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  config: ConfigPagination = {}
) => {
  const { translateFiles } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::resources::all`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchOrganizationFiles(unref(organizationCode), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateFiles(data),
      watch: onlyRefs([organizationCode]),
      ...config,
    }
  )
}
