import useAPI from '@/composables/useAPI'
import type { APIParams, APIResponseList } from '@/api/types'
import type { TagModel } from '@/models/tag.model'

export async function getAllOrgClassifications(orgCode: string, params: APIParams) {
    return (await useAPI(`/organization/${orgCode}/tag-classification/`, { params })).data
}

export async function getOrgClassification(
    orgCode: string,
    classificationId: number,
    params: APIParams
) {
    return (
        await useAPI(`/organization/${orgCode}/tag-classification/${classificationId}/`, { params })
    ).data
}

export async function postOrgClassification(
    orgCode: string,
    classification: any // TODO: Add type
) {
    return (
        await useAPI(`/organization/${orgCode}/tag-classification/`, {
            body: classification,
            method: 'POST',
        })
    ).data
}

export async function putOrgClassification(
    orgCode: string,
    classificationId: number,
    classification: any // TODO: Add type
) {
    return (
        await useAPI(`/organization/${orgCode}/tag-classification/${classificationId}/`, {
            body: classification,
            method: 'PUT',
        })
    ).data
}

export async function patchOrgClassification(
    orgCode: string,
    classificationId: number,
    classification: any // TODO: Add type
) {
    return (
        await useAPI(`/organization/${orgCode}/tag-classification/${classificationId}/`, {
            body: classification,
            method: 'PATCH',
        })
    ).data
}

export async function deleteOrgClassification(orgCode: string, classificationId: number) {
    return (
        await useAPI(`/organization/${orgCode}/tag-classification/${classificationId}/`, {
            method: 'DELETE',
        })
    ).data
}

export async function getOrgClassificationTags(
    orgCode: string,
    classificationId: number,
    params?: APIParams
) {
    return await useAPI(`/organization/${orgCode}/tag-classification/${classificationId}/tag/`, {
        params,
    })
}

export async function getOrgClassificationAutocomplete(
    orgCode: string,
    classificationId: number,
    params?: APIParams
) {
    return (
        await useAPI(
            `/organization/${orgCode}/tag-classification/${classificationId}/tag/autocomplete/`,
            { params }
        )
    ).data
}

export async function getOrgTag(orgCode: string, tagId: number, params: APIParams) {
    return (await useAPI(`/organization/${orgCode}/tag/${tagId}/`, { params })).data
}

export async function getTags(ids: number[], params?: APIParams) {
    return (
        await useAPI(`/tag/`, {
            params: {
                ...params,
                ids: ids.join(','),
            } as any,
        })
    ).data
}

export async function getAllTagsById(ids: number[], params?: APIParams) {
    return {
        count: -1,
        next: null,
        previous: null,
        results: await Promise.all(
            ids.map(
                async (id) =>
                    (
                        await useAPI(`/tag/${id}/`, {
                            params,
                        })
                    ).data
            )
        ),
    }
}

export async function putClassificationTag(
    orgCode: string,
    classificationId: number,
    tagtId: number,
    tag: TagModel
) {
    return (
        await useAPI(
            `/organization/${orgCode}/tag-classification/${classificationId}/tag/${tagtId}/`,
            { body: tag, method: 'PUT' }
        )
    ).data
}

export async function patchClassificationTag(
    orgCode: string,
    classificationId: number,
    tagtId: number,
    tag: TagModel
) {
    return (
        await useAPI(
            `/organization/${orgCode}/tag-classification/${classificationId}/tag/${tagtId}/`,
            { body: tag, method: 'PATCH' }
        )
    ).data
}

export async function deleteClassificationTag(
    orgCode: string,
    classificationId: number,
    tagtId: number
) {
    return (
        await useAPI(
            `/organization/${orgCode}/tag-classification/${classificationId}/tag/${tagtId}/`,
            { method: 'DELETE' }
        )
    ).data
}

export async function postClassificationTag(
    orgCode: string,
    classificationId: number,
    tag: TagModel
) {
    return (
        await useAPI(`/organization/${orgCode}/tag-classification/${classificationId}/tag/`, {
            body: tag,
            method: 'POST',
        })
    ).data
}
