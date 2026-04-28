import {
  getProjectsRecommendationsForUser as fetchProjectsRecommendationsForUser,
  getRandomProjectsRecommendationsForUser as fetchRandomProjectsRecommendationsForUser,
  getUsersRecommendationsForUser as fetchUsersRecommendationsForUser,
  getRandomUsersRecommendationsForUser as fetchRandomUsersRecommendationsForUser,
} from '@/api/recommendations.service'
import type { UseAsyncApiConfig, UseAsyncPaginationApiConfig } from '@/api/v2/base.service'
import type { QueryFilterRecomendation } from '@/api/recommendations.service'
import type { OrganizationModel } from '@/models/organization.model'
import type { RefOrRaw } from '@/interfaces/utils'
import { onlyRefs } from '@/functs/onlyRefs'

const DEFAULT_CONFIG = {}

type Config = UseAsyncApiConfig<QueryFilterRecomendation>
type ConfigPagination = UseAsyncPaginationApiConfig<PaginationQuery>

export const getProjectsRecommendationsForUser = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  config: ConfigPagination = {}
) => {
  const { translateProjects } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::user-recomendations-projects`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchProjectsRecommendationsForUser(unref(organizationCode), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateProjects(data),
      watch: onlyRefs([organizationCode]),
      ...config,
    }
  )
}

export const getRandomProjectsRecommendationsForUser = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  config: Config = {}
) => {
  const { translateProjects } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::user-recomendations-projects-random`)

  return useAsyncAPI(
    key,
    ({ config }) =>
      fetchRandomProjectsRecommendationsForUser(unref(organizationCode), {
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

export const getUsersRecommendationsForUser = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  config: ConfigPagination = {}
) => {
  const { translateUsers } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::user-recomendations-users`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchUsersRecommendationsForUser(unref(organizationCode), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateUsers(data),
      watch: onlyRefs([organizationCode]),
      ...config,
    }
  )
}

export const getRandomUsersRecommendationsForUser = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  config: Config = {}
) => {
  const { translateUsers } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::user-recomendations-users-random`)

  return useAsyncAPI(
    key,
    ({ config }) =>
      fetchRandomUsersRecommendationsForUser(unref(organizationCode), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateUsers,
      watch: onlyRefs([organizationCode]),
      ...config,
    }
  )
}
