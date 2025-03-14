import type { /* InvitationModel,*/ InvitationModelInput } from '@/models/invitation.model'
// import type { APIRespons1eList } from '@/api/types'
import useAPI from '@/composables/useAPI'

export async function getInvitation(organization: string, uuid: string) {
  return await useAPI(`organization/${organization}/invitation/${uuid}/`, {}) //.data.value
}
export async function getInvitations(organization: string) {
  return await useAPI(`organization/${organization}/invitation/`, {}) //.data.value
}
export async function postInvitation(organization: string, formData: InvitationModelInput) {
  return await useAPI(`organization/${organization}/invitation/`, {
    body: formData,
    method: 'POST',
  }) //.data.value
}

export async function deleteInvitation(organization: string, id: number) {
  return await useAPI(`organization/${organization}/invitation/${id}/`, { method: 'DELETE' })
  //.data.value
}
