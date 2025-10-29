import type {
  ProjectCategoryCreateInput,
  // ProjectCategoryOutput,
  ProjectCategoryPatchInput,
  ProjectCategoryPutInput,
} from '@/models/project-category.model'
// import type { ProjectCategoryBackgroundOutput } from '@/models/project-category.model'
import useAPI from '@/composables/useAPI'

export async function createProjectCategory(
  organizationCode: string,
  category: ProjectCategoryCreateInput | FormData
) {
  return await useAPI(`organization/${organizationCode}/category/`, {
    body: category,
    method: 'POST',
  }) // .data.value
}

export async function putProjectCategory(
  organizationCode: string,
  id: number,
  category: ProjectCategoryPutInput | FormData
) {
  return await useAPI(`organization/${organizationCode}/category/${id}/`, {
    body: category,
    method: 'PATCH',
  }) //.data.value
}

export async function patchProjectCategory(
  organizationCode: string,
  id: number,
  category: ProjectCategoryPatchInput | FormData
) {
  return await useAPI(`organization/${organizationCode}/category/${id}/`, {
    body: category,
    method: 'PATCH',
  }) //.data.value
}

export async function deleteProjectCategory(organizationCode: string, id: number) {
  return await useAPI(`organization/${organizationCode}/category/${id}/`, { method: 'DELETE' }) //.data.value
}

export async function getProjectCategory(organizationCode: string, id: number) {
  return await useAPI(`organization/${organizationCode}/category/${id}`)
}

export async function getAllProjectCategories(organizationCode: string) {
  return await useAPI(`organization/${organizationCode}/category/`)
}

export async function getProjectCategoriesHierarchy(organizationCode: string, rootId: number) {
  return await useAPI(`organization/${organizationCode}/category/${rootId}/hierarchy/`) //.data.value
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
