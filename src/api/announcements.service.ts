import type { AnnouncementApplyInput, AnnouncementInput } from '~/models/announcement.model'

import useAPI from '~/composables/useAPI'

import utils from '~/functs/functions'

export async function getAnnouncements(params) {
  return await useAPI(`announcement/`, { ...utils.adaptParam(params) })
}

export async function getProjectAnnouncements(project_id: string, params: object) {
  return await useAPI(`project/${project_id}/announcement/`, {
    ...utils.adaptParam(params || {}),
  })
}

export async function postAnnouncement(body: AnnouncementInput) {
  return await useAPI(`project/${body.project_id}/announcement/`, { body, method: 'POST' })
}

export async function patchAnnouncement(body: AnnouncementInput) {
  return await useAPI(`project/${body.project_id}/announcement/${body.id}/`, {
    body,
    method: 'PATCH',
  })
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
