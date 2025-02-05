import type {
    ProjectMembersAddInput,
    ProjectMembersDeleteInput,
} from '@/models/project-member.model'
import type { ProjectOutput } from '@/models/project.model'
import useAPI from '@/composables/useAPI'

export async function addProjectMembers(projectId: string, data: ProjectMembersAddInput) {
    return (await useAPI(`project/${projectId}/member/add/`, { body: data, method: 'POST' })).data
}

export async function deleteProjectMembers(projectId: string, data: ProjectMembersDeleteInput) {
    return (await useAPI(`project/${projectId}/member/remove/`, { body: data, method: 'POST' }))
        .data
}

export async function deleteProjectMembersSelf(projectId: string) {
    return (await useAPI(`project/${projectId}/quit/`, { method: 'DELETE' })).data
}
