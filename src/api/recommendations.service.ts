import type { APIParams } from '@/api/types'
import type { ProjectOutput } from '@/models/project.model'
import { _adaptParamsToGetQuery } from '@/api/utils.service'
import type { UserModel } from '@/models/user.model'
import useAPI, { getFormDataHeaders } from '@/composables/useAPI'

export interface RecommendationsParams {
    organization?: string // code
    params?: APIParams
}

export async function getProjectsRecommendationsForUser(orgCode: string, params: any) {
    return (
        await useAPI(`organization/${orgCode}/recommended-project/user/`, {
            params: _adaptParamsToGetQuery(params),
        })
    ).data
}

export async function getRandomProjectsRecommendationsForUser(body: RecommendationsParams) {
    return (
        await useAPI(`organization/${body.organization}/recommended-project/user/random/`, {
            params: _adaptParamsToGetQuery(body.params),
        })
    ).data
}

export async function getUsersRecommendationsForUser(orgCode: string, params: any) {
    return (
        await useAPI(`organization/${orgCode}/recommended-user/user/`, {
            params: _adaptParamsToGetQuery(params),
        })
    ).data
}

export async function getRandomUsersRecommendationsForUser(body) {
    return (
        await useAPI(`organization/${body.organization}/recommended-user/user/random/`, {
            params: _adaptParamsToGetQuery(body.params),
        })
    ).data
}
