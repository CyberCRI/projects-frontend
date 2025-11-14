import useAPI from '@/composables/useAPI'
import useAPI2 from '@/composables/useAPI2'

export function getTemplates(organizationCode: number) {
  return useAPI2(`organization/${organizationCode}/template/`)
}

export function getTemplate(organizationCode: number, templateId: number) {
  return useAPI2(`organization/${organizationCode}/template/${templateId}/`)
}

export function deleteTemplate(organizationCode: number, templateId: number) {
  return useAPI(`organization/${organizationCode}/template/${templateId}/`, { method: 'DELETE' })
}

export function postTemplate(organizationCode: number, body: object) {
  return useAPI(`organization/${organizationCode}/template/`, { method: 'POST', body })
}

export function postTemplateImage(organizationCode: number, templateId: number, file: File) {
  const body = new FormData()
  body.append('file', file, file.name)
  return useAPI(`organization/${organizationCode}/template/${templateId}/image/`, {
    body,
    method: 'POST',
  })
}

export function patchTemplate(organizationCode: number, templateId: number, body: object) {
  return useAPI(`organization/${organizationCode}/template/${templateId}/`, {
    method: 'PATCH',
    body,
  })
}
