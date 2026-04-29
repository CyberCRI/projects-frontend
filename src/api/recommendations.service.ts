import { _adaptParamsToGetQuery } from '~/api/utils.service'
import type { APIParams, SearchParams } from '~/api/types'

import useAPI from '~/composables/useAPI'

export interface RecommendationsParams {
  organization?: string // code
  params?: APIParams
}

export async function getProjectsRecommendationsForUser(orgCode: string, params: any) {
  return await useAPI(`organization/${orgCode}/recommended-project/user/`, {
    ..._adaptParamsToGetQuery(params),
  })
}

export async function getRandomProjectsRecommendationsForUser(
  orgCode: string,
  params: SearchParams
) {
  return await useAPI(`organization/${orgCode}/recommended-project/user/random/`, {
    ..._adaptParamsToGetQuery(params),
  })
}

export async function getUsersRecommendationsForUser(orgCode: string, params: any) {
  return await useAPI(`organization/${orgCode}/recommended-user/user/`, {
    ..._adaptParamsToGetQuery(params),
  })
}

export async function getRandomUsersRecommendationsForUser(body) {
  return await useAPI(`organization/${body.organization}/recommended-user/user/random/`, {
    ..._adaptParamsToGetQuery(body.params),
  })
}
