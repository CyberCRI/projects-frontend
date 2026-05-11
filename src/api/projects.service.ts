import type {
  AddLinkedProjectInput,
  AddManyLinkedProjectInput,
  ProjectForm,
  ProjectModel,
  ProjectSlugOrId,
} from '@/models/project.model'
import { _adaptParamsToGetQuery } from '@/api/utils.service'
import type { SearchParams } from '@/api/types'
import useAPI from '@/composables/useAPI'

import type { ProjectMemberModel, QueryFilterProjectMembers } from '@/models/project-member.model'
import { imageSizesFormData } from '@/functs/imageSizesUtils'
import type { ImageModel } from '~/models/image.model'

type Config = UseApiOptions
type ConfigMembers = UseApiOptions<QueryFilterProjectMembers>

export async function createProject(project) {
  const result: any = await useAPI(`project/`, { body: project, method: 'POST' })
  return result
}

export async function createProjectHeader(projectId, project) {
  if (project.header_image instanceof File && projectId) {
    const headerFormData = new FormData()
    headerFormData.append('file', project['header_image'], project['header_image'].name)

    const imageSizes = project['imageSizes']
    imageSizesFormData(headerFormData, imageSizes)
    project.header_image_id = ((await postProjectHeader(projectId, headerFormData)) as any).id
    return project.header_image_id
  }

  return false
}

export async function patchProject(projectId: ProjectSlugOrId, project: ProjectForm) {
  return await useAPI<ProjectModel>(`project/${projectId}/`, { body: project, method: 'PATCH' })
}

export async function deleteProject(projectId: ProjectSlugOrId) {
  return await useAPI<ProjectModel>(`project/${projectId}/`, { method: 'DELETE' })
}

export async function duplicateProject(projectId: ProjectSlugOrId) {
  return await useAPI<ProjectModel>(`project/${projectId}/duplicate/`, { method: 'POST' })
}

export async function getLinkedProject(projectId: ProjectSlugOrId, config: Config = {}) {
  return await useAPI<PaginationResult<ProjectModel>>(
    `project/${projectId}/linked-project/`,
    config
  )
}

export async function addLinkedProject({
  id,
  body,
}: {
  id: string
  body: AddManyLinkedProjectInput
}) {
  return await useAPI(`project/${id}/linked-project/add-many/`, { body, method: 'POST' })
}

export async function patchLinkedProject({
  target_id,
  id,
  body,
}: {
  target_id: string
  id: number
  body: AddLinkedProjectInput
}) {
  return await useAPI(`project/${target_id}/linked-project/${id}/`, { body, method: 'PATCH' })
}

export async function deleteLinkedProject(projectId: ProjectSlugOrId, linkedProjectId) {
  return await useAPI<undefined>(`project/${projectId}/linked-project/${linkedProjectId}/`, {
    method: 'DELETE',
  })
}

export async function getProject(projectSlugOrId: ProjectSlugOrId, config = {}) {
  return await useAPI<ProjectModel>(`project/${projectSlugOrId}/`, config)
}

export async function getProjectMembers(
  projectSlugOrId: ProjectSlugOrId,
  config: ConfigMembers = {}
) {
  return await useAPI<PaginationResult<ProjectMemberModel>>(
    `project/${projectSlugOrId}/members/`,
    config
  )
}

export async function getAllRecommendedProjects(params: SearchParams) {
  return await useAPI(`project/misc/top/`, { ..._adaptParamsToGetQuery(params) })
}

export async function getAllRandomProjects(params: SearchParams) {
  return await useAPI(`project/misc/random/`, { ..._adaptParamsToGetQuery(params) })
}

export async function getAllProjects(params: SearchParams) {
  return await useAPI(`project/`, { ..._adaptParamsToGetQuery(params) })
}

export async function postProjectImage(projectId: ProjectSlugOrId, body: FormData) {
  return await useAPI<ImageModel>(`project/${projectId}/image/`, { body, method: 'POST' })
}

export async function postProjectHeader(projectId: ProjectSlugOrId, body: any) {
  return await useAPI<ImageModel>(`project/${projectId}/header/`, {
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
