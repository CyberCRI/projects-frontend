import type { LocationInput /*, LocationOutput*/, LocationModel } from '@/models/location.model'
// import type { APIResponseList } from '@/api/types'
import utils from '@/functs/functions'
import useAPI from '@/composables/useAPI'

export async function getProjectLocations(projectId) {
  return await useAPI<LocationModel>(`project/${projectId}/location/`, {}) //.data.value
}

export async function getProjectLocation(body) {
  return await useAPI(`project/${body.projectId}/location/${body.locationId}/`, {}) //.data.value
}

export async function getLocations(params, next) {
  if (next) {
    // TODO: nuxt check next works
    return await useAPI(next, {}) //.data.value
  }

  return await useAPI(`location/`, { ...utils.adaptParam(params) }) //.data.value
}

export async function postLocations(location: LocationInput) {
  return await useAPI(`project/${location.project_id}/location/`, {
    body: location,
    method: 'POST',
  }) //.data.value
}

export async function patchLocation(location: LocationInput) {
  return await useAPI(`project/${location.project.id}/location/${location.id}/`, {
    body: location,
    method: 'PATCH',
  }) //.data.value
}

export async function deleteLocation(location: LocationInput) {
  return await useAPI(`project/${location.project.id}/location/${location.id}/`, {
    method: 'DELETE',
  }) //.data.value
}
