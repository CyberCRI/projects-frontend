import { axios, configFormData } from '@/api/api.config'
import { APIResponseList } from '@/api/types'
import { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'
import { ImageOrganizationOutput, ImageOrganizationInput } from '@/models/image.model'
import { GroupModel, GroupModelInput, RemoveGroupModelInput } from '@/models/group.model'
import { _adaptParamsToGetQuery } from '@/api/utils.service'

export async function patchOrganization(
    code: string,
    organization: OrganizationPatchInput | FormData
): Promise<OrganizationOutput> {
    return (
        await axios.patch(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${code}/`,
            organization,
            organization instanceof FormData ? configFormData : null
        )
    ).data
}

export async function getOrganizationByCode(code: string): Promise<OrganizationOutput> {
    return (
        await axios.get(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${code}/`)
    ).data
}

export async function getOrganizations(): Promise<APIResponseList<OrganizationOutput>> {
    return (await axios.get(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/`)).data
}

export async function postOrganisationBanner({
    code,
    body,
}: {
    code: string
    body: ImageOrganizationInput
}): Promise<ImageOrganizationOutput> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${code}/banner/`,
            body
        )
    ).data
}

export async function patchOrganisationBanner(
    code: string,
    banner_id: number,
    body: ImageOrganizationInput
): Promise<ImageOrganizationOutput> {
    return (
        await axios.patch(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${code}/banner/${banner_id}/`,
            body
        )
    ).data
}

export async function postOrganisationLogo({
    code,
    body,
}: {
    code: string
    body: ImageOrganizationInput
}): Promise<ImageOrganizationOutput> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${code}/logo/`,
            body
        )
    ).data
}

export async function addGroupMember({
    org_id,
    body,
}: {
    org_id: number
    body: GroupModelInput[]
}): Promise<GroupModel> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${org_id}/member/add/`,
            body
        )
    ).data
}

export async function removeGroupMember({
    org_id,
    body,
}: {
    org_id: number
    body: RemoveGroupModelInput[]
}): Promise<GroupModel> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${org_id}/member/remove/`,
            body
        )
    ).data
}

export async function getPeopleGroups(org_code, params) {
    return (
        await axios.get(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org_code}/people-group/`,
            _adaptParamsToGetQuery(params)
        )
    ).data
}

export async function getPeopleGroupsHierarchy(org_code, params) {
    return (
        await axios.get(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org_code}/people-groups-hierarchy/`,
            _adaptParamsToGetQuery(params)
        )
    ).data
}

export async function addUserPeopleGroup(org_code, people_group_id, body) {
    return (
        await axios.post(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org_code}/people-group/${people_group_id}/member/add/`,
            body
        )
    ).data
}

export async function removeUserPeopleGroup(org_code, people_group_id, body) {
    return (
        await axios.post(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org_code}/people-group/${people_group_id}/member/remove/`,
            body
        )
    ).data
}

export async function getPeopleGroupById(org_code, group_id) {
    return (
        await axios.get(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org_code}/people-group/${group_id}/`
        )
    ).data
}

export async function postAccessRequest(org_code, body) {
    return (
        await axios.post(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org_code}/access-request/`,
            body
        )
    ).data
}

export async function getAccessRequests(org_code, params) {
    return (
        await axios.get(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org_code}/access-request/`,
            _adaptParamsToGetQuery(params)
        )
    ).data
}

export async function declineAccessRequest(org_code, params) {
    return (
        await axios.post(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org_code}/access-request/decline/`,
            params
        )
    ).data
}

export async function acceptAccessRequest(org_code, params) {
    return (
        await axios.post(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org_code}/access-request/accept/`,
            params
        )
    ).data
}
