import { axios } from '@/api/api.config'

export async function getSkill(id) {
    return (await axios.get(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/skill/${id}`)).data
}

export async function searchSkill(search) {
    return (
        await axios.get(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/skill/`, {
            params: { search },
        })
    ).data
}

export async function offerMentorship(orgCode, skill, payload) {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/skill/${skill.id}/contact-mentoree/`,
            payload
        )
    ).data
}

export async function askMentorship(orgCode, skill, payload) {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/skill/${skill.id}/contact-mentor/`,
            payload
        )
    ).data
}
