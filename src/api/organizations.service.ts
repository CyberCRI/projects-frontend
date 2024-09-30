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

export async function addOrgMember({
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

export async function removeOrgMember({
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

export async function getFeaturedProjects(org_code, params) {
    return (
        await axios.get(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org_code}/featured-project/`,
            _adaptParamsToGetQuery(params)
        )
    ).data
}

export async function addFeaturedProject(org_code, body) {
    return (
        await axios.post(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org_code}/featured-project/add/`,
            body
        )
    ).data
}

export async function removeFeaturedProject(org_code, body) {
    return (
        await axios.post(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org_code}/featured-project/remove/`,
            body
        )
    ).data
}

export async function postOrganizationImage({ orgCode, body }): Promise<any> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/image/`,
            body
        )
    ).data
}
