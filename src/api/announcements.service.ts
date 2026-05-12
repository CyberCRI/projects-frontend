import type {
  AnnouncementApplyInput,
  AnnouncementModel,
  QueryFilterAnnouncement,
  AnnouncementForm,
  AnnouncementId,
} from '@/models/announcement.model'

import type { ProjectSlugOrId } from '@/models/project.model'
import useAPI from '@/composables/useAPI'

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

export async function postAnnouncement(
  projectId: ProjectSlugOrId,
  body: AnnouncementForm,
  config: Config = {}
) {
  return await useAPI<AnnouncementModel>(`project/${projectId}/announcement/`, {
    body,
    method: 'POST',
    ...config,
  })
}

export async function patchAnnouncement(
  projectId: ProjectSlugOrId,
  announcementId: AnnouncementId,
  body: AnnouncementForm,
  config: Config = {}
) {
  return await useAPI<AnnouncementModel>(`project/${projectId}/announcement/${announcementId}/`, {
    body,
    method: 'PATCH',
    ...config,
  })
}

export async function deleteAnnouncement(
  projectId: ProjectSlugOrId,
  announcementId: AnnouncementId,
  config: Config = {}
) {
  return await useAPI<undefined>(`project/${projectId}/announcement/${announcementId}/`, {
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
