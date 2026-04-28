import useAPI from '~/composables/useAPI'
import { Mentoring } from '~/models/mentoring.model'
import { OrganizationModel } from '~/models/organization.model'

// fetch mentorshup demand and offer for currentr user
export async function getUserMentorship(organizationCode: OrganizationModel['code'], config = {}) {
  return await useAPI<PaginationResult<Mentoring>>(
    `organization/${organizationCode}/mentoring/`,
    config
  )
}

// fetch mentorshup demand and offer for currentr user
export async function getMentorshipDetails(
  organizationCode: OrganizationModel['code'],
  mentorshipId,
  payload
) {
  return await useAPI(`organization/${organizationCode}/mentoring/${mentorshipId}/`, {
    params: payload,
  })
  // .data
}

// offer mentroship fro a skill
export async function offerMentorship(organizationCode: OrganizationModel['code'], skill, payload) {
  return await useAPI(`organization/${organizationCode}/mentoring/contact-mentoree/${skill.id}/`, {
    body: payload,
    method: 'POST',
  }) // .data
}

// ask mentorship for a skill
export async function askMentorship(organizationCode: OrganizationModel['code'], skill, payload) {
  return await useAPI(`organization/${organizationCode}/mentoring/contact-mentor/${skill.id}/`, {
    body: payload,
    method: 'POST',
  }) // .data
}
// respond to mentroship offer
export async function respondMentorship(
  organizationCode: OrganizationModel['code'],
  mentorshipId,
  payload
) {
  return await useAPI(`organization/${organizationCode}/mentoring/${mentorshipId}/respond/`, {
    body: payload,
    method: 'POST',
  }) // .data
}
