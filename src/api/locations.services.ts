import type { LocationModel, ProjectLocationForm } from '@/models/location.model'
import useAPI from '@/composables/useAPI'
import { Locations } from '@/interfaces/maps'

export async function getProjectLocations(projectId: number) {
  return await useAPI<LocationModel[]>(`project/${projectId}/location/`)
}

export async function getProjectLocation(projectId: string, locationId: number) {
  return await useAPI<LocationModel>(`project/${projectId}/location/${locationId}/`)
}

export async function getLocations(organizationCode: string, config = {}) {
  return await useAPI<Locations>(`organization/${organizationCode}/location/`, config)
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
