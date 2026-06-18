import type { ContactModel, ReportForm, ReportModel } from '~/models/report.model'

import type { OrganizationModel } from '~/models/organization.model'
import useAPI from '~/composables/useAPI'

export async function reportBug(organizationCode: OrganizationModel['code'], formData: ReportForm) {
  return await useAPI<ReportModel>(`organization/${organizationCode}/report/bug/`, {
    body: formData,
    method: 'POST',
  })
}

export async function reportAbuse(
  organizationCode: OrganizationModel['code'],
  formData: ReportForm
) {
  return await useAPI<ReportModel>(`organization/${organizationCode}/report/abuse/`, {
    body: formData,
    method: 'POST',
  })
}

export async function contactUs(
  organizationCode: OrganizationModel['code'],
  formData: ContactModel
) {
  return await useAPI(`organization/${organizationCode}/contact/us/`, {
    body: formData,
    method: 'POST',
  })
}
