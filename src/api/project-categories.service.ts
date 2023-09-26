import { axios, configFormData } from '@/api/api.config'
import { APIParams, APIResponseList } from '@/api/types'
import {
    ProjectCategoryCreateInput,
    ProjectCategoryOutput,
    ProjectCategoryPatchInput,
    ProjectCategoryPutInput,
} from '@/models/project-category.model'
import { ProjectCategoryBackgroundOutput } from '@/models/project-category.model'

export interface ProjectCategoryParams extends APIParams {
    organization?: number // id
}

export async function createProjectCategory(
    category: ProjectCategoryCreateInput | FormData
): Promise<ProjectCategoryOutput> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/category/`,
            category,
            category instanceof FormData ? configFormData : null
        )
    ).data
}

export async function putProjectCategory(
    id: number,
    category: ProjectCategoryPutInput | FormData
): Promise<ProjectCategoryOutput> {
    return (
        await axios.patch(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/category/${id}/`,
            category,
            category instanceof FormData ? configFormData : null
        )
    ).data
}

export async function patchProjectCategory(
    id: number,
    category: ProjectCategoryPatchInput | FormData
): Promise<ProjectCategoryOutput> {
    return (
        await axios.patch(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/category/${id}/`,
            category,
            category instanceof FormData ? configFormData : null
        )
    ).data
}

export async function deleteProjectCategory(id: number): Promise<void> {
    return (await axios.delete(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/category/${id}/`))
        .data
}

export async function getProjectCategory(id: number): Promise<ProjectCategoryOutput> {
    return (await axios.get(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/category/${id}/`)).data
}

export async function getAllProjectCategories(
    params: ProjectCategoryParams
): Promise<APIResponseList<ProjectCategoryOutput>> {
    return (
        await axios.get(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/category/`, { params })
    ).data
}

export async function postProjectCategoryBackground({
    id,
    body,
}): Promise<ProjectCategoryBackgroundOutput> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/category/${id}/background/`,
            body
        )
    ).data
}

export async function deleteProjectCategoryBackground({ category_id, id }): Promise<void> {
    return await axios.delete(
        `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/category/${category_id}/background/${id}/`
    )
}
