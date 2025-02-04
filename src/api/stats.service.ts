import useAPI from '@/composables/useAPI'

export async function getStats(status = 'all', org: string) {
    // waiting for https://github.com/CyberCRI/projects-api-Reloaded/issues/241
    return (
        await useAPI(`/organization/${org}/stats/`, {
            params: {
                publication_status: status,
            },
        })
    ).data
}
