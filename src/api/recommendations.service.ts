import type { APIParams } from '@/api/types'
// import type { ProjectOutput } from '@/models/project.model'
import { _adaptParamsToGetQuery } from '@/api/utils.service'
// import type { UserModel } from '@/models/user.model'
import useAPI from '@/composables/useAPI'

export interface RecommendationsParams {
  organization?: string // code
  params?: APIParams
}

export async function getProjectsRecommendationsForUser(orgCode: string, params: any) {
  return await useAPI(`organization/${orgCode}/recommended-project/user/`, {
    ..._adaptParamsToGetQuery(params),
  }) //.data.value
}

export async function getRandomProjectsRecommendationsForUser(body: RecommendationsParams) {
  return await useAPI(`organization/${body.organization}/recommended-project/user/random/`, {
    ..._adaptParamsToGetQuery(body.params),
  }) //.data.value
}

export async function getUsersRecommendationsForUser(orgCode: string, params: any) {
  return await useAPI(`organization/${orgCode}/recommended-user/user/`, {
    ..._adaptParamsToGetQuery(params),
  }) //.data.value
}

export async function getRandomUsersRecommendationsForUser(body) {
  return await useAPI(`organization/${body.organization}/recommended-user/user/random/`, {
    ..._adaptParamsToGetQuery(body.params),
  }) //.data.value
}
