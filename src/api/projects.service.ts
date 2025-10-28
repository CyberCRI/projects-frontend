import type {
  AddLinkedProjectInput,
  AddManyLinkedProjectInput,
  // LinkedProject,
  // ProjectHeaderOutput,
  // ProjectOutput,
  ProjectPatchInput,
} from '@/models/project.model'
import type { APIParams /*, APIResponseList*/, SearchParams } from '@/api/types'
import { _adaptParamsToGetQuery } from '@/api/utils.service'
import useAPI from '@/composables/useAPI'

import { imageSizesFormData } from '@/functs/imageSizesUtils'

export async function createProject(project) {
  const result: any = await useAPI(`project/`, { body: project, method: 'POST' }) //.data.value
  return result
}

export async function createProjectHeader(projectId, project) {
  if (project.header_image instanceof File && projectId) {
    const headerFormData = new FormData()
    headerFormData.append('file', project['header_image'], project['header_image'].name)

    const imageSizes = project['imageSizes']
    imageSizesFormData(headerFormData, imageSizes)
    project.header_image_id = (
      (await postProjectHeader({ project_id: projectId, body: headerFormData })) as any
    ).id
    return project.header_image_id
  }

  return false
}

export async function patchProject(id: string, project: ProjectPatchInput | FormData) {
  return await useAPI(`project/${id}/`, { body: project, method: 'PATCH' /*, ...extraHeaders*/ })
  //.data.value
}

export async function deleteProject(id: string) {
  return await useAPI(`project/${id}/`, { method: 'DELETE' }) //.data.value
}

export async function duplicateProject(id: string) {
  return await useAPI(`project/${id}/duplicate/`, { method: 'POST' }) //.data.value
}

export async function addLinkedProject({
  id,
  body,
}: {
  id: string
  body: AddManyLinkedProjectInput
}) {
  return await useAPI(`project/${id}/linked-project/add-many/`, { body, method: 'POST' }) //.data.value
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
  //.data.value
}

export async function deleteLinkedProject({ id, project_id }: { id: number; project_id: string }) {
  return await useAPI(`project/${project_id}/linked-project/${id}/`, { method: 'DELETE' })
}

export async function getProject(slugOrId: string, noError: boolean = false) {
  return await useAPI(`project/${slugOrId}/`, {
    noError: noError,
  }) //.data.value
}

export async function getAllRecommendedProjects(params: APIParams) {
  return await useAPI(`project/misc/top/`, { ..._adaptParamsToGetQuery(params) }) //.data.value
}

export async function getAllRandomProjects(params: APIParams) {
  return await useAPI(`project/misc/random/`, { ..._adaptParamsToGetQuery(params) }) //.data.value
}

export async function getAllProjects(params: SearchParams) {
  return await useAPI(`project/`, { ..._adaptParamsToGetQuery(params) }) //.data.value
}

export async function postProjectImage({ project_id, body }) {
  return await useAPI(`project/${project_id}/image/`, { body, method: 'POST' }) //.data.value
}

export async function postProjectHeader({ project_id, body }) {
  return await useAPI(`project/${project_id}/header/`, {
    body,
    method: 'POST',
  }) //.data.value
}

export async function patchProjectHeader({ project_id, image_id, body }) {
  return await useAPI(`project/${project_id}/header/${image_id}/`, {
    body,
    method: 'PATCH',
  }) //.data.value
}

export async function lockUnlockProject({ project_id, context }) {
  return await useAPI(`project/${project_id}/${context}/`, { method: 'POST' }) //.data.value
}
