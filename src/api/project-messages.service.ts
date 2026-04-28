import type { ProjectMessageInputModel } from '~/models/project-message.model'

import useAPI from '~/composables/useAPI'

export async function getProjectMessages(project_id: string) {
  return await useAPI(`project/${project_id}/project-message/`, {})
}

export async function postProjectMessage(projectMessage: ProjectMessageInputModel) {
  return await useAPI(`project/${projectMessage.project_id}/project-message/`, {
    body: projectMessage,
    method: 'POST',
  })
}

export async function getProjectMessage(body: ProjectMessageInputModel) {
  return await useAPI(`project/${body.project_id}/project-message/${body.project_message_id}/`, {})
}

export async function patchProjectMessage(id: number, projectMessage: ProjectMessageInputModel) {
  return await useAPI(`project/${projectMessage.project_id}/project-message/${id}/`, {
    body: projectMessage,
    method: 'PATCH',
  })
}

export async function deleteProjectMessage(project_id: string, id: number) {
  return await useAPI(`project/${project_id}/project-message/${id}/`, { method: 'DELETE' })
}

export async function postProjectMessageImage(project_id: string, body: any): Promise<any> {
  return await useAPI(`project/${project_id}/project-message-image/`, { body, method: 'POST' })
}
