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
