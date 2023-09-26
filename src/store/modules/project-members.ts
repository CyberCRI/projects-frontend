import { ProjectOutput } from '@/models/project.model'
import { ProjectMembersAddInput, ProjectMembersDeleteInput } from '@/models/project-member.model'
import { addProjectMembers, deleteProjectMembers } from '@/api/project-members.service'
import analytics from '@/analytics'

export interface ProjectMembersState {}

const state = (): ProjectMembersState => ({})

const getters = {}

const actions = {
    async addProjectMembers(
        { commit },
        { projectId, projectMembers }: { projectId: string; projectMembers: ProjectMembersAddInput }
    ): Promise<ProjectOutput> {
        try {
            const result = await addProjectMembers(projectId, projectMembers)

            analytics.project.addMember({
                project: {
                    id: projectId,
                },
                members: projectMembers,
            })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async deleteProjectMember(
        { commit, rootState },
        membersIds: ProjectMembersDeleteInput
    ): Promise<ProjectOutput> {
        const result = await deleteProjectMembers(rootState.projects.project.id, membersIds)

        analytics.project.removeTeamMember({
            project: {
                id: rootState.projects.project.id,
            },
            members: membersIds,
        })

        return result
    },
}

const mutations = {}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
