import type { LocationId, LocationModel, ProjectLocationForm } from '@/models/location.model'
import type { ProjectSlugOrId } from '@/models/project.model'
import type { Locations } from '@/interfaces/maps'
import useAPI from '@/composables/useAPI'

type Config = UseApiOptions

export async function getProjectLocations(projectId: ProjectSlugOrId, config: Config = {}) {
  return await useAPI<LocationModel[]>(`project/${projectId}/location/`, config)
}

export async function getProjectLocation(
  projectId: ProjectSlugOrId,
  locationId: LocationId,
  config: Config = {}
) {
  return await useAPI<LocationModel>(`project/${projectId}/location/${locationId}/`, config)
}

export async function postLocations(projectId: ProjectSlugOrId, body: ProjectLocationForm) {
  return await useAPI<LocationModel>(`project/${projectId}/location/`, {
    body,
    method: 'POST',
  })
}

export async function patchLocation(
  projectId: ProjectSlugOrId,
  locationId: LocationId,
  body: ProjectLocationForm
) {
  return await useAPI<LocationModel>(`project/${projectId}/location/${locationId}/`, {
    body,
    method: 'PATCH',
  })
}

export async function deleteLocation(projectId: ProjectSlugOrId, locationId: LocationId) {
  return await useAPI<undefined>(`project/${projectId}/location/${locationId}/`, {
    method: 'DELETE',
  })
}

export async function getLocations(organizationCode: string, config: Config = {}) {
  return await useAPI<Locations>(`organization/${organizationCode}/location/`, config)
}
