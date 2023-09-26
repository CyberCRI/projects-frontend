import { axios } from '@/api/api.config'

export async function getStats(status = 'all') {
    // waiting for https://github.com/CyberCRI/projects-api-Reloaded/issues/241
    return (
        await axios.get(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/stats/`, {
            params: {
                publication_status: status,
            },
        })
    ).data
}
