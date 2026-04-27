import type {
  ProjectMessageInputModel,
  ProjectMessageModel,
  QueryFilterProjectMessage,
} from '@/models/project-message.model'
import useAPI from '@/composables/useAPI'
import { ProjectSlugOrId } from '@/models/project.model'

type Config = UseApiOptions<QueryFilterProjectMessage>

export async function getProjectMessages(projectId: ProjectSlugOrId, config: Config = {}) {
  return await useAPI<PaginationResult<ProjectMessageModel>>(
    `project/${projectId}/project-message/`,
    config
  )
}

export async function postProjectMessage(
  projectMessage: ProjectMessageInputModel,
  config: Config = {}
) {
  return await useAPI<ProjectMessageModel>(
    `project/${projectMessage.project_id}/project-message/`,
    {
      body: projectMessage,
      method: 'POST',
      ...config,
    }
  )
}

export async function getProjectMessage(body: ProjectMessageInputModel, config: Config = {}) {
  return await useAPI<ProjectMessageModel>(
    `project/${body.project_id}/project-message/${body.project_message_id}/`,
    config
  )
}

export async function patchProjectMessage(
  messageId: ProjectMessageModel['id'],
  projectMessage: ProjectMessageInputModel,
  config: Config = {}
) {
  return await useAPI<ProjectMessageModel>(
    `project/${projectMessage.project_id}/project-message/${messageId}/`,
    {
      body: projectMessage,
      method: 'PATCH',
      ...config,
    }
  )
}

export async function deleteProjectMessage(
  projectId: ProjectSlugOrId,
  projectMessageId: ProjectMessageModel['id'],
  config: Config = {}
) {
  return await useAPI<void>(`project/${projectId}/project-message/${projectMessageId}/`, {
    method: 'DELETE',
    ...config,
  })
}

export async function postProjectMessageImage(
  projectId: ProjectSlugOrId,
  body: any,
  config: Config = {}
): Promise<any> {
  return await useAPI(`project/${projectId}/project-message-image/`, {
    body,
    method: 'POST',
    ...config,
  })
}
