import type {
  ProjectMembersAddInput,
  ProjectMembersDeleteInput,
} from '~/models/project-member.model'

import type { ProjectSlugOrId } from '~/models/project.model'
import useAPI from '~/composables/useAPI'

export async function addProjectMembers(projectId: ProjectSlugOrId, data: ProjectMembersAddInput) {
  return await useAPI(`project/${projectId}/member/add/`, { body: data, method: 'POST' }) // .data.value
}

export async function deleteProjectMembers(
  projectId: ProjectSlugOrId,
  data: ProjectMembersDeleteInput
) {
  return await useAPI(`project/${projectId}/member/remove/`, { body: data, method: 'POST' })
}

export async function deleteProjectMembersSelf(projectId: ProjectSlugOrId) {
  return await useAPI(`project/${projectId}/quit/`, { method: 'DELETE' })
}
