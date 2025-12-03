// import type { APIResponseList } from '@/api/types'

import type { AttachmentLinkInput /*, AttachmentLinkOutput*/ } from '@/models/attachment-link.model'

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

export async function getUserAttachmentLink(userId: number, options) {
  return await useAPI2(`user/${userId}/link/`, options)
}

export async function postUserAttachmentLink(userId: number, body) {
  return await useAPI(`user/${userId}/link/`, { body, method: 'POST' })
}

export async function patchUserAttachmentLink(userId: number, linkId: number, body) {
  return await useAPI(`user/${userId}/link/${linkId}/`, { body, method: 'PATCH' })
}

export async function deleteUserAttachmentLink(userId: number, linkId: number) {
  return await useAPI(`user/${userId}/link/${linkId}/`, { method: 'DELETE' })
}
