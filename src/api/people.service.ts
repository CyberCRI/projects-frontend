import { axios, axiosNoToken, axiosNoErrorMessage } from './api.config'
import { APIResponseList } from '@/api/types'
import { PeopleModel } from '@/models/people.model'
import { UserPatchModel, UserPrivacyPatchModel, UserSkillModel } from '@/models/user.model'
import { _adaptParamsToGetQuery } from '@/api/utils.service'
import useOrganizationsStore from '@/stores/useOrganizations'

// New user service using projects API
export async function getUser(id: string): Promise<PeopleModel> {
    return (await axios.get(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/user/${id}/`)).data
}

export async function postUser(payload: FormData): Promise<PeopleModel> {
    const organizationsStore = useOrganizationsStore()
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/user/?organization=${
                organizationsStore.current?.code || ''
            }`,
            payload
        )
    ).data
}

// Create account with invitation
export async function postUserWithInvitation(
    inviteToken: string,
    payload: FormData
): Promise<PeopleModel> {
    const organizationsStore = useOrganizationsStore()
    // use token as auth header with and "Invite" key instead of "Bearer"
    const config = {
        headers: {
            Authorization: `Invite ${inviteToken}`,
        },
    }
    // dont override with eventual curretn user token
    return (
        await axiosNoToken.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/user/?organization=${
                organizationsStore.current?.code || ''
            }`,
            payload,
            config
        )
    ).data
}

export async function searchPeopleProject({
    search,
    org_id,
    params,
}): Promise<APIResponseList<PeopleModel>> {
    const adaptedParams = params ? _adaptParamsToGetQuery(params) : null

    return (
        await axios.get(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/user/?search=${search}&current_org_pk=${org_id}`,
            adaptedParams
        )
    ).data
}

export async function searchPeopleAdmin({
    search,
    org_id,
    params,
}): Promise<APIResponseList<PeopleModel>> {
    const adaptedParams = params ? _adaptParamsToGetQuery(params) : null

    return (
        await axios.get(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/user/admin-list/?search=${search}&current_org_pk=${org_id}`,
            adaptedParams
        )
    ).data
}

export async function searchPeopleByExactMail(email: string, params: object): Promise<PeopleModel> {
    const adaptedParams = params ? _adaptParamsToGetQuery(params) : null
    return (
        await axiosNoErrorMessage.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/user/get-by-email/${email}/`,
            adaptedParams
        )
    ).data
}

export async function patchUser(id: string | number, body: UserPatchModel): Promise<PeopleModel> {
    return (await axios.patch(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/user/${id}/`, body))
        .data
}

export async function patchUserPicture(
    id: string | number,
    pictureId: string,
    body: FormData
): Promise<PeopleModel> {
    return (
        await axios.patch(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/user/${id}/profile-picture/${pictureId}/`,
            body
        )
    ).data
}

export async function deleteUser(id: string) {
    return await axios.delete(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/user/${id}/`)
}

export async function postUserPicture(id: string, body: FormData): Promise<PeopleModel> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/user/${id}/profile-picture/`,
            body
        )
    ).data
}

export async function patchUserPrivacy(
    id: string | number,
    body: UserPrivacyPatchModel
): Promise<PeopleModel> {
    return (
        await axios.patch(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/privacy-settings/${id}/`,
            body
        )
    ).data
}

export async function postUserSkill(body: UserSkillModel): Promise<PeopleModel> {
    return (await axios.post(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/skill/`, body)).data
}

export async function patchUserSkill(
    skill_id: number,
    body: UserPrivacyPatchModel
): Promise<PeopleModel> {
    return (
        await axios.patch(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/skill/${skill_id}/`,
            body
        )
    ).data
}

export async function deleteUserSkill(skill_id: number): Promise<PeopleModel> {
    return (
        await axios.delete(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/skill/${skill_id}/`)
    ).data
}

export async function resetUserPassword(id: string | number): Promise<PeopleModel> {
    const organizationsStore = useOrganizationsStore()
    return (
        await axios.get(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/user/${id}/reset-password/?organization=${organizationsStore.current?.code || ''}`
        )
    ).data
}
