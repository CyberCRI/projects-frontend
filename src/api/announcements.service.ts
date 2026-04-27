import type {
  AnnouncementInput,
  AnnouncementApplyInput,
  AnnouncementModel,
  QueryFilterAnnouncement,
} from '@/models/announcement.model'

import useAPI from '@/composables/useAPI'
import { ProjectSlugOrId } from '@/models/project.model'

type Config = UseApiOptions<QueryFilterAnnouncement>

export async function getAnnouncements(config: Config = {}) {
  return await useAPI<PaginationResult<AnnouncementModel>>(`announcement/`, config)
}

export async function getProjectAnnouncements(projectId: ProjectSlugOrId, config: Config = {}) {
  return await useAPI<PaginationResult<AnnouncementModel>>(
    `project/${projectId}/announcement/`,
    config
  )
}

export async function postAnnouncement(body: AnnouncementInput, config: Config = {}) {
  return await useAPI<AnnouncementModel>(`project/${body.project_id}/announcement/`, {
    body,
    method: 'POST',
    ...config,
  })
}

export async function patchAnnouncement(body: AnnouncementInput, config: Config = {}) {
  return await useAPI<AnnouncementModel>(`project/${body.project_id}/announcement/${body.id}/`, {
    body,
    method: 'PATCH',
    ...config,
  })
}

export async function deleteAnnouncement(body, config: Config = {}) {
  return await useAPI<void>(`project/${body.project.id}/announcement/${body.id}/`, {
    method: 'DELETE',
    ...config,
  })
}

export async function applyAnnouncement(body: AnnouncementApplyInput) {
  return await useAPI(`project/${body.project_id}/announcement/${body.announcement_id}/apply/`, {
    body,
    method: 'POST',
  })
}
