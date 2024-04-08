import { axios, configFormData } from '@/api/api.config'
import { APIResponseList } from '@/api/types'
import { NewsModel, NewsInput, NewsOutput, NewsHeaderOutput } from '@/models/news.model'
import { _adaptParamsToGetQuery } from '@/api/utils.service'

export async function getAllNews(
    orgCode: string,
    params: any
): Promise<APIResponseList<NewsModel>> {
    const adaptedParams = params ? _adaptParamsToGetQuery(params) : null
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/news/`,
            adaptedParams
        )
    ).data
}

export async function getNews(
    orgCode: string,
    idOrSlug: number | string
): Promise<APIResponseList<NewsModel>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/news/${idOrSlug}/`
        )
    ).data
}

export async function createNews(
    orgCode: string,
    body: NewsInput
): Promise<APIResponseList<NewsModel>> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/news/`,
            body
        )
    ).data
}

export async function putNews(
    orgCode: string,
    idOrSlug: number | string,
    body: NewsInput
): Promise<NewsOutput> {
    return (
        await axios.put(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/news/${idOrSlug}/`,
            body
        )
    ).data
}

export async function patchNews(
    orgCode: string,
    idOrSlug: number | string,
    body: NewsInput
): Promise<NewsOutput> {
    return (
        await axios.patch(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/news/${idOrSlug}/`,
            body
        )
    ).data
}

export async function deleteNews(orgCode: string, idOrSlug: number | string): Promise<NewsOutput> {
    return (
        await axios.delete(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/news/${idOrSlug}/`
        )
    ).data
}

export async function postNewsHeader(
    orgCode: string,
    idOrSlug: number | string,
    body
): Promise<NewsHeaderOutput> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/news/${idOrSlug}/header/`,
            body,
            configFormData
        )
    ).data
}

export async function patchNewsHeader(
    orgCode: string,
    idOrSlug: number | string,
    image_id,
    body
): Promise<NewsHeaderOutput> {
    return (
        await axios.patch(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${orgCode}/news/${idOrSlug}/header/${image_id}/`,
            body,
            configFormData
        )
    ).data
}
