import type {
  ProjectMessageInputModel /*, ProjectMessageOutput */,
  ProjectMessageModel,
} from '@/models/project-message.model'
// import type { APIResponseList } from '@/api/types'
import useAPI from '@/composables/useAPI'
import { ProjectSlugOrId } from '@/models/project.model'

type Config = UseApiOptions<QueryFilterProjectMessage>

export async function getProjectMessages(projectId: ProjectSlugOrId, config: Config = {}) {
  return await useAPI<PaginationResult<ProjectMessageModel>>(
    `project/${projectId}/project-message/`,
    config
  )
}

export async function postProjectMessage(projectMessage: ProjectMessageInputModel) {
  return await useAPI<ProjectMessageModel>(
    `project/${projectMessage.project_id}/project-message/`,
    {
      body: projectMessage,
      method: 'POST',
    }
  )
}

export async function getProjectMessage(body: ProjectMessageInputModel) {
  return await useAPI<ProjectMessageModel>(
    `project/${body.project_id}/project-message/${body.project_message_id}/`,
    {}
  )
}

export async function patchProjectMessage(
  messageId: ProjectMessageModel['id'],
  projectMessage: ProjectMessageInputModel
) {
  return await useAPI<ProjectMessageModel>(
    `project/${projectMessage.project_id}/project-message/${messageId}/`,
    {
      body: projectMessage,
      method: 'PATCH',
    }
  )
}

export async function deleteProjectMessage(projectId: ProjectSlugOrId, id: number) {
  return await useAPI<void>(`project/${projectId}/project-message/${id}/`, { method: 'DELETE' })
}

export async function postProjectMessageImage(projectId: ProjectSlugOrId, body: any): Promise<any> {
  return await useAPI(`project/${projectId}/project-message-image/`, { body, method: 'POST' })
}
