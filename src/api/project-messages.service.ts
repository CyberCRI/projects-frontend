import { axios } from '@/api/api.config'
import { ProjectMessageInputModel, ProjectMessageOutput } from '@/models/project-message.model'
import { APIResponseList } from '@/api/types'

export async function getProjectMessages(
    project_id: string
): Promise<APIResponseList<ProjectMessageOutput>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${project_id}/project-message/`
        )
    ).data
}

export async function postProjectMessage(
    projectMessage: ProjectMessageInputModel
): Promise<ProjectMessageOutput> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${
                projectMessage.project_id
            }/project-message/`,
            projectMessage
        )
    ).data
}

export async function getProjectMessage(
    body: ProjectMessageInputModel
): Promise<ProjectMessageOutput> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${body.project_id}/project-message/${
                body.project_message_id
            }/`
        )
    ).data
}

export async function patchProjectMessage(
    id: number,
    projectMessage: ProjectMessageInputModel
): Promise<ProjectMessageOutput> {
    return (
        await axios.patch(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${
                projectMessage.project_id
            }/project-message/${id}/`,
            projectMessage
        )
    ).data
}

export async function deleteProjectMessage(project_id: string, id: number): Promise<void> {
    return await axios.delete(
        `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${project_id}/project-message/${id}/`
    )
}

export async function postProjectMessageImage(project_id: string, body: any): Promise<any> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${project_id}/project-message-image/`,
            body
        )
    ).data
}
