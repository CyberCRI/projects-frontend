import projectsStore from '@/store/modules/projects'
import {
    createProject,
    deleteProject,
    duplicateProject,
    getAllProjects,
    getAllRandomProjects,
    getAllRecommendedProjects,
    getProject,
    patchProject,
    lockUnlockProject,
} from '@/api/projects.service'

import analytics from '@/analytics'

import { ProjectFactory, ProjectOutputFactory } from '../../../factories/project.factory'
import { OrganizationOutputFactory } from '../../../factories/organization.factory'
import TagFactory from '../../../factories/wikipedia-tag.factory'

import { describe, expect, it, vi, Mock } from 'vitest'
vi.mock('@/api/projects.service')
vi.mock('@/analytics')

vi.mock('vuex')
const rootState = {
    projects: {
        project: {
            ...ProjectFactory.generate(),
            linked_projects: [{ id: 1, project: ProjectFactory.generate(), reason: 'Inspiré de' }],
        },
    },

    organizations: { current: OrganizationOutputFactory.generate() },
}

const getters = {
    'users/id': () => 123,
}

describe('Store module | projects | getters', () => {
    const project = ProjectOutputFactory.generate()
    const state = {
        project: project,
        currentProjectId: project.id,
        currentProjectSlug: project.slug,
    }

    it('project', () => {
        const result = projectsStore.getters.project(state)

        expect(result).toBe(state.project)
    })
    it('currentProjectId', () => {
        const result = projectsStore.getters.currentProjectId(state)

        expect(result).toBe(state.currentProjectId)
    })
    it('currentProjectSlug', () => {
        const result = projectsStore.getters.currentProjectSlug(state)

        expect(result).toBe(state.currentProjectSlug)
    })
})

describe('Store module | projects | actions', () => {
    const commit = vi.fn()
    const dispatch = vi.fn()

    it('addProject', async () => {
        const project = ProjectOutputFactory.generate()
        const formData = new FormData()
        for (const key in project) {
            formData.append(key, project[key])
        }
        const createProjectMock = createProject as Mock
        const createMock = analytics.project.create as Mock

        createProjectMock.mockResolvedValue(project)

        const result = await projectsStore.actions.addProject({ dispatch, getters }, formData)

        expect(createProjectMock).toHaveBeenCalledWith(formData)
        expect(result).toBe(project)
        expect(createMock).toHaveBeenCalledWith({ id: result.id, title: result.title })
    })

    it('updateProject', async () => {
        const project = ProjectOutputFactory.generate()
        const patchProjectMock = patchProject as Mock

        patchProjectMock.mockResolvedValue(project)

        const result = await projectsStore.actions.updateProject(
            { commit },
            { id: project.id, project, scope: 'scope' }
        )

        expect(patchProjectMock).toHaveBeenCalledWith(project.id, project)
        expect(result).toBe(project)
        expect(commit).toHaveBeenCalledWith('SET_CURRENT_PROJECT', result)
    })

    it('deleteProject', async () => {
        const project = ProjectOutputFactory.generate()
        const deleteProjectMock = deleteProject as Mock
        const deleteMock = analytics.project.delete as Mock

        deleteProjectMock.mockResolvedValue(project)

        const result = await projectsStore.actions.deleteProject({}, project.id)

        expect(deleteProjectMock).toHaveBeenCalledWith(project.id)
        expect(result).toBe(project)
        expect(deleteMock).toHaveBeenCalledWith({ id: project.id })
    })

    it('duplicateProject', async () => {
        const project = ProjectOutputFactory.generate()
        const duplicateProjectMock = duplicateProject as Mock
        const duplicateMock = analytics.project.duplicate as Mock

        duplicateProjectMock.mockResolvedValue(project)

        const result = await projectsStore.actions.duplicateProject(
            { dispatch, getters },
            project.id
        )

        expect(duplicateProjectMock).toHaveBeenCalledWith(project.id)
        expect(result).toBe(project)
        expect(duplicateMock).toHaveBeenCalledWith(project.id, result.id)
    })

    it('getProject', async () => {
        const project = ProjectOutputFactory.generate()
        const getProjectMock = getProject as Mock

        getProjectMock.mockResolvedValue(project)

        const result = await projectsStore.actions.getProject({ commit }, project.id)

        expect(getProjectMock).toHaveBeenCalledWith(project.id)
        expect(result).toBe(project)
        expect(commit).toHaveBeenCalledWith('SET_CURRENT_PROJECT', result)
    })

    it('getAllRecommendedProjects', async () => {
        const projects = ProjectOutputFactory.generateMany(2)
        const getAllRecommendedProjectsMock = getAllRecommendedProjects as Mock
        const params = {
            organizations: [rootState.organizations.current.code],
        }

        getAllRecommendedProjectsMock.mockResolvedValue(projects)

        const result = await projectsStore.actions.getAllRecommendedProjects({ rootState }, {})

        expect(getAllRecommendedProjectsMock).toHaveBeenCalledWith(params)
        expect(result).toBe(projects)
    })

    it('getAllRandomProjects', async () => {
        const projects = ProjectOutputFactory.generateMany(2)
        const getAllRandomProjectsMock = getAllRandomProjects as Mock
        const params = {
            organizations: [rootState.organizations.current.code],
        }

        getAllRandomProjectsMock.mockResolvedValue(projects)

        const result = await projectsStore.actions.getAllRandomProjects({ rootState }, {})

        expect(getAllRandomProjectsMock).toHaveBeenCalledWith(params)
        expect(result).toBe(projects)
    })

    it('getAllProjects', async () => {
        const projects = ProjectOutputFactory.generateMany(2)
        const getAllProjectsMock = getAllProjects as Mock
        const searchProjectsMock = analytics.project.search as Mock
        const params = {
            organizations: [rootState.organizations.current.code],
        }

        getAllProjectsMock.mockResolvedValue(projects)

        const result = await projectsStore.actions.getAllProjects({ rootState }, {})

        expect(getAllProjectsMock).toHaveBeenCalledWith(params)
        expect(searchProjectsMock).toHaveBeenCalledWith(params)
        expect(result).toBe(projects)
    })

    it('lockUnlockProject context lock', async () => {
        const project = ProjectOutputFactory.generate()
        const getLockUnlockProjectMock = lockUnlockProject as Mock
        const params = {
            project_id: project.id,
            context: 'lock',
        }

        getLockUnlockProjectMock.mockResolvedValue(project)

        const result = await projectsStore.actions.lockUnlockProject(
            { commit },
            {
                project_id: project.id,
                context: 'lock',
            }
        )

        expect(getLockUnlockProjectMock).toHaveBeenCalledWith(params)
        expect(result).toBe(project)
        expect(commit).toHaveBeenLastCalledWith('SET_PROJECT_LOCK', true)
    })
})

describe('Store module | projects | mutations', () => {
    const state = {
        project: ProjectOutputFactory.generate(),
        projectNotification: null,
        projectFollowNotification: null,
    }

    // PROJECT
    it('SET_CURRENT_PROJECT', () => {
        const payload = ProjectOutputFactory.generate()
        projectsStore.mutations.SET_CURRENT_PROJECT(state, payload)

        expect(state.project).toEqual(payload)
    })

    it('DELETE_CURRENT_PROJECT', () => {
        projectsStore.mutations.DELETE_CURRENT_PROJECT(state)

        expect(state.project).toEqual(null)

        // Set again current project after last delete to continue testing
        const payload = ProjectOutputFactory.generate()
        projectsStore.mutations.SET_CURRENT_PROJECT(state, payload)
    })

    it('SET_PROJECT_DESCRIPTION', () => {
        const payload = '123456'
        projectsStore.mutations.SET_PROJECT_DESCRIPTION(state, payload)

        expect(state.project.description).toEqual(payload)
    })

    it('SET_PROJECT_VISIBILITY', () => {
        const payload = 'public'
        projectsStore.mutations.SET_PROJECT_VISIBILITY(state, payload)

        expect(state.project.publication_status).toEqual(payload)
    })

    it('SET_PROJECT_LOCK', () => {
        const payload = true
        projectsStore.mutations.SET_PROJECT_LOCK(state, payload)

        expect(state.project.is_locked).toEqual(payload)
    })
})
