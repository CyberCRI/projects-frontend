import type {
  ProjectCategoryCreateInput,
  ProjectCategoryPatchInput,
  ProjectCategoryPutInput,
} from '~/models/project-category.model'

import useAPI from '~/composables/useAPI'

import type { TagModel } from '~/models/tag.model'
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
  })
}

export async function patchProjectCategory(
  organizationCode: string,
  id: number,
  category: ProjectCategoryPatchInput | FormData
) {
  return await useAPI(`organization/${organizationCode}/category/${id}/`, {
    body: category,
    method: 'PATCH',
  })
}

export async function deleteProjectCategory(organizationCode: string, id: number) {
  return await useAPI(`organization/${organizationCode}/category/${id}/`, { method: 'DELETE' })
}

export async function getProjectCategory(organizationCode: string, id: number) {
  return await useAPI(`organization/${organizationCode}/category/${id}/`)
}

export async function getAllProjectCategories(organizationCode: string) {
  return await useAPI<PaginationResult<TagModel>>(`organization/${organizationCode}/category/`)
}

export async function getRootProjectCategory(organizationCode: string) {
  return await useAPI(`organization/${organizationCode}/categories-hierarchy/`)
}

export async function getProjectCategoriesHierarchy(organizationCode: string, rootId: number) {
  return await useAPI(`organization/${organizationCode}/category/${rootId}/hierarchy/`)
}

export async function postProjectCategoryBackground(organizationCode: string, { id, body }) {
  return await useAPI(`organization/${organizationCode}/category/${id}/background/`, {
    body,
    method: 'POST',
  })
}

export async function patchProjectCategoryBackground(
  organizationCode: string,
  { id, imageId, body }
) {
  return await useAPI(`organization/${organizationCode}/category/${id}/background/${imageId}/`, {
    body,
    method: 'PATCH',
  })
}

export async function deleteProjectCategoryBackground(
  organizationCode: string,
  { category_id, id }
) {
  return await useAPI(
    `organization/${organizationCode}/category/${category_id}/background/${id}/`,
    { method: 'DELETE' }
  )
}

export async function getProjectCategoriesFollow(userId: number) {
  return await useAPI(`user/${userId}/category-follow/`)
}

export async function postProjectCategoryFollow(userId: number, category_id: number) {
  return await useAPI(`user/${userId}/category-follow/`, { body: { category_id }, method: 'POST' })
}

export async function deleteProjectCategoryFollow(userId: number, category_follow_id: number) {
  return await useAPI(`user/${userId}/category-follow/${category_follow_id}/`, { method: 'DELETE' })
}
