import type { EventInput, EventModel } from '@/models/event.model'
import useAPI from '@/composables/useAPI'

export async function getAllEvents(orgCode: string, config = {}) {
  return await useAPI<PaginationResult<EventModel>>(`organization/${orgCode}/event/`, config)
}

export async function getEvent(orgCode: string, idOrSlug: number | string, config = {}) {
  return await useAPI<EventModel>(`organization/${orgCode}/event/${idOrSlug}/`, config)
}

export async function createEvent(orgCode: string, body: EventInput) {
  return await useAPI<EventModel>(`organization/${orgCode}/event/`, { body, method: 'POST' }) //.data.value
}

export async function putEvent(orgCode: string, idOrSlug: number | string, body: EventInput) {
  return await useAPI<EventModel>(`organization/${orgCode}/event/${idOrSlug}/`, {
    body,
    method: 'PUT',
  })
  //.data.value
}

export async function patchEvent(orgCode: string, idOrSlug: number | string, body: EventInput) {
  return await useAPI<EventModel>(`organization/${orgCode}/event/${idOrSlug}/`, {
    body,
    method: 'PATCH',
  })
  //.data.value
}

export async function deleteEvent(orgCode: string, idOrSlug: number | string) {
  return await useAPI(`organization/${orgCode}/event/${idOrSlug}/`, { method: 'DELETE' }) //.data.value
}
