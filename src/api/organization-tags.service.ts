import { axios } from '@/api/api.config'
import { APIParams, APIResponseList } from '@/api/types'
import { OrganizationTagCreateInput, OrganizationTagOutput } from '@/models/organization-tag.model'

export interface TagParams extends APIParams {
    organization?: string // code
    project?: number // id
    search?: string
}

export async function createTag(
    tag: OrganizationTagCreateInput
): Promise<APIResponseList<OrganizationTagOutput>> {
    return (await axios.post(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/tag/`, tag)).data
}

export async function getAllTags(
    params: TagParams
): Promise<APIResponseList<OrganizationTagOutput>> {
    return (await axios.get(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/tag/`, { params }))
        .data
}

export async function deleteTag(tagId: number): Promise<APIResponseList<OrganizationTagOutput>> {
    return await axios.delete(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/tag/${tagId}/`)
}
