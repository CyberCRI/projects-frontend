import { axios } from '@/api/api.config'
import { APIParams, APIResponseList } from '@/api/types'

export async function getAllOrgClassifications(
    orgCode: string,
    params: APIParams
): Promise<APIResponseList<any>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organizations/${orgCode}/tag-classification/`,
            { params }
        )
    ).data
}

export async function getOrgClassification(
    orgCode: string,
    classificationId: number,
    params: APIParams
): Promise<APIResponseList<any>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/tag-classification/${classificationId}/`,
            { params }
        )
    ).data
}

export async function getOrgClassificationTags(
    orgCode: string,
    classificationId: number,
    params?: APIParams
): Promise<APIResponseList<any>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/tag-classification/${classificationId}/tag/`,
            { params }
        )
    ).data
}

export async function getOrgClassificationAutocomplete(
    orgCode: string,
    classificationId: number,
    params?: APIParams
): Promise<APIResponseList<any>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/tag-classification/${classificationId}/tag/autocomplete/`,
            { params }
        )
    ).data
}

export async function getOrgTag(
    orgCode: string,
    tagId: number,
    params: APIParams
): Promise<APIResponseList<any>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/tag/${tagId}/`,
            { params }
        )
    ).data
}

export async function getTags(ids: number[], params?: APIParams): Promise<APIResponseList<any>> {
    return (
        await axios.get(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/tag/`, {
            ...params,
            ids: ids.join(','),
        } as any)
    ).data
}
