import { axios, configFormData } from './api.config'
import {
    AddLinkedProjectInput,
    AddManyLinkedProjectInput,
    LinkedProject,
    ProjectHeaderOutput,
    ProjectModel,
    ProjectOutput,
    ProjectPatchInput,
} from '@/models/project.model'
import { APIParams, APIResponseList } from '@/api/types'
import { LanguageType, ProjectMemberRoleType } from '@/models/types'
import { _adaptParamsToGetQuery } from '@/api/utils.service'

export interface SearchParams extends APIParams {
    category?: number // id
    languages?: LanguageType[]
    member_role?: ProjectMemberRoleType[]
    members?: string[]
    ordering?: keyof ProjectModel // Field name to order by
    organizations?: number[]
    sdgs?: number[]
    tags?: string[]
}

export async function createProject(project): Promise<ProjectOutput> {
    const result = (
        await axios.post(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/`, project)
    ).data

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
            await postProjectHeader({ project_id: result.id, body: headerFormData })
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

export async function patchProject(
    id: string,
    project: ProjectPatchInput | FormData
): Promise<ProjectOutput> {
    return (
        await axios.patch(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${id}/`,
            project,
            project instanceof FormData ? configFormData : null
        )
    ).data
}

export async function deleteProject(id: string): Promise<void> {
    return (await axios.delete(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${id}/`))
        .data
}

export async function duplicateProject(id: string): Promise<ProjectOutput> {
    return (
        await axios.post(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${id}/duplicate/`)
    ).data
}

export async function addLinkedProject({
    id,
    body,
}: {
    id: string
    body: AddManyLinkedProjectInput
}): Promise<ProjectOutput> {
    return (
        await axios.post(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/project/${id}/linked-project/add-many/`,
            body
        )
    ).data
}

export async function patchLinkedProject({
    target_id,
    id,
    body,
}: {
    target_id: string
    id: number
    body: AddLinkedProjectInput
}): Promise<LinkedProject> {
    return (
        await axios.patch(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/project/${target_id}/linked-project/${id}/`,
            body
        )
    ).data
}

export async function deleteLinkedProject({
    id,
    project_id,
}: {
    id: number
    project_id: string
}): Promise<void> {
    return await axios.delete(
        `${
            import.meta.env.VITE_APP_API_DEFAULT_VERSION
        }/project/${project_id}/linked-project/${id}/`
    )
}

export async function getProject(slugOrId: string): Promise<ProjectOutput> {
    return (await axios.get(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${slugOrId}/`))
        .data
}

export async function getAllRecommendedProjects(
    params: APIParams
): Promise<APIResponseList<ProjectOutput>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/misc/top/`,
            _adaptParamsToGetQuery(params)
        )
    ).data
}

export async function getAllRandomProjects(
    params: APIParams
): Promise<APIResponseList<ProjectOutput>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/misc/random/`,
            _adaptParamsToGetQuery(params)
        )
    ).data
}

export async function getAllProjects(
    params: SearchParams
): Promise<APIResponseList<ProjectOutput>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/`,
            _adaptParamsToGetQuery(params)
        )
    ).data
}

export async function searchProjects(
    search: string,
    params: SearchParams
): Promise<APIResponseList<ProjectOutput>> {
    const url = search ? `search/project/${search}/` : 'search/project/'

    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/${url}`,
            _adaptParamsToGetQuery(params)
        )
    ).data
}

export async function searchGroups(
    search: string,
    params: SearchParams
): Promise<APIResponseList<ProjectOutput>> {
    const url = search ? `search/people-group/${search}/` : 'search/people-group/'

    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/${url}`,
            _adaptParamsToGetQuery(params)
        )
    ).data
}

export async function searchUser(
    search: string,
    params: SearchParams
): Promise<APIResponseList<ProjectOutput>> {
    const url = search ? `search/user/${search}/` : 'search/user/'
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/${url}`,
            _adaptParamsToGetQuery(params)
        )
    ).data
}

export async function searchAll(
    search: string | null,
    params: SearchParams
): Promise<APIResponseList<ProjectOutput>> {
    const url = search ? `search/global/${search}/` : 'search/global/'
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/${url}`,
            _adaptParamsToGetQuery(params)
        )
    ).data
}

export async function postProjectImage({ project_id, body }): Promise<number> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${project_id}/image/`,
            body
        )
    ).data
}

export async function postProjectHeader({ project_id, body }): Promise<ProjectHeaderOutput> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${project_id}/header/`,
            body,
            configFormData
        )
    ).data
}

export async function patchProjectHeader({
    project_id,
    image_id,
    body,
}): Promise<ProjectHeaderOutput> {
    return (
        await axios.patch(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/project/${project_id}/header/${image_id}/`,
            body,
            configFormData
        )
    ).data
}

export async function lockUnlockProject({ project_id, context }): Promise<ProjectOutput> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${project_id}/${context}/`
        )
    ).data
}
