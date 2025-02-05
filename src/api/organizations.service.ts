import type { APIResponseList } from '@/api/types'
import type { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'
import type { ImageOrganizationOutput, ImageOrganizationInput } from '@/models/image.model'
import type { GroupModel, GroupModelInput, RemoveGroupModelInput } from '@/models/group.model'
import { _adaptParamsToGetQuery } from '@/api/utils.service'
import useAPI, { getFormDataHeaders } from '@/composables/useAPI'

export async function patchOrganization(
    code: string,
    organization: OrganizationPatchInput | FormData
) {
    const extraHeaders = organization instanceof FormData ? getFormDataHeaders() : {}
    return (
        await useAPI(`organization/${code}/`, {
            body: organization,
            method: 'PATCH',
            ...extraHeaders,
        })
    ).data
}

export async function getOrganizationByCode(code: string) {
    return (await useAPI(`organization/${code}/`, {})).data
}

export async function getOrganizations() {
    return (await useAPI(`organization/`, {})).data
}

export async function postOrganisationBanner({
    code,
    body,
}: {
    code: string
    body: ImageOrganizationInput
}) {
    return (await useAPI(`organization/${code}/banner/`, { body, method: 'POST' })).data
}

export async function patchOrganisationBanner(
    code: string,
    banner_id: number,
    body: ImageOrganizationInput
) {
    return (await useAPI(`organization/${code}/banner/${banner_id}/`, { body, method: 'PATCH' }))
        .data
}

export async function postOrganisationLogo({
    code,
    body,
}: {
    code: string
    body: ImageOrganizationInput
}) {
    return (await useAPI(`organization/${code}/logo/`, { body, method: 'POST' })).data
}

export async function addOrgMember({ org_id, body }: { org_id: number; body: GroupModelInput[] }) {
    return (await useAPI(`organization/${org_id}/member/add/`, { body, method: 'POST' })).data
}

export async function removeOrgMember({
    org_id,
    body,
}: {
    org_id: number
    body: RemoveGroupModelInput[]
}) {
    return (await useAPI(`organization/${org_id}/member/remove/`, { body, method: 'POST' })).data
}

export async function postAccessRequest(org_code, body) {
    return (await useAPI(`organization/${org_code}/access-request/`, { body, method: 'POST' })).data
}

export async function getAccessRequests(org_code, params) {
    return (
        await useAPI(`organization/${org_code}/access-request/`, {
            params: _adaptParamsToGetQuery(params),
        })
    ).data
}

export async function declineAccessRequest(org_code, params) {
    return (
        await useAPI(`organization/${org_code}/access-request/decline/`, {
            body: params,
            method: 'POST',
        })
    ).data
}

export async function acceptAccessRequest(org_code, params) {
    return (
        await useAPI(`organization/${org_code}/access-request/accept/`, {
            body: params,
            method: 'POST',
        })
    ).data
}

export async function getFeaturedProjects(org_code, params) {
    return (
        await useAPI(`organization/${org_code}/featured-project/`, {
            params: _adaptParamsToGetQuery(params),
        })
    ).data
}

export async function addFeaturedProject(org_code, body) {
    return (
        await useAPI(`organization/${org_code}/featured-project/add/`, { body, method: 'POST' })
    ).data
}

export async function removeFeaturedProject(org_code, body) {
    return (
        await useAPI(`organization/${org_code}/featured-project/remove/`, { body, method: 'POST' })
    ).data
}

export async function postOrganizationImage({ orgCode, body }) {
    return (
        await useAPI(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/image/`,
            { body, method: 'POST' }
        )
    ).data
}
