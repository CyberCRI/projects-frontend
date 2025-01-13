import { axios } from '@/api/api.config'

// fetch mentorshup demand and offer for currentr user
export async function getUserMentorship(orgCode, payload) {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/mentoring/`,
            payload
        )
    ).data
}

// fetch mentorshup demand and offer for currentr user
export async function getMentorshipDetails(orgCode, mentorshipId, payload) {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/mentoring/${mentorshipId}/`,
            payload
        )
    ).data
}

// offer mentroship fro a skill
export async function offerMentorship(orgCode, skill, payload) {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/mentoring/contact-mentoree/${skill.id}/`,
            payload
        )
    ).data
}

// ask mentorship for a skill
export async function askMentorship(orgCode, skill, payload) {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/mentoring/contact-mentor/${skill.id}/`,
            payload
        )
    ).data
}
// respond to mentroship offer
export async function respondMentorship(orgCode, mentorshipId, payload) {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/mentoring/${mentorshipId}/respond/`,
            payload
        )
    ).data
}
