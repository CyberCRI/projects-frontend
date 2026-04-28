import { UseAsyncApiConfig } from '@/api/v2/base.service'
import { onlyRefs } from '@/functs/onlyRefs'
import { RefOrRaw } from '@/interfaces/utils'
import { OrganizationModel } from '@/models/organization.model'
import {
  getProjectsRecommendationsForUser as fetchProjectsRecommendationsForUser,
  getRandomProjectsRecommendationsForUser as fetchRandomProjectsRecommendationsForUser,
  getUsersRecommendationsForUser as fetchUsersRecommendationsForUser,
  getRandomUsersRecommendationsForUser as fetchRandomUsersRecommendationsForUser,
  QueryFilterRecomendation,
} from '@/api/recommendations.service'

const DEFAULT_CONFIG = {}

type ConfigPagination = UseAsyncApiConfig<QueryFilterRecomendation>

export const getProjectsRecommendationsForUser = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  config: ConfigPagination = {}
) => {
  const { translateProjects } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::user-recomendations-projects`)

  return useAsyncAPI(
    key,
    ({ config }) =>
      fetchProjectsRecommendationsForUser(unref(organizationCode), {
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

export const getRandomProjectsRecommendationsForUser = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  config: ConfigPagination = {}
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

  return useAsyncAPI(
    key,
    ({ config }) =>
      fetchUsersRecommendationsForUser(unref(organizationCode), {
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

export const getRandomUsersRecommendationsForUser = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  config: ConfigPagination = {}
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
