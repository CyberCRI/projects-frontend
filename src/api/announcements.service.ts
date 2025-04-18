import type {
  AnnouncementInput,
  // AnnouncementOutput,
  AnnouncementApplyInput,
} from '@/models/announcement.model'
// import type { APIResponseList } from '@/api/types'
import utils from '@/functs/functions'

import useAPI from '@/composables/useAPI'

export async function getAnnouncements(params) {
  return await useAPI(`announcement/`, { ...utils.adaptParam(params) }) //.data.value
}

export async function getProjectAnnouncements(project_id: string, params: object) {
  return await useAPI(`project/${project_id}/announcement/`, {
    ...utils.adaptParam(params || {}),
  }) //.data.value
}

export async function postAnnouncement(body: AnnouncementInput) {
  return await useAPI(`project/${body.project_id}/announcement/`, { body, method: 'POST' }) //.data.value
}

export async function patchAnnouncement(body: AnnouncementInput) {
  return await useAPI(`project/${body.project_id}/announcement/${body.id}/`, {
    body,
    method: 'PATCH',
  }) //.data.value
}

export async function deleteAnnouncement(body) {
  return await useAPI(`project/${body.project.id}/announcement/${body.id}/`, {
    method: 'DELETE',
  })
}

export async function applyAnnouncement(body: AnnouncementApplyInput) {
  return await useAPI(`project/${body.project_id}/announcement/${body.announcement_id}/apply/`, {
    body,
    method: 'POST',
  })
}
