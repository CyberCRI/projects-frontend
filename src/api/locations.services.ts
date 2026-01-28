import type { LocationModel, LocationOutput } from '@/models/location.model'
import utils from '@/functs/functions'
import useAPI from '@/composables/useAPI'

export async function getProjectLocations(projectId: number) {
  return await useAPI<LocationModel[]>(`project/${projectId}/location/`)
}

export async function getProjectLocation(projectId: string, locationId: number) {
  return await useAPI<LocationModel>(`project/${projectId}/location/${locationId}/`)
}

export async function getLocations(params, next) {
  if (next) {
    // TODO: nuxt check next works
    return await useAPI(next, {}) //.data.value
  }

  return await useAPI(`location/`, { ...utils.adaptParam(params) }) //.data.value
}

export async function postLocations(projectId: string, body: Omit<LocationOutput, 'id'>) {
  return await useAPI<LocationModel>(`project/${projectId}/location/`, {
    body,
    method: 'POST',
  })
}

export async function patchLocation(
  projectId: string,
  locationId: number,
  body: Partial<LocationOutput>
) {
  return await useAPI<LocationModel>(`project/${projectId}/location/${locationId}/`, {
    body,
    method: 'PATCH',
  })
}

export async function deleteLocation(projectId: string, locationId: number) {
  return await useAPI<LocationModel>(`project/${projectId}/location/${locationId}/`, {
    method: 'DELETE',
  })
}
