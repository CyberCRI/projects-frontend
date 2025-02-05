import type { LocationInput, LocationOutput } from '@/models/location.model'
import type { APIResponseList } from '@/api/types'
import utils from '@/functs/functions'
import useAPI from '@/composables/useAPI'

export async function getProjectLocations(projectId) {
    return (await useAPI(`project/${projectId}/location/`, {})).data
}

export async function getProjectLocation(body) {
    return (await useAPI(`project/${body.projectId}/location/${body.locationId}`, {})).data
}

export async function getLocations(params, next) {
    if (next) {
        // TODO: nuxt check next works
        return (await useAPI(next, {})).data
    }

    return (await useAPI(`location/`, { params: utils.adaptParam(params) })).data
}

export async function postLocations(location: LocationInput) {
    return (
        await useAPI(`project/${location.project_id}/location/`, {
            body: location,
            method: 'POST',
        })
    ).data
}

export async function patchLocation(location: LocationInput) {
    return (
        await useAPI(`project/${location.project.id}/location/${location.id}/`, {
            body: location,
            method: 'PATCH',
        })
    ).data
}

export async function deleteLocation(location: LocationInput) {
    return (
        await useAPI(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${
                location.project.id
            }/location/${location.id}/`,
            { method: 'DELETE' }
        )
    ).data
}
