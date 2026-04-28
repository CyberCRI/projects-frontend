import type { InvitationModelInput } from '~/models/invitation.model'

import useAPI from '~/composables/useAPI'

export async function getInvitation(organization: string, uuid: string) {
  return await useAPI(`organization/${organization}/invitation/${uuid}/`, {})
}
export async function getInvitations(organization: string) {
  return await useAPI(`organization/${organization}/invitation/`, {})
}
export async function postInvitation(organization: string, formData: InvitationModelInput) {
  return await useAPI(`organization/${organization}/invitation/`, {
    body: formData,
    method: 'POST',
  })
}

export async function deleteInvitation(organization: string, id: number) {
  return await useAPI(`organization/${organization}/invitation/${id}/`, { method: 'DELETE' })
}
