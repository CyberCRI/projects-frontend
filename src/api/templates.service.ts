import type { TemplateId, TemplateModel } from '~/models/template.model'
import type { OrganizationModel } from '~/models/organization.model'

import type { UseApiOptions } from '~/composables/useAPI'
import useAPI from '~/composables/useAPI'

export function getTemplates(
  organizationCode: OrganizationModel['code'],
  config: UseApiOptions<PaginationQuery> = {}
) {
  return useAPI<PaginationResult<TemplateModel>>(
    `organization/${organizationCode}/template/`,
    config
  )
}

export function getTemplate(
  organizationCode: OrganizationModel['code'],
  templateId: TemplateId,
  config: UseApiOptions = {}
) {
  return useAPI<TemplateModel>(`organization/${organizationCode}/template/${templateId}/`, config)
}

export function deleteTemplate(
  organizationCode: OrganizationModel['code'],
  templateId: TemplateId
) {
  return useAPI<undefined>(`organization/${organizationCode}/template/${templateId}/`, {
    method: 'DELETE',
  })
}

export function postTemplate(organizationCode: OrganizationModel['code'], body: object) {
  return useAPI<TemplateModel>(`organization/${organizationCode}/template/`, {
    method: 'POST',
    body,
  })
}

export function postTemplateImage(
  organizationCode: OrganizationModel['code'],
  templateId: TemplateId,
  file: File
) {
  const body = new FormData()
  body.append('file', file, file.name)
  return useAPI(`organization/${organizationCode}/template/${templateId}/image/`, {
    body,
    method: 'POST',
  })
}

export function patchTemplate(
  organizationCode: OrganizationModel['code'],
  templateId: TemplateId,
  body: object
) {
  return useAPI(`organization/${organizationCode}/template/${templateId}/`, {
    method: 'PATCH',
    body,
  })
}
