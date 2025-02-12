// import type { APIResponseList } from '@/api/types'
import type {
    /*NewsModel, */ NewsInput /*, NewsOutput, NewsHeaderOutput*/,
} from '@/models/news.model'
import { _adaptParamsToGetQuery } from '@/api/utils.service'
import useAPI, { getFormDataHeaders } from '@/composables/useAPI'

export async function getAllNews(orgCode: string, params: any) {
    const adaptedParams = params ? _adaptParamsToGetQuery(params) : {}
    return await useAPI(`organization/${orgCode}/news/`, { ...adaptedParams }) //.data.value
}

export async function getNews(orgCode: string, idOrSlug: number | string) {
    return await useAPI(`organization/${orgCode}/news/${idOrSlug}/`, {}) //.data.value
}

export async function createNews(orgCode: string, body: NewsInput) {
    return await useAPI(`organization/${orgCode}/news/`, { body, method: 'POST' }) //.data.value
}

export async function putNews(orgCode: string, idOrSlug: number | string, body: NewsInput) {
    return (await useAPI(`organization/${orgCode}/news/${idOrSlug}/`, { body, method: 'PUT' })).data
        .value
}

export async function patchNews(orgCode: string, idOrSlug: number | string, body: NewsInput) {
    return await useAPI(`organization/${orgCode}/news/${idOrSlug}/`, { body, method: 'PATCH' })
    //.data.value
}

export async function deleteNews(orgCode: string, idOrSlug: number | string) {
    return (await useAPI(`organization/${orgCode}/news/${idOrSlug}/`, { method: 'DELETE' })).data
        .value
}

export async function postNewsHeader(orgCode: string, idOrSlug: number | string, body) {
    return await useAPI(`organization/${orgCode}/news/${idOrSlug}/header/`, {
        body,
        method: 'POST',
        ...getFormDataHeaders(),
    }) //.data.value
}

export async function patchNewsHeader(orgCode: string, idOrSlug: number | string, image_id, body) {
    return await useAPI(`organization/${orgCode}/news/${idOrSlug}/header/${image_id}/`, {
        body,
        method: 'PATCH',
        ...getFormDataHeaders(),
    }) //.data.value
}
