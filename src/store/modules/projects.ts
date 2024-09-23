import { APIResponseList, SearchParams } from '@/api/types'
import { ProjectOutput, ProjectPatchInput } from '@/models/project.model'
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
import { ProjectPublicationStatusType } from '@/models/types'

export interface ProjectState {
    project: ProjectOutput
}

const state = (): ProjectState => ({
    project: null,
})

const getters = {
    project: (state: ProjectState) => state.project,
    currentProjectId: (state: ProjectState) => (state.project ? state.project.id : undefined),
    currentProjectSlug: (state: ProjectState) => (state.project ? state.project.slug : undefined),
}

const actions = {
    async addProject({ dispatch, getters }, project): Promise<ProjectOutput> {
        try {
            const result = await createProject(project)

            // fetch updated project list from user so permissions as set correctly
            dispatch('users/getUser', getters['users/id'], { root: true })

            analytics.project.create({ id: result.id, title: result.title })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async updateProject(
        { commit },
        {
            id,
            project,
        }: {
            id: string
            project: ProjectPatchInput | FormData
            scope?: string
        }
    ) {
        const result = await patchProject(id, project)

        commit('SET_CURRENT_PROJECT', result)

        return result
    },

    async deleteProject(store, id: string) {
        try {
            const result = await deleteProject(id)

            analytics.project.delete({ id: id })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async duplicateProject({ dispatch, getters }, id: string) {
        try {
            const result = await duplicateProject(id)

            // fetch updated project list from user so permissions as set correctly
            dispatch('users/getUser', getters['users/id'], { root: true })

            analytics.project.duplicate(id, result.id)

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async getProject({ commit }, slugOrId: string): Promise<ProjectOutput> {
        try {
            const result = await getProject(slugOrId)

            commit('SET_CURRENT_PROJECT', result)

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async getAllRecommendedProjects(
        _,
        params: SearchParams = {}
    ): Promise<APIResponseList<ProjectOutput>> {
        try {
            // TODO: use pinia store
            // If no organizations set use default one
            // if (!params.organizations) params.organizations = [rootState.organizations.current.code]
            if (!params.organizations)
                params.organizations = [import.meta.env.VITE_APP_API_ORG_CODE]

            return await getAllRecommendedProjects(params)
        } catch (err) {
            throw new Error(err)
        }
    },

    async getAllRandomProjects(
        _,
        params: SearchParams = {}
    ): Promise<APIResponseList<ProjectOutput>> {
        try {
            // TODO: use pinia store
            // If no organizations set use default one
            // if (!params.organizations) params.organizations = [rootState.organizations.current.code]
            if (!params.organizations)
                params.organizations = [import.meta.env.VITE_APP_API_ORG_CODE]

            return await getAllRandomProjects(params)
        } catch (err) {
            throw new Error(err)
        }
    },

    async getAllProjects(_, params: SearchParams = {}): Promise<APIResponseList<ProjectOutput>> {
        try {
            // TODO: use pinia store
            // If no organizations set use default one
            // if (!params.organizations) params.organizations = [rootState.organizations.current.code]
            if (!params.organizations)
                params.organizations = [import.meta.env.VITE_APP_API_ORG_CODE]

            const projects = await getAllProjects(params)
            analytics.project.search(params)

            return projects
        } catch (err) {
            throw new Error(err)
        }
    },

    async lockUnlockProject({ commit }, { project_id, context }): Promise<ProjectOutput> {
        try {
            commit('SET_PROJECT_LOCK', context === 'lock')
            return await lockUnlockProject({ project_id, context })
        } catch (err) {
            throw new Error(err)
        }
    },

    updateCurrentProjectDescription({ commit }, description: string): void {
        commit('SET_PROJECT_DESCRIPTION', description)
    },

    updateProjectVisibility({ commit }, project: ProjectOutput): void {
        commit('SET_PROJECT_VISIBILITY', project.publication_status)
    },
}

const mutations = {
    // PROJECT
    SET_CURRENT_PROJECT: (state: ProjectState, project: ProjectOutput) => {
        state.project = project
    },
    DELETE_CURRENT_PROJECT: (state: ProjectState) => {
        state.project = null
    },
    SET_PROJECT_DESCRIPTION: (state: ProjectState, description: string) => {
        state.project.description = description
    },
    SET_PROJECT_VISIBILITY: (state: ProjectState, status: ProjectPublicationStatusType) => {
        state.project.publication_status = status
    },
    SET_PROJECT_LOCK: (state: ProjectState, value: boolean) => {
        state.project.is_locked = value
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
