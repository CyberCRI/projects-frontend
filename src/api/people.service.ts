import type { APIResponseList } from '@/api/types'
import type { PeopleModel } from '@/models/people.model'
import type { UserPatchModel, UserPrivacyPatchModel, UserSkillModel } from '@/models/user.model'
import { _adaptParamsToGetQuery } from '@/api/utils.service'
import useOrganizationsStore from '@/stores/useOrganizations'
import useAPI from '@/composables/useAPI'

// New user service using projects API
export async function getUser(id: string, noError: boolean = false) {
    return (await useAPI(`/user/${id}/`, { noError: noError })).data
}

export async function postUser(payload: FormData) {
    const organizationsStore = useOrganizationsStore()
    return (
        await useAPI(`/user/?organization=${organizationsStore.current?.code || ''}`, {
            body: payload,
            method: 'POST',
        })
    ).data
}

// Create account with invitation
export async function postUserWithInvitation(inviteToken: string, payload: FormData) {
    const organizationsStore = useOrganizationsStore()
    // use token as auth header with and "Invite" key instead of "Bearer"
    const inviteTokenHeader = {
        headers: {
            Authorization: `Invite ${inviteToken}`,
        },
    }
    // dont override with eventual curretn user token
    return (
        await useAPI(`/user/?organization=${organizationsStore.current?.code || ''}`, {
            body: payload,
            method: 'POST',
            ...inviteTokenHeader,
        })
    ).data
}

export async function searchPeopleProject({ search, org_id, params }) {
    const adaptedParams = params ? _adaptParamsToGetQuery(params) : null

    return (
        await useAPI(`/user/?search=${search}&current_org_pk=${org_id}`, { params: adaptedParams })
    ).data
}

export async function searchPeopleAdmin({ search, org_id, params }) {
    const adaptedParams = params ? _adaptParamsToGetQuery(params) : null

    return (
        await useAPI(`/user/admin-list/?search=${search}&current_org_pk=${org_id}`, {
            params: adaptedParams,
        })
    ).data
}

export async function searchPeopleByExactMail(email: string, params: object) {
    const adaptedParams = params ? _adaptParamsToGetQuery(params) : null
    return (await useAPI(`/user/get-by-email/${email}/`, { params: adaptedParams, noError: true }))
        .data
}

export async function patchUser(id: string | number, body: UserPatchModel) {
    return (await useAPI(`/user/${id}/`, { body, method: 'PATCH' })).data
}

export async function patchUserPicture(id: string | number, pictureId: string, body: FormData) {
    return (await useAPI(`/user/${id}/profile-picture/${pictureId}/`, { body, method: 'PATCH' }))
        .data
}

export async function deleteUser(id: string) {
    return await useAPI(`/user/${id}/`, { method: 'DELETE' })
}

export async function postUserPicture(id: string, body: FormData) {
    return (await useAPI(`/user/${id}/profile-picture/`, { body, method: 'POST' })).data
}

export async function patchUserPrivacy(id: string | number, body: UserPrivacyPatchModel) {
    return (await useAPI(`/privacy-settings/${id}/`, { body, method: 'PATCH' })).data
}

export async function postUserSkill(user_id: string | number, body: UserSkillModel) {
    return (await useAPI(`/user/${user_id}/skill/`, { body, method: 'POST' })).data
}

export async function patchUserSkill(
    user_id: string | number,
    skill_id: number,
    body: UserPrivacyPatchModel
) {
    return (await useAPI(`/user/${user_id}/skill/${skill_id}/`, { body, method: 'PATCH' })).data
}

export async function deleteUserSkill(user_id: string | number, skill_id: number) {
    return (await useAPI(`/user/${user_id}/skill/${skill_id}/`, { method: 'DELETE' })).data
}

export async function resetUserPassword(id: string | number) {
    const organizationsStore = useOrganizationsStore()
    const orgCode = organizationsStore.current?.code || ''
    return (await useAPI(`/user/${id}/reset-password/?organization=${orgCode}`, {})).data
}
