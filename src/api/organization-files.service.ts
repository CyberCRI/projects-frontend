// import type { APIResponseList } from '@/api/types'

import type { AttachmentFileInput } from '@/models/attachment-file.model'

import useAPI from '@/composables/useAPI'

export async function getOrganizationFiles(orgCode: string) {
  return await useAPI(`organization/${orgCode}/file/`, {}) //.data.value
}

export async function getOrganizationFile(orgCode: string, body: AttachmentFileInput) {
  return await useAPI(`organization/${orgCode}/file/${body.file}`, {}) //.data.value
}

export async function postOrganizationFiles(orgCode: string, body: AttachmentFileInput) {
  const fd = new FormData()
  fd.append('description', body.description)
  fd.append('title', body.title)
  fd.append('project_id', body.project_id)

  fd.append('file', body.file, body.file.name)
  fd.append('mime', body.file.type || 'file')
  return await useAPI(`organization/${orgCode}/file/`, {
    body: fd,
    method: 'POST',
  }) //.data.value
}

export async function patchOrganizationFile(orgCode: string, body: AttachmentFileInput) {
  const fd = new FormData()
  fd.append('description', body.description)
  fd.append('title', body.title)
  fd.append('project_id', body.project_id)

  return await useAPI(`organization/${orgCode}/file/${body.id}/`, {
    // headers,
    body: fd,
    method: 'PATCH',
  }) //.data.value
}

export async function deleteOrganizationFile(orgCode: string, id) {
  return await useAPI(`organization/${orgCode}/file/${id}/`, { method: 'DELETE' })
}
