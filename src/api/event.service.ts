import { axios } from '@/api/api.config'
import { APIResponseList } from '@/api/types'
import { EventModel, EventInput, EventOutput } from '@/models/event.model'
import { _adaptParamsToGetQuery } from '@/api/utils.service'

export async function getAllEvents(
    orgCode: string,
    params: any
): Promise<APIResponseList<EventModel>> {
    const adaptedParams = params ? _adaptParamsToGetQuery(params) : null
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/event/`,
            adaptedParams
        )
    ).data
}

export async function getEvent(
    orgCode: string,
    idOrSlug: number | string
): Promise<APIResponseList<EventModel>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/event/${idOrSlug}/`
        )
    ).data
}

export async function createEvent(
    orgCode: string,
    body: EventInput
): Promise<APIResponseList<EventModel>> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/event/`,
            body
        )
    ).data
}

export async function putEvent(
    orgCode: string,
    idOrSlug: number | string,
    body: EventInput
): Promise<EventOutput> {
    return (
        await axios.put(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/event/${idOrSlug}/`,
            body
        )
    ).data
}

export async function patchEvent(
    orgCode: string,
    idOrSlug: number | string,
    body: EventInput
): Promise<EventOutput> {
    return (
        await axios.patch(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/event/${idOrSlug}/`,
            body
        )
    ).data
}

export async function deleteEvent(
    orgCode: string,
    idOrSlug: number | string
): Promise<EventOutput> {
    return (
        await axios.delete(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/event/${idOrSlug}/`
        )
    ).data
}
