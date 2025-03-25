import useAPI from '@/composables/useAPI'

// fetch mentorshup demand and offer for currentr user
export async function getUserMentorship(orgCode, payload) {
  return await useAPI(`organization/${orgCode}/mentoring/`, { params: payload }) // .data
}

// fetch mentorshup demand and offer for currentr user
export async function getMentorshipDetails(orgCode, mentorshipId, payload) {
  return await useAPI(`organization/${orgCode}/mentoring/${mentorshipId}/`, { params: payload })
  // .data
}

// offer mentroship fro a skill
export async function offerMentorship(orgCode, skill, payload) {
  return await useAPI(`organization/${orgCode}/mentoring/contact-mentoree/${skill.id}/`, {
    body: payload,
    method: 'POST',
  }) // .data
}

// ask mentorship for a skill
export async function askMentorship(orgCode, skill, payload) {
  return await useAPI(`organization/${orgCode}/mentoring/contact-mentor/${skill.id}/`, {
    body: payload,
    method: 'POST',
  }) // .data
}
// respond to mentroship offer
export async function respondMentorship(orgCode, mentorshipId, payload) {
  return await useAPI(`organization/${orgCode}/mentoring/${mentorshipId}/respond/`, {
    body: payload,
    method: 'POST',
  }) // .data
}
