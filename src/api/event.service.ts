import type { EventIdOrSlug, EventInput, EventModel, QueryFilterEvent } from '@/models/event.model'
import useAPI, { UseApiOptions } from '@/composables/useAPI'
import { OrganizationModel } from '@/models/organization.model'

type ConfigEvent = UseApiOptions<QueryFilterEvent>

export async function getAllEvents(
  organizationCode: OrganizationModel['code'],
  config?: ConfigEvent
) {
  return await useAPI<PaginationResult<EventModel>>(
    `organization/${organizationCode}/event/`,
    config
  )
}

export async function getEvent(
  organizationCode: OrganizationModel['code'],
  idOrSlug: EventIdOrSlug,
  config?: ConfigEvent
) {
  return await useAPI<EventModel>(`organization/${organizationCode}/event/${idOrSlug}/`, config)
}

export async function createEvent(organizationCode: OrganizationModel['code'], body: EventInput) {
  return await useAPI<EventModel>(`organization/${organizationCode}/event/`, {
    body,
    method: 'POST',
  })
}

export async function putEvent(
  organizationCode: OrganizationModel['code'],
  idOrSlug: EventIdOrSlug,
  body: EventInput
) {
  return await useAPI<EventModel>(`organization/${organizationCode}/event/${idOrSlug}/`, {
    body,
    method: 'PUT',
  })
}

export async function patchEvent(
  organizationCode: OrganizationModel['code'],
  idOrSlug: EventIdOrSlug,
  body: EventInput
) {
  return await useAPI<EventModel>(`organization/${organizationCode}/event/${idOrSlug}/`, {
    body,
    method: 'PATCH',
  })
}

export async function deleteEvent(
  organizationCode: OrganizationModel['code'],
  idOrSlug: EventIdOrSlug
) {
  return await useAPI<void>(`organization/${organizationCode}/event/${idOrSlug}/`, {
    method: 'DELETE',
  })
}
