import type { APIParams /*, APIResponseList*/ } from '@/api/types'
import type {
  ProjectCategoryCreateInput,
  // ProjectCategoryOutput,
  ProjectCategoryPatchInput,
  ProjectCategoryPutInput,
} from '@/models/project-category.model'
// import type { ProjectCategoryBackgroundOutput } from '@/models/project-category.model'
import useAPI from '@/composables/useAPI'

export interface ProjectCategoryParams extends APIParams {
  organization?: string // id
}

export async function createProjectCategory(category: ProjectCategoryCreateInput | FormData) {
  return await useAPI(`category/`, { body: category, method: 'POST' }) // .data.value
}

export async function putProjectCategory(id: number, category: ProjectCategoryPutInput | FormData) {
  return await useAPI(`category/${id}/`, {
    body: category,
    method: 'PATCH',
  }) //.data.value
}

export async function patchProjectCategory(
  id: number,
  category: ProjectCategoryPatchInput | FormData
) {
  return await useAPI(`category/${id}/`, {
    body: category,
    method: 'PATCH',
  }) //.data.value
}

export async function deleteProjectCategory(id: number) {
  return await useAPI(`category/${id}/`, { method: 'DELETE' }) //.data.value
}

export async function getProjectCategory(id: number) {
  return await useAPI(`category/${id}/`, {}) //.data.value
}

export async function getAllProjectCategories(params: ProjectCategoryParams) {
  return await useAPI(`category/`, { params }) //.data.value
  // TODO: fix for new categories endpoint - to use later
  // return await useAPI(`organization/${params.organization}/category/`, { params }) //.data.value
}

export async function getProjectCategoriesHierarchy(rootId: number, params: ProjectCategoryParams) {
  return await useAPI(`category/${rootId}/hierarchy/`, {
    params,
  }) //.data.value
}

export async function postProjectCategoryBackground({ id, body }) {
  return await useAPI(`category/${id}/background/`, { body, method: 'POST' }) //.data.value
}

export async function patchProjectCategoryBackground({ id, imageId, body }) {
  return await useAPI(`category/${id}/background/${imageId}/`, { body, method: 'PATCH' }) //.data.value
}

export async function deleteProjectCategoryBackground({ category_id, id }) {
  return await useAPI(`category/${category_id}/background/${id}/`, { method: 'DELETE' })
}
