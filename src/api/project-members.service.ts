import type {
  ProjectMembersAddInput,
  ProjectMembersDeleteInput,
} from '~/models/project-member.model'

import useAPI from '~/composables/useAPI'

export async function addProjectMembers(projectId: string, data: ProjectMembersAddInput) {
  return await useAPI(`project/${projectId}/member/add/`, { body: data, method: 'POST' }) // .data.value
}

export async function deleteProjectMembers(projectId: string, data: ProjectMembersDeleteInput) {
  return await useAPI(`project/${projectId}/member/remove/`, { body: data, method: 'POST' })
}

export async function deleteProjectMembersSelf(projectId: string) {
  return await useAPI(`project/${projectId}/quit/`, { method: 'DELETE' })
}
