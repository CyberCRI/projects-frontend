import type {
  AttachmentLinkId,
  AttachmentLinkInput,
  AttachmentLinkModel,
} from '~/models/attachment-link.model'

import type { AttachmentForm } from '~/models/attachment.model'
import type { ProjectSlugOrId } from '~/models/project.model'
import type { UseApiOptions } from '~/composables/useAPI'
import useAPI from '~/composables/useAPI'

type Config = UseApiOptions<Partial<PaginationQuery>>

export async function getProjectAttachmentLinks(projectId: ProjectSlugOrId, config: Config = {}) {
  return await useAPI<PaginationResult<AttachmentLinkModel>>(`project/${projectId}/link/`, config)
}

export async function getProjectAttachmentLink(body: AttachmentLinkInput) {
  return await useAPI<AttachmentLinkModel>(`project/${body.project_id}/link/${body.link_id}/`, {})
}

export async function postProjectAttachmentLinks(projectId: ProjectSlugOrId, body: AttachmentForm) {
  return await useAPI<AttachmentLinkModel>(`project/${projectId}/link/`, {
    body,
    method: 'POST',
  })
}

export async function patchProjectAttachmentLink(
  projectId: ProjectSlugOrId,
  linkId: AttachmentLinkId,
  body: AttachmentForm
) {
  return await useAPI<AttachmentLinkModel>(`project/${projectId}/link/${linkId}/`, {
    body,
    method: 'PATCH',
  })
}

export async function deleteProjectAttachmentLink(
  projectId: ProjectSlugOrId,
  linkId: AttachmentLinkId
) {
  return await useAPI<undefined>(`project/${projectId}/link/${linkId}/`, { method: 'DELETE' })
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
