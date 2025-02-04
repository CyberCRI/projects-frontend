import type {
    AddLinkedProjectInput,
    AddManyLinkedProjectInput,
    LinkedProject,
    ProjectHeaderOutput,
    ProjectOutput,
    ProjectPatchInput,
} from '@/models/project.model'
import type { APIParams, APIResponseList, SearchParams } from '@/api/types'
import { _adaptParamsToGetQuery } from '@/api/utils.service'
import useAPI, { getFormDataHeaders } from '@/composables/useAPI'

export async function createProject(project) {
    const result: any = (await useAPI(`/project/`, { body: project })).data

    if (project.header_image instanceof File && result) {
        const headerFormData = new FormData()
        headerFormData.append('file', project['header_image'], project['header_image'].name)

        const imageSizes = project['imageSizes']
        headerFormData.append('scale_x', imageSizes ? imageSizes.scaleX : '')
        headerFormData.append('scale_y', imageSizes ? imageSizes.scaleY : '')
        headerFormData.append('left', imageSizes ? imageSizes.left : '')
        headerFormData.append('top', imageSizes ? imageSizes.top : '')
        headerFormData.append('natural_ratio', imageSizes ? imageSizes.naturalRatio : '')
        project.header_image_id = (
            (await postProjectHeader({ project_id: result.id, body: headerFormData })) as any
        ).id
    }
    delete project.header_image

    // TODO: make this in POST when backend allows it
    if (project['imageSizes'] && project.header_image_id) {
        const headerFormData = new FormData()
        const imageSizes = project['imageSizes']
        headerFormData.append('scale_x', imageSizes ? imageSizes.scaleX : null)
        headerFormData.append('scale_y', imageSizes ? imageSizes.scaleY : null)
        headerFormData.append('left', imageSizes ? imageSizes.left : null)
        headerFormData.append('top', imageSizes ? imageSizes.top : null)
        headerFormData.append('natural_ratio', imageSizes ? imageSizes.naturalRatio : null)
        await patchProjectHeader({
            project_id: result.id,
            image_id: project.header_image_id,
            body: headerFormData,
        })
    }
    delete project.imageSizes

    return result
}

export async function patchProject(id: string, project: ProjectPatchInput | FormData) {
    const extraHeaders = project instanceof FormData ? getFormDataHeaders() : {}
    return (await useAPI(`/project/${id}/`, { body: project, method: 'PATCH', ...extraHeaders }))
        .data
}

export async function deleteProject(id: string) {
    return (await useAPI(`/project/${id}/`, { method: 'DELETE' })).data
}

export async function duplicateProject(id: string) {
    return (await useAPI(`/project/${id}/duplicate/`, { method: 'POST' })).data
}

export async function addLinkedProject({
    id,
    body,
}: {
    id: string
    body: AddManyLinkedProjectInput
}) {
    return (await useAPI(`/project/${id}/linked-project/add-many/`, { body, method: 'POST' })).data
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
    return (await useAPI(`/project/${target_id}/linked-project/${id}/`, { body, method: 'PATCH' }))
        .data
}

export async function deleteLinkedProject({ id, project_id }: { id: number; project_id: string }) {
    return await useAPI(`/project/${project_id}/linked-project/${id}/`, { method: 'DELETE' })
}

export async function getProject(slugOrId: string, noError: boolean = false) {
    return (
        await useAPI(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${slugOrId}/`, {
            noError: noError,
        })
    ).data
}

export async function getAllRecommendedProjects(params: APIParams) {
    return (await useAPI(`/project/misc/top/`, { params: _adaptParamsToGetQuery(params) })).data
}

export async function getAllRandomProjects(params: APIParams) {
    return (await useAPI(`/project/misc/random/`, { params: _adaptParamsToGetQuery(params) })).data
}

export async function getAllProjects(params: SearchParams) {
    return (await useAPI(`/project/`, { params: _adaptParamsToGetQuery(params) })).data
}

export async function postProjectImage({ project_id, body }) {
    return (await useAPI(`/project/${project_id}/image/`, { body, method: 'POST' })).data
}

export async function postProjectHeader({ project_id, body }) {
    return (
        await useAPI(`/project/${project_id}/header/`, {
            body,
            method: 'POST',
            ...getFormDataHeaders(),
        })
    ).data
}

export async function patchProjectHeader({ project_id, image_id, body }) {
    return (
        await useAPI(`/project/${project_id}/header/${image_id}/`, {
            body,
            method: 'PATCH',
            ...getFormDataHeaders(),
        })
    ).data
}

export async function lockUnlockProject({ project_id, context }) {
    return (await useAPI(`/project/${project_id}/${context}/`, { method: 'POST' })).data
}
