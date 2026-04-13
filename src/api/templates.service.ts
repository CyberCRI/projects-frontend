import useAPI from '@/composables/useAPI'
import useAPI2 from '@/composables/useAPI2'
import { OrganizationModel } from '@/models/organization.model'
import { TemplateModel } from '@/models/template.model'

export function getTemplates(organizationCode: OrganizationModel['code']) {
  return useAPI2<PaginationResult<TemplateModel>>(`organization/${organizationCode}/template/`)
}

export function getTemplate(
  organizationCode: OrganizationModel['code'],
  templateId: number | string
) {
  return useAPI2<TemplateModel>(`organization/${organizationCode}/template/${templateId}/`)
}

export function deleteTemplate(
  organizationCode: OrganizationModel['code'],
  templateId: number | string
) {
  return useAPI(`organization/${organizationCode}/template/${templateId}/`, { method: 'DELETE' })
}

export function postTemplate(organizationCode: OrganizationModel['code'], body: object) {
  return useAPI(`organization/${organizationCode}/template/`, { method: 'POST', body })
}

export function postTemplateImage(
  organizationCode: OrganizationModel['code'],
  templateId: number | string,
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
  templateId: number | string,
  body: object
) {
  return useAPI(`organization/${organizationCode}/template/${templateId}/`, {
    method: 'PATCH',
    body,
  })
}
