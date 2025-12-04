// import type { APIResponseList } from '@/api/types'

import type {
  AttachmentLinkInput /*, AttachmentLinkOutput*/,
  AttachmentLinkModel,
} from '@/models/attachment-link.model'

import useAPI from '@/composables/useAPI'

export async function getAttachmentLinks(id: string) {
  return await useAPI(`project/${id}/link/`, {}) //.data.value
}

export async function getAttachmentLink(body: AttachmentLinkInput) {
  return await useAPI(`project/${body.project_id}/link/${body.link_id}/`, {}) //.data.value
}

export async function postAttachmentLinks(body: AttachmentLinkInput) {
  return await useAPI(`project/${body.project_id}/link/`, { body, method: 'POST' }) //.data.value
}

export async function patchAttachmentLink(body: AttachmentLinkInput) {
  return await useAPI(`project/${body.project_id}/link/${body.id}/`, { body, method: 'PATCH' })
  //.data.value
}

export async function deleteAttachmentLink({ id, projectId }) {
  return await useAPI(`project/${projectId}/link/${id}/`, { method: 'DELETE' })
}

// --- user

export function getUserAttachmentLink(userId: number, options) {
  return useAPI2<PaginationResult<AttachmentLinkModel>>(`user/${userId}/link/`, options)
}

export async function postUserAttachmentLink(userId: number, body: AttachmentLinkModel) {
  return await useAPI<AttachmentLinkModel>(`user/${userId}/link/`, { body, method: 'POST' })
}

export async function patchUserAttachmentLink(
  userId: number,
  linkId: number,
  body: Partial<AttachmentLinkModel>
) {
  return await useAPI<AttachmentLinkModel>(`user/${userId}/link/${linkId}/`, {
    body,
    method: 'PATCH',
  })
}

export async function deleteUserAttachmentLink(userId: number, linkId: number) {
  return await useAPI(`user/${userId}/link/${linkId}/`, { method: 'DELETE' })
}
