import type { APIParams, APIResponseList } from '@/api/types'
import type {
    ProjectCategoryCreateInput,
    ProjectCategoryOutput,
    ProjectCategoryPatchInput,
    ProjectCategoryPutInput,
} from '@/models/project-category.model'
import type { ProjectCategoryBackgroundOutput } from '@/models/project-category.model'
import useAPI, { getFormDataHeaders } from '@/composables/useAPI'

export interface ProjectCategoryParams extends APIParams {
    organization?: number // id
}

export async function createProjectCategory(category: ProjectCategoryCreateInput | FormData) {
    const extraHeaders = category instanceof FormData ? getFormDataHeaders() : {}
    return (await useAPI(`category/`, { body: category, method: 'POST', ...extraHeaders })).data
}

export async function putProjectCategory(id: number, category: ProjectCategoryPutInput | FormData) {
    const extraHeaders = category instanceof FormData ? getFormDataHeaders() : {}
    return (
        await useAPI(`category/${id}/`, {
            body: category,
            method: 'PATCH',
            ...extraHeaders,
        })
    ).data
}

export async function patchProjectCategory(
    id: number,
    category: ProjectCategoryPatchInput | FormData
) {
    const extraHeaders = category instanceof FormData ? getFormDataHeaders() : {}
    return (
        await useAPI(`category/${id}/`, {
            body: category,
            method: 'PATCH',
            ...extraHeaders,
        })
    ).data
}

export async function deleteProjectCategory(id: number) {
    return (await useAPI(`category/${id}/`, { method: 'DELETE' })).data
}

export async function getProjectCategory(id: number) {
    return (await useAPI(`category/${id}/`, {})).data
}

export async function getAllProjectCategories(params: ProjectCategoryParams) {
    return (await useAPI(`category/`, { params })).data
}

export async function getProjectCategoriesHierarchy(rootId: number, params: ProjectCategoryParams) {
    return (
        await useAPI(`category/${rootId}/hierarchy/`, {
            params,
        })
    ).data
}

export async function postProjectCategoryBackground({ id, body }) {
    return (await useAPI(`category/${id}/background/`, { body, method: 'POST' })).data
}

export async function patchProjectCategoryBackground({ id, imageId, body }) {
    return (await useAPI(`category/${id}/background/${imageId}/`, { body, method: 'PATCH' })).data
}

export async function deleteProjectCategoryBackground({ category_id, id }) {
    return await useAPI(`category/${category_id}/background/${id}/`, { method: 'DELETE' })
}
