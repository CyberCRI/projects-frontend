import { axios } from './api.config'
import { APIParams } from '@/api/types'
import { ProjectOutput } from '@/models/project.model'
import { _adaptParamsToGetQuery } from '@/api/utils.service'
import { UserModel } from '@/models/user.model'

export interface RecommendationsParams {
    organization?: string // code
    params?: APIParams
}

export async function getProjectsRecommendations(
    body: RecommendationsParams
): Promise<ProjectOutput[]> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${
                body.organization
            }/recommended-project/`,
            _adaptParamsToGetQuery(body.params)
        )
    ).data
}

export async function getUsersRecommendations(body): Promise<UserModel[]> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${
                body.organization
            }/recommended-user/`,
            _adaptParamsToGetQuery(body.params)
        )
    ).data
}