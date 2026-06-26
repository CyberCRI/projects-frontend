import type {
  AddManyLinkedProjectInput,
  ProjectForm,
  ProjectModel,
  ProjectSlugOrId,
  QueryFilterProjectSimilars,
} from '@/models/project.model'
import { _adaptParamsToGetQuery } from '@/api/utils.service'
import type { UseApiOptions } from '@/composables/useAPI'
import useAPI from '@/composables/useAPI'

import type {
  ProjectMemberModel,
  QueryFilterProject,
  QueryFilterProjectMembers,
} from '@/models/project-member.model'
import type { ImageModelCreated, ImageModel } from '~/models/image.model'
import type { PeopleGroupModel } from '~/models/invitation.model'

type ConfigProject = UseApiOptions<QueryFilterProject>
type ConfigProjectLinked = UseApiOptions<Partial<PaginationQuery>>
type ConfigProjectMembers = UseApiOptions<QueryFilterProjectMembers>

export async function getAllProjects(config: ConfigProject = {}) {
  return await useAPI<PaginationResult<ProjectModel>>(`project/`, config)
}

export async function getProject(projectSlugOrId: ProjectSlugOrId, config: ConfigProject = {}) {
  return await useAPI<ProjectModel>(`project/${projectSlugOrId}/`, config)
}

export function postProject(body: ProjectForm) {
  return useAPI(`project/`, { body, method: 'POST' })
}

export async function patchProject(projectId: ProjectSlugOrId, project: ProjectForm) {
  return await useAPI<ProjectModel>(`project/${projectId}/`, { body: project, method: 'PATCH' })
}

export async function deleteProject(projectId: ProjectSlugOrId) {
  return await useAPI<undefined>(`project/${projectId}/`, { method: 'DELETE' })
}

export async function duplicateProject(projectId: ProjectSlugOrId) {
  return await useAPI<ProjectModel>(`project/${projectId}/duplicate/`, { method: 'POST' })
}

export async function getLinkedProject(
  projectId: ProjectSlugOrId,
  config: ConfigProjectLinked = {}
) {
  return await useAPI<PaginationResult<ProjectModel>>(
    `project/${projectId}/linked-project/`,
    config
  )
}

export async function addLinkedProject(
  projectId: ProjectSlugOrId,
  body: AddManyLinkedProjectInput
) {
  return await useAPI(`project/${projectId}/linked-project/add-many/`, { body, method: 'POST' })
}

export async function deleteLinkedProject(projectId: ProjectSlugOrId, linkedProjectId) {
  return await useAPI<undefined>(`project/${projectId}/linked-project/${linkedProjectId}/`, {
    method: 'DELETE',
  })
}

export async function getProjectMembers(
  projectSlugOrId: ProjectSlugOrId,
  config: ConfigProjectMembers = {}
) {
  return await useAPI<PaginationResult<ProjectMemberModel>>(
    `project/${projectSlugOrId}/member/`,
    config
  )
}

export async function postProjectImage(projectId: ProjectSlugOrId, body: FormData) {
  return await useAPI<ImageModelCreated>(`project/${projectId}/image/`, { body, method: 'POST' })
}

export async function postProjectHeader(projectId: ProjectSlugOrId, body: any) {
  return await useAPI<ImageModelCreated>(`project/${projectId}/header/`, {
    body,
    method: 'POST',
  })
}

export async function patchProjectHeader(
  projectId: ProjectSlugOrId,
  imageId: ImageModel['id'],
  body: any
) {
  return await useAPI<ImageModel>(`project/${projectId}/header/${imageId}/`, {
    body,
    method: 'PATCH',
  })
}

export async function lockUnlockProject({ project_id, context }) {
  return await useAPI(`project/${project_id}/${context}/`, { method: 'POST' })
}

export type ConfigSimilar = UseApiOptions<QueryFilterProjectSimilars>

export async function getProjectSimilars(projectId: ProjectSlugOrId, config: ConfigSimilar = {}) {
  return await useAPI<PaginationResult<ProjectModel>>(`/project/${projectId}/similar/`, config)
}

type ConfigProjectGroup = UseApiOptions<Partial<PaginationQuery>>

export async function getProjectGroups(
  projectId: ProjectSlugOrId,
  config: ConfigProjectGroup = {}
) {
  return await useAPI<PaginationResult<PeopleGroupModel>>(`/project/${projectId}/group/`, config)
}
