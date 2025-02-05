import useAPI from '@/composables/useAPI'

export async function getSkill(id) {
    return (await useAPI(`skill/${id}`, {})).data
}

export async function searchSkill(search) {
    return (
        await useAPI(`skill/`, {
            params: { search },
        })
    ).data
}
