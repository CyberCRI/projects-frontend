import type {
  ProjectCategoryCreateInput,
  ProjectCategoryModel,
  ProjectCategoryPatchInput,
  ProjectCategoryPutInput,
} from '~/models/project-category.model'

import type { UseApiOptions } from '~/composables/useAPI'
import useAPI from '~/composables/useAPI'

import type { OrganizationModel } from '~/models/organization.model'

type Config = UseApiOptions

export async function createProjectCategory(
  organizationCode: OrganizationModel['code'],
  category: ProjectCategoryCreateInput | FormData
) {
  return await useAPI(`organization/${organizationCode}/category/`, {
    body: category,
    method: 'POST',
  }) // .data.value
}

export async function putProjectCategory(
  organizationCode: OrganizationModel['code'],
  id: number,
  category: ProjectCategoryPutInput | FormData
) {
  return await useAPI(`organization/${organizationCode}/category/${id}/`, {
    body: category,
    method: 'PATCH',
  })
}

export async function patchProjectCategory(
  organizationCode: OrganizationModel['code'],
  id: number,
  category: ProjectCategoryPatchInput | FormData
) {
  return await useAPI(`organization/${organizationCode}/category/${id}/`, {
    body: category,
    method: 'PATCH',
  })
}

export async function deleteProjectCategory(
  organizationCode: OrganizationModel['code'],
  id: number
) {
  return await useAPI(`organization/${organizationCode}/category/${id}/`, { method: 'DELETE' })
}

export async function getProjectCategory(organizationCode: OrganizationModel['code'], id: number) {
  return await useAPI(`organization/${organizationCode}/category/${id}/`)
}

export async function getAllProjectCategories(
  organizationCode: OrganizationModel['code'],
  config: Config = {}
) {
  return await useAPI<PaginationResult<ProjectCategoryModel>>(
    `organization/${organizationCode}/category/`,
    config
  )
}

export async function getRootProjectCategory(organizationCode: OrganizationModel['code']) {
  return await useAPI(`organization/${organizationCode}/categories-hierarchy/`)
}

export async function getProjectCategoriesHierarchy(
  organizationCode: OrganizationModel['code'],
  rootId: number
) {
  return await useAPI(`organization/${organizationCode}/category/${rootId}/hierarchy/`)
}

export async function postProjectCategoryBackground(
  organizationCode: OrganizationModel['code'],
  { id, body }
) {
  return await useAPI(`organization/${organizationCode}/category/${id}/background/`, {
    body,
    method: 'POST',
  })
}

export async function patchProjectCategoryBackground(
  organizationCode: OrganizationModel['code'],
  { id, imageId, body }
) {
  return await useAPI(`organization/${organizationCode}/category/${id}/background/${imageId}/`, {
    body,
    method: 'PATCH',
  })
}

export async function deleteProjectCategoryBackground(
  organizationCode: OrganizationModel['code'],
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
