import type { InvitationModel, InvitationModelInput } from '@/models/invitation.model'
import type { OrganizationModel } from '@/models/organization.model'
import useAPI from '@/composables/useAPI'

export async function getInvitation(
  organizationCode: OrganizationModel['code'],
  token: string,
  config = {}
) {
  return await useAPI<InvitationModel>(
    `organization/${organizationCode}/invitation/${token}/`,
    config
  )
}
export async function getInvitations(organizationCode: OrganizationModel['code'], config = {}) {
  return await useAPI<InvitationModel>(`organization/${organizationCode}/invitation/`, config)
}
export async function postInvitation(
  organizationCode: OrganizationModel['code'],
  formData: InvitationModelInput,
  config = {}
) {
  return await useAPI<InvitationModel>(`organization/${organizationCode}/invitation/`, {
    ...config,
    body: formData,
    method: 'POST',
  })
}

export async function deleteInvitation(
  organizationCode: OrganizationModel['code'],
  id: OrganizationModel['id'],
  config = {}
) {
  return await useAPI<undefined>(`organization/${organizationCode}/invitation/${id}/`, {
    ...config,
    method: 'DELETE',
  })
}
