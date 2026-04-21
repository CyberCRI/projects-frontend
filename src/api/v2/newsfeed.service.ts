import { getNewsfeed as fetchNewsfeed } from '@/api/newsfeed.service'
import { UseAsyncPaginationApiConfig } from '@/api/v2/base.service'
import { onlyRefs } from '@/functs/onlyRefs'
import { RefOrRaw } from '@/interfaces/utils'
import { OrganizationModel } from '@/models/organization.model'

const DEFAULT_CONFIG = {}

type ConfigPagination = UseAsyncPaginationApiConfig

export const getNewsfeed = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  config: ConfigPagination = {}
) => {
  const { translateNewsfeed } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::newsfeed`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchNewsfeed(unref(organizationCode), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateNewsfeed(data),
      watch: onlyRefs([organizationCode]),
      ...config,
    }
  )
}
