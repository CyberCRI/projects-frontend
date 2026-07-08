import {
  getFeaturedProjects as fetchFeaturedProjects,
  getOrganizations as fetchOrganizations,
} from 'shared-projects-frontend/apis'
import type { OrganizationModel } from 'shared-projects-frontend/models'
import type { UseAsyncPaginationApiConfig } from '@/api/v2/base.service'
import type { RefOrRaw } from '~/interfaces/utils'
import { onlyRefs } from '@/functs/onlyRefs'

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

export const getOrganizations = (config: ConfigPagination = {}) => {
  const { translateOrganizations } = useAutoTranslate()
  const key = computed(() => `organization-all`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchOrganizations({
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateOrganizations,
      ...config,
    }
  )
}
