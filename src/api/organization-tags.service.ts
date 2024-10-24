import { axios } from '@/api/api.config'
import { APIParams, APIResponseList } from '@/api/types'
import { TagCreateInput, TagOutput } from '@/models/tag.model'

export interface TagParams extends APIParams {
    organization?: string // code
    project?: number // id
    search?: string
}

export async function createOrgTag(tag: TagCreateInput): Promise<APIResponseList<TagOutput>> {
    return (await axios.post(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/tag/`, tag)).data
}

export async function getAllOrgTags(params: TagParams): Promise<APIResponseList<TagOutput>> {
    return (await axios.get(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/tag/`, { params }))
        .data
}

export async function deleteOrgTag(tagId: number): Promise<APIResponseList<TagOutput>> {
    return await axios.delete(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/tag/${tagId}/`)
}

export async function getOrgTag(id: number): Promise<TagOutput> {
    return (await axios.get(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/tag/${id}/`)).data
}
