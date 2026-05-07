import type {
  AttachmentFileId,
  AttachmentFileInput,
  AttachmentFileModel,
} from '~/models/attachment-file.model'

import type { AttachmentForm } from '~/models/attachment.model'
import type { ProjectSlugOrId } from '~/models/project.model'
import type { UseApiOptions } from '~/composables/useAPI'
import useAPI from '~/composables/useAPI'

type Config = UseApiOptions

export async function getAttachmentFiles(projectId: ProjectSlugOrId, config: Config = {}) {
  return await useAPI<PaginationResult<AttachmentFileModel>>(`project/${projectId}/file/`, config)
}

export async function getAttachmentFile(body: AttachmentFileInput) {
  return await useAPI<AttachmentFileModel>(`project/${body.project_id}/file/${body.file}`, {})
}

export async function postAttachmentFiles(projectId: ProjectSlugOrId, body: FormData) {
  // const fd = new FormData()
  // fd.append('description', body.description)
  // fd.append('title', body.title)
  // fd.append('project_id', body.project_id)

  // fd.append('file', body.file, body.file.name)
  // fd.append('mime', body.file.type || 'file')
  return await useAPI<AttachmentFileModel>(`project/${projectId}/file/`, {
    body,
    method: 'POST',
  })
}

export async function patchAttachmentFile(
  projectId: ProjectSlugOrId,
  fileId: AttachmentFileId,
  body: FormData
) {
  // const fd = new FormData()
  // fd.append('description', body.description)
  // fd.append('title', body.title)
  // fd.append('project_id', body.project_id)

  return await useAPI<AttachmentFileModel>(`project/${projectId}/file/${fileId}/`, {
    body,
    method: 'PATCH',
  })
}

export async function deleteAttachmentFile(projectId: ProjectSlugOrId, fileId: AttachmentFileId) {
  return await useAPI<undefined>(`project/${projectId}/file/${fileId}/`, { method: 'DELETE' })
}

// -- user
export function getUserAttachmentFile(userId: number, options) {
  return useAPI2<PaginationResult<AttachmentFileModel>>(`user/${userId}/file/`, options)
}

export async function postUserAttachmentFile(userId: number, data: AttachmentForm) {
  const body = new FormData()
  body.set('description', data.description)
  body.set('title', data.title)
  body.set('file', data.file, data.file.name)
  body.set('mime', data.file.type || 'file')

  return await useAPI<AttachmentFileModel>(`user/${userId}/file/`, { body, method: 'POST' })
}

export async function patchUserAttachmentFile(
  userId: number,
  fileId: number,
  data: Partial<AttachmentFileModel>
) {
  const body = new FormData()
  body.set('description', data.description)
  body.set('title', data.title)

  return await useAPI<AttachmentFileModel>(`user/${userId}/file/${fileId}/`, {
    body,
    method: 'PATCH',
  })
}

export async function deleteUserAttachmentFile(userId: number, fileId: number) {
  return await useAPI(`user/${userId}/file/${fileId}/`, { method: 'DELETE' })
}
