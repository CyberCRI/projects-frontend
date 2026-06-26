import type {
  ProjectMessageForm,
  ProjectMessageInputModel,
  ProjectMessageModel,
  QueryFilterProjectMessage,
} from '@/models/project-message.model'
import type { ProjectSlugOrId } from '@/models/project.model'
import type { ImageModelCreated } from '~/models/image.model'
import useAPI from '@/composables/useAPI'

type Config = UseApiOptions<QueryFilterProjectMessage>

export async function getProjectMessages(projectId: ProjectSlugOrId, config: Config = {}) {
  return await useAPI<PaginationResult<ProjectMessageModel>>(
    `project/${projectId}/project-message/`,
    config
  )
}

export async function postProjectMessage(projectId: ProjectSlugOrId, body: ProjectMessageForm) {
  return await useAPI<ProjectMessageModel>(`project/${projectId}/project-message/`, {
    body,
    method: 'POST',
  })
}

export async function getProjectMessage(body: ProjectMessageInputModel, config: Config = {}) {
  return await useAPI<ProjectMessageModel>(
    `project/${body.project_id}/project-message/${body.project_message_id}/`,
    config
  )
}

export async function patchProjectMessage(
  projectId: ProjectSlugOrId,
  messageId: ProjectMessageModel['id'],
  body: ProjectMessageForm
) {
  return await useAPI<ProjectMessageModel>(`project/${projectId}/project-message/${messageId}/`, {
    body,
    method: 'PATCH',
  })
}

export async function deleteProjectMessage(
  projectId: ProjectSlugOrId,
  projectMessageId: ProjectMessageModel['id'],
  config: Config = {}
) {
  return await useAPI<undefined>(`project/${projectId}/project-message/${projectMessageId}/`, {
    method: 'DELETE',
    ...config,
  })
}

export async function postProjectMessageImage(
  projectId: ProjectSlugOrId,
  body: FormData,
  config: Config = {}
): Promise<any> {
  return await useAPI<ImageModelCreated>(`project/${projectId}/project-message-image/`, {
    body,
    method: 'POST',
    ...config,
  })
}
