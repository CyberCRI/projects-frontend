import { axios } from '@/api/api.config'
import { InvitationModel, InvitationModelInput } from '@/models/invitation.model'
import { APIResponseList } from '@/api/types'

export async function getInvitations(
    organization: String
): Promise<APIResponseList<InvitationModel>> {
    return (
        await axios.get(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${organization}/invitation/`
        )
    ).data
}
export async function postInvitation(
    organization: String,
    formData: InvitationModelInput
): Promise<any> {
    return (
        await axios.post(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${organization}/invitation/`,
            formData
        )
    ).data
}

export async function deleteInvitation(organization: String, id: Number): Promise<any> {
    return (
        await axios.delete(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${organization}/invitation/${id}/`
        )
    ).data
}
