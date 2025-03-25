import type { APIParams /*, APIResponseList*/ } from '@/api/types'
import type { TagCreateInput /*, TagOutput*/ } from '@/models/tag.model'
import useAPI from '@/composables/useAPI'

export interface TagParams extends APIParams {
  organization?: string // code
  project?: number // id
  search?: string
}

export async function createOrgTag(tag: TagCreateInput) {
  return await useAPI(`tag/`, {
    body: tag,
    method: 'POST',
  }) //.data.value
}

export async function getAllOrgTags(params: TagParams) {
  return await useAPI(`tag/`, { params }) //.data.value
}

export async function deleteOrgTag(tagId: number) {
  return await useAPI(`tag/${tagId}/`, {
    method: 'DELETE',
  })
}

export async function getOrgTag(id: number) {
  return await useAPI(`tag/${id}/`, {}) //.data.value
}
