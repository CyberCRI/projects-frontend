// import type { APIResponseList } from '@/api/types'
import type {
  /* OrganizationOutput,*/ OrganizationModel,
  OrganizationPatchInput,
} from '@/models/organization.model'
import type { /*GroupModel,*/ GroupModelInput, RemoveGroupModelInput } from '@/models/group.model'
import type { /*ImageOrganizationOutput,*/ ImageOrganizationInput } from '@/models/image.model'
import { _adaptParamsToGetQuery } from '@/api/utils.service'
import type { ProjectModel } from '@/models/project.model'
import useAPI from '@/composables/useAPI'

export async function patchOrganization(
  code: string,
  organization: OrganizationPatchInput | FormData
) {
  return await useAPI(`organization/${code}/`, {
    body: organization,
    method: 'PATCH',
  })
}

export async function getOrganizationByCode(code: string, config = {}) {
  return await useAPI<OrganizationModel>(`organization/${code}/`, config)
}

export async function getOrganizations(config = {}) {
  return await useAPI<PaginationResult<OrganizationModel>>(`organization/`, config)
}

export async function postOrganisationBanner({ code, body }: { code: string; body: FormData }) {
  return await useAPI(`organization/${code}/banner/`, { body, method: 'POST' }) //.data.value
}

export async function patchOrganisationBanner(code: string, banner_id: number, body: FormData) {
  return await useAPI(`organization/${code}/banner/${banner_id}/`, { body, method: 'PATCH' })
}

export async function postOrganisationLogo({
  code,
  body,
}: {
  code: string
  body: ImageOrganizationInput | FormData
}) {
  return await useAPI(`organization/${code}/logo/`, { body, method: 'POST' })
}

export async function addOrgMember({ org_id, body }: { org_id: number; body: GroupModelInput[] }) {
  return await useAPI(`organization/${org_id}/member/add/`, { body, method: 'POST' })
}

export async function removeOrgMember({
  org_id,
  body,
}: {
  org_id: number
  body: RemoveGroupModelInput[]
}) {
  return await useAPI(`organization/${org_id}/member/remove/`, { body, method: 'POST' }) // .data.value
}

export async function postAccessRequest(organizationCode: OrganizationModel['code'], body) {
  return await useAPI(`organization/${organizationCode}/access-request/`, { body, method: 'POST' })
}

export async function getAccessRequests(organizationCode: OrganizationModel['code'], params) {
  return await useAPI(`organization/${organizationCode}/access-request/`, {
    ..._adaptParamsToGetQuery(params),
  })
}

export async function declineAccessRequest(organizationCode: OrganizationModel['code'], params) {
  return await useAPI(`organization/${organizationCode}/access-request/decline/`, {
    body: params,
    method: 'POST',
  })
}

export async function acceptAccessRequest(organizationCode: OrganizationModel['code'], params) {
  return await useAPI(`organization/${organizationCode}/access-request/accept/`, {
    body: params,
    method: 'POST',
  })
}

// --- featured
type ConfigFeaturedProject = UseApiOptions
type FeaturedProjectBody = {
  featured_projects_ids: number[]
}
export async function getFeaturedProjects(
  organizationCode: OrganizationModel['code'],
  config: ConfigFeaturedProject = {}
) {
  return await useAPI<PaginationResult<ProjectModel>>(
    `organization/${organizationCode}/featured-project/`,
    config
  )
}

export async function addFeaturedProject(
  organizationCode: OrganizationModel['code'],
  body: FeaturedProjectBody,
  config: ConfigFeaturedProject = {}
) {
  return await useAPI<ProjectModel>(`organization/${organizationCode}/featured-project/add/`, {
    method: 'POST',
    body,
    ...config,
  })
}

export async function removeFeaturedProject(
  organizationCode: OrganizationModel['code'],
  body: FeaturedProjectBody,
  config: ConfigFeaturedProject = {}
) {
  return await useAPI<undefined>(`organization/${organizationCode}/featured-project/remove/`, {
    method: 'POST',
    body,
    ...config,
  })
}

export async function postOrganizationImage({ orgCode, body }) {
  return await useAPI(`organization/${orgCode}/image/`, { body, method: 'POST' })
}

export async function patchTermsAndConditions(organization: OrganizationModel, content: string) {
  return await useAPI(
    `organization/${organization.code}/terms-and-conditions/${organization.terms_and_conditions?.id}/`,
    {
      body: { content },
      method: 'PATCH',
    }
  )
}
