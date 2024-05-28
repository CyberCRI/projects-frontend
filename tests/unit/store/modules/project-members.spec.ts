import ProjectMembersStore from '@/store/modules/project-members'
import { addProjectMembers, deleteProjectMembers } from '@/api/project-members.service'
import {
    ProjectMemberAddEntryFactory,
    ProjectMemberDeleteInputFactory,
} from '../../../factories/project-member.factory'
import { ProjectFactory } from '../../../factories/project.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
vi.mock('@/api/project-members.service')
vi.mock('@/analytics')

vi.mock('vuex')
const project = ProjectFactory.generate()

describe('Store module | Project-members | actions', () => {
    const commit = vi.fn()
    const rootState = {
        projects: {
            project,
        },
    }

    it('addProjectMembers', async () => {
        const projectMembers = [ProjectMemberAddEntryFactory.generate()]
        const addProjectMembersMock = addProjectMembers as Mock
        const projectId = '1234'
        addProjectMembersMock.mockResolvedValue({ results: projectMembers })

        await ProjectMembersStore.actions.addProjectMembers(
            { commit },
            { projectId: projectId, projectMembers: { members: projectMembers } }
        )

        expect(addProjectMembersMock).toHaveBeenCalledWith(projectId, { members: projectMembers })
    })

    it('deleteProjectMember', async () => {
        const projectMembers = ProjectMemberDeleteInputFactory.generate()
        const deleteProjectMembersMock = deleteProjectMembers as Mock

        deleteProjectMembersMock.mockResolvedValue({ results: projectMembers })

        await ProjectMembersStore.actions.deleteProjectMember({ commit, rootState }, projectMembers)

        expect(deleteProjectMembersMock).toHaveBeenCalledWith(project.id, projectMembers)
    })
})
