import useAPI from '@/composables/useAPI'

export function getProjectTemplate(organizationCode: string, templateId: number) {
  return useAPI(`organization/${organizationCode}/template/${templateId}`)
}
