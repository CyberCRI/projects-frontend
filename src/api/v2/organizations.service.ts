import { UseAsyncPaginationApiConfig } from '@/api/v2/base.service'
import { onlyRefs } from '@/functs/onlyRefs'
import { RefOrRaw } from '@/interfaces/utils'
import { OrganizationModel } from '@/models/organization.model'
import { getFeaturedProjects as fetchFeaturedProjects } from '@/api/organizations.service'

const DEFAULT_CONFIG = {}

type ConfigPagination = UseAsyncPaginationApiConfig

export const getFeaturedProjects = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  config: ConfigPagination = {}
) => {
  const { translateProjects } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::projects-featured`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchFeaturedProjects(unref(organizationCode), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateProjects,
      watch: onlyRefs([organizationCode]),
      ...config,
    }
  )
}
