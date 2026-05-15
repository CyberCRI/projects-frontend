import type { AttachmentFileModel } from '~/models/attachment-file.model'

import type { OrganizationModel } from '~/models/organization.model'
import type { UseApiOptions } from '~/composables/useAPI'
import useAPI from '~/composables/useAPI'

type Config = UseApiOptions
type ConfigPagiations = UseApiOptions<Partial<PaginationQuery>>

export async function getOrganizationFiles(
  organizationCode: string,
  config: ConfigPagiations = {}
) {
  return await useAPI<PaginationResult<AttachmentFileModel>>(
    `organization/${organizationCode}/file/`,
    config
  )
}

export async function getOrganizationFile(
  organizationCode: OrganizationModel['code'],
  attachmentId: AttachmentFileModel['id'],
  config: Config = {}
) {
  return await useAPI<AttachmentFileModel>(
    `organization/${organizationCode}/file/${attachmentId}`,
    config
  )
}

export async function postOrganizationFiles(
  organizationCode: OrganizationModel['code'],
  body: FormData
) {
  return await useAPI<AttachmentFileModel>(`organization/${organizationCode}/file/`, {
    body,
    method: 'POST',
  })
}

export async function patchOrganizationFile(
  organizationCode: OrganizationModel['code'],
  attachmentId: AttachmentFileModel['id'],
  body: FormData
) {
  return await useAPI<AttachmentFileModel>(
    `organization/${organizationCode}/file/${attachmentId}/`,
    {
      body,
      method: 'PATCH',
    }
  )
}

export async function deleteOrganizationFile(
  organizationCode: OrganizationModel['code'],
  attachmentId: AttachmentFileModel['id']
) {
  return await useAPI<undefined>(`organization/${organizationCode}/file/${attachmentId}/`, {
    method: 'DELETE',
  })
}
