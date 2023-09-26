import { axios } from '@/api/api.config'
import { ProjectMembersAddInput, ProjectMembersDeleteInput } from '@/models/project-member.model'
import { ProjectOutput } from '@/models/project.model'

export async function addProjectMembers(
    projectId: string,
    data: ProjectMembersAddInput
): Promise<ProjectOutput> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${projectId}/member/add/`,
            data
        )
    ).data
}

export async function deleteProjectMembers(
    projectId: string,
    data: ProjectMembersDeleteInput
): Promise<ProjectOutput> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${projectId}/member/remove/`,
            data
        )
    ).data
}
