import { axios } from '@/api/api.config'
import { LocationInput, LocationOutput } from '@/models/location.model'
import { APIResponseList } from '@/api/types'
import utils from '@/functs/functions'

export async function getProjectLocation(body): Promise<APIResponseList<LocationOutput>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${body.projectId}/location/${
                body.locationId
            }`
        )
    ).data
}

export async function getLocations(params, next): Promise<APIResponseList<LocationOutput>> {
    if (next) {
        return (await axios.get(next)).data
    }

    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/location/`,
            utils.adaptParam(params)
        )
    ).data
}

export async function postLocations(location: LocationInput): Promise<LocationOutput> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${
                location.project_id
            }/location/`,
            location
        )
    ).data
}

export async function patchLocation(location: LocationInput): Promise<LocationOutput> {
    return (
        await axios.patch(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${
                location.project.id
            }/location/${location.id}/`,
            location
        )
    ).data
}

export async function deleteLocation(location: LocationInput): Promise<LocationOutput> {
    return (
        await axios.delete(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${
                location.project.id
            }/location/${location.id}/`
        )
    ).data
}
