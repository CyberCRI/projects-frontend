import { axios } from '@/api/api.config'
import { NewsfeedModel } from '@/models/newsfeed.model'
import { APIParams, APIResponseList } from '@/api/types'
import { _adaptParamsToGetQuery } from '@/api/utils.service'

export interface NewsfeedParams {
    org: string
    limit: Number
}

export async function getNewsfeed(
    org: string,
    params: APIParams
): Promise<APIResponseList<NewsfeedModel>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${org}/newsfeed/`,
            _adaptParamsToGetQuery(params)
        )
    ).data
}
