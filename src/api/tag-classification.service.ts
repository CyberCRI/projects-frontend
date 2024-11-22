import { axios } from '@/api/api.config'
import { APIParams, APIResponseList } from '@/api/types'
import { TagModel } from '@/models/tag.model'

export async function getAllOrgClassifications(
    orgCode: string,
    params: APIParams
): Promise<APIResponseList<any>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/tag-classification/`,
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

export async function postOrgClassification(
    orgCode: string,
    classification: any // TODO: Add type
): Promise<APIResponseList<any>> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/tag-classification/`,
            classification
        )
    ).data
}

export async function putOrgClassification(
    orgCode: string,
    classificationId: number,
    classification: any // TODO: Add type
): Promise<APIResponseList<any>> {
    return (
        await axios.put(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/tag-classification/${classificationId}/`,
            classification
        )
    ).data
}

export async function patchOrgClassification(
    orgCode: string,
    classificationId: number,
    classification: any // TODO: Add type
): Promise<APIResponseList<any>> {
    return (
        await axios.patch(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/tag-classification/${classificationId}/`,
            classification
        )
    ).data
}

export async function deleteOrgClassification(
    orgCode: string,
    classificationId: number
): Promise<APIResponseList<any>> {
    return (
        await axios.delete(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/tag-classification/${classificationId}/`
        )
    ).data
}

export async function getOrgClassificationTags(
    orgCode: string,
    classificationId: number,
    params?: APIParams
): Promise<APIResponseList<any>> {
    return await axios.get(
        `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/tag-classification/${classificationId}/tag/`,
        { params }
    )
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

export async function putClassificationTag(
    orgCode: string,
    classificationId: number,
    tagtId: number,
    tag: TagModel
): Promise<APIResponseList<any>> {
    return (
        await axios.put(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/tag-classification/${classificationId}/tag/${tagtId}/`,
            tag
        )
    ).data
}

export async function patchClassificationTag(
    orgCode: string,
    classificationId: number,
    tagtId: number,
    tag: TagModel
): Promise<APIResponseList<any>> {
    return (
        await axios.patch(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/tag-classification/${classificationId}/tag/${tagtId}/`,
            tag
        )
    ).data
}

export async function deleteClassificationTag(
    orgCode: string,
    classificationId: number,
    tagtId: number
): Promise<APIResponseList<any>> {
    return (
        await axios.delete(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/tag-classification/${classificationId}/tag/${tagtId}/`
        )
    ).data
}

export async function postClassificationTag(
    orgCode: string,
    classificationId: number,
    tag: TagModel
): Promise<APIResponseList<any>> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/tag-classification/${classificationId}/tag/`,
            tag
        )
    ).data
}
