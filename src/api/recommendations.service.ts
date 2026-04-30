import type { OrganizationModel } from '@/models/organization.model'
import type { ProjectModel } from '@/models/project.model'
import type { UserModel } from '@/models/user.model'
import useAPI from '@/composables/useAPI'

export type QueryFilterRecomendation = Partial<{
  count: number
  pool: number
}>

type Config = UseApiOptions<QueryFilterRecomendation>
type ConfigPagination = UseApiOptions<PaginationQuery>

// projects
export async function getProjectsRecommendationsForUser(
  organizationCode: OrganizationModel['code'],
  config: ConfigPagination = {}
) {
  return await useAPI<PaginationResult<ProjectModel>>(
    `organization/${organizationCode}/recommended-project/user/`,
    config
  )
}

export async function getRandomProjectsRecommendationsForUser(
  organizationCode: OrganizationModel['code'],
  config: Config = {}
) {
  return await useAPI<ProjectModel[]>(
    `organization/${organizationCode}/recommended-project/user/random/`,
    config
  )
}

// users
export async function getUsersRecommendationsForUser(
  organizationCode: OrganizationModel['code'],
  config: ConfigPagination = {}
) {
  return await useAPI<PaginationResult<UserModel>>(
    `organization/${organizationCode}/recommended-user/user/`,
    config
  )
}

export async function getRandomUsersRecommendationsForUser(
  organizationCode: OrganizationModel['code'],
  config: Config = {}
) {
  return await useAPI<UserModel[]>(
    `organization/${organizationCode}/recommended-user/user/random/`,
    config
  )
}
