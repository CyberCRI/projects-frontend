import { axios } from './api.config'
import { APIParams } from '@/api/types'
import { ProjectOutput } from '@/models/project.model'
import { _adaptParamsToGetQuery } from '@/api/utils.service'
import { UserModel } from '@/models/user.model'

export interface RecommendationsParams {
    organization?: string // code
    params?: APIParams
}

export async function getProjectsRecommendationsForUser(
    orgCode: string,
    params: any
): Promise<ProjectOutput[]> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/recommended-project/user/`,
            _adaptParamsToGetQuery(params)
        )
    ).data
}

export async function getRandomProjectsRecommendationsForUser(
    body: RecommendationsParams
): Promise<ProjectOutput[]> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${
                body.organization
            }/recommended-project/user/random/`,
            _adaptParamsToGetQuery(body.params)
        )
    ).data
}

export async function getUsersRecommendationsForUser(
    orgCode: string,
    params: any
): Promise<UserModel[]> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/recommended-user/user/`,
            _adaptParamsToGetQuery(params)
        )
    ).data
}

export async function getRandomUsersRecommendationsForUser(body): Promise<UserModel[]> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${
                body.organization
            }/recommended-user/user/random/`,
            _adaptParamsToGetQuery(body.params)
        )
    ).data
}
