import type { LocationModel, ProjectLocationForm } from '@/models/location.model'
import useAPI from '@/composables/useAPI'
import utils from '@/functs/functions'
import { Locations } from '@/interfaces/maps'

export async function getProjectLocations(projectId: number) {
  return await useAPI<LocationModel[]>(`project/${projectId}/location/`)
}

export async function getProjectLocation(projectId: string, locationId: number) {
  return await useAPI<LocationModel>(`project/${projectId}/location/${locationId}/`)
}

export async function getLocations(params, next) {
  if (next) {
    // TODO: nuxt check next works
    return await useAPI<Locations>(next, {}) //.data.value
  }

  return await useAPI<Locations>(`location/`, { ...utils.adaptParam(params) }) //.data.value
}

export async function postLocations(projectId: string, body: ProjectLocationForm) {
  return await useAPI<LocationModel>(`project/${projectId}/location/`, {
    body,
    method: 'POST',
  })
}

export async function patchLocation(
  projectId: string,
  locationId: number,
  body: ProjectLocationForm
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
