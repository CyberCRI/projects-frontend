import type { /* InvitationModel,*/ InvitationModelInput } from '@/models/invitation.model'
// import type { APIRespons1eList } from '@/api/types'
import useAPI from '@/composables/useAPI'

export async function getInvitation(organization: String, uuid: String) {
    return await useAPI(`organization/${organization}/invitation/${uuid}/`, {}) //.data.value
}
export async function getInvitations(organization: String) {
    return await useAPI(`organization/${organization}/invitation/`, {}) //.data.value
}
export async function postInvitation(organization: String, formData: InvitationModelInput) {
    return await useAPI(`organization/${organization}/invitation/`, {
        body: formData,
        method: 'POST',
    }) //.data.value
}

export async function deleteInvitation(organization: String, id: Number) {
    return await useAPI(`organization/${organization}/invitation/${id}/`, { method: 'DELETE' })
    //.data.value
}
