import { APIResponseList, SearchParams } from '@/api/types'
import { ProjectOutput, ProjectPatchInput } from '@/models/project.model'
import {
    addLinkedProject,
    createProject,
    deleteLinkedProject,
    deleteProject,
    duplicateProject,
    getAllProjects,
    getAllRandomProjects,
    getAllRecommendedProjects,
    getProject,
    patchLinkedProject,
    patchProject,
    lockUnlockProject,
} from '@/api/projects.service'
import analytics from '@/analytics'
import { ReviewModel } from '@/models/review.model'
import { WikipediaTagModel } from '@/models/wikipedia-tag.model'
import { BlogEntryOutput } from '@/models/blog-entry.model'
import { GoalModel } from '@/models/goal.model'
import { FollowOutput } from '@/models/follow.model'
import { ProjectPublicationStatusType } from '@/models/types'

export interface ProjectState {
    project: ProjectOutput
}

function sortBlogEntries(a: any, b: any) {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
}

const state = (): ProjectState => ({
    project: null,
})

const getters = {
    project: (state: ProjectState) => state.project,
    currentProjectId: (state: ProjectState) => (state.project ? state.project.id : undefined),
    currentProjectSlug: (state: ProjectState) => (state.project ? state.project.slug : undefined),
    projectMembers: (state: ProjectState) => [
        ...state.project.team.owners,
        ...state.project.team.reviewers,
        ...state.project.team.members,
        ...state.project.team.people_groups,
    ],
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

    async addLinkedProject(
        { commit, rootState },
        {
            id,
            body,
        }: {
            id: string
            body: any
        }
    ) {
        try {
            const result = await addLinkedProject({ id, body })
            const targets = []
            const body_linked_projects = body.projects
            for (let i = 0; i < body_linked_projects.length; i++) {
                const project = body_linked_projects[i]
                targets.push(project['project_id'])
            }
            const ret_linked_projects = result['linked_projects']
            for (let i = 0; i < ret_linked_projects.length; i++) {
                const linked_project = ret_linked_projects[i]
                if (targets.includes(linked_project.project['id'])) {
                    commit('ADD_LINKED_PROJECT', linked_project)
                    analytics.linkedProject.addLinkedProject({
                        project: {
                            id: rootState.projects.project.id,
                        },
                        linkedProject: linked_project,
                    })
                }
            }

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async patchLinkedProject(
        { commit, rootState },
        {
            target_id,
            id,
            body,
        }: {
            target_id: string
            id: number
            body: any
        }
    ) {
        try {
            const result = await patchLinkedProject({ target_id, id, body })

            commit('PATCH_LINKED_PROJECT', result)

            analytics.linkedProject.patchLinkedProject({
                project: {
                    id: rootState.projects.project.id,
                },
                linkedProject: result,
            })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async deleteLinkedProject(
        { commit, rootState },
        {
            id,
            project_id,
        }: {
            id: number
            project_id: string
        }
    ) {
        try {
            await deleteLinkedProject({ id, project_id })

            const index = rootState.projects.project.linked_projects.findIndex(
                (project) => project.id === id
            )
            analytics.linkedProject.removeLinkedProject({
                project: {
                    id: rootState.projects.project.id,
                },
                linkedProject: rootState.projects.project.linked_projects[index],
            })

            commit('DELETE_LINKED_PROJECT', index)
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
        { rootState },
        params: SearchParams = {}
    ): Promise<APIResponseList<ProjectOutput>> {
        try {
            // If no organizations set use default one
            if (!params.organizations) params.organizations = [rootState.organizations.current.code]

            return await getAllRecommendedProjects(params)
        } catch (err) {
            throw new Error(err)
        }
    },

    async getAllRandomProjects(
        { rootState },
        params: SearchParams = {}
    ): Promise<APIResponseList<ProjectOutput>> {
        try {
            // If no organizations set use default one
            if (!params.organizations) params.organizations = [rootState.organizations.current.code]

            return await getAllRandomProjects(params)
        } catch (err) {
            throw new Error(err)
        }
    },

    async getAllProjects(
        { rootState },
        params: SearchParams = {}
    ): Promise<APIResponseList<ProjectOutput>> {
        try {
            // If no organizations set use default one
            if (!params.organizations) params.organizations = [rootState.organizations.current.code]

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

    updateCurrentProjectMembers({ commit }, project: ProjectOutput): void {
        commit('SET_PROJECT_MEMBERS', project)
        commit('SET_PROJECT_VISIBILITY', project.publication_status)
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

    // BLOG ENTRIES
    SET_BLOG_ENTRIES: (state: ProjectState, blogEntries: BlogEntryOutput[]) => {
        state.project.blog_entries = blogEntries
        state.project.blog_entries.sort(sortBlogEntries)
    },
    ADD_BLOG_ENTRY: (state: ProjectState, blogEntry: any) => {
        state.project.blog_entries.unshift(blogEntry)
        state.project.blog_entries.sort(sortBlogEntries)
    },
    UPDATE_BLOG_ENTRY: (
        state: ProjectState,
        body: {
            index: number
            entry: BlogEntryOutput
        }
    ) => {
        state.project.blog_entries.splice(body.index, 1, body.entry)
        state.project.blog_entries.sort(sortBlogEntries)
    },
    DELETE_BLOG_ENTRY: (state: ProjectState, index: number) => {
        state.project.blog_entries.splice(index, 1)
    },

    // GOALS
    SET_GOALS: (state: ProjectState, goals: GoalModel[]) => {
        state.project.goals = goals
    },
    ADD_GOAL: (state: ProjectState, goal: GoalModel) => {
        state.project.goals.push(goal)
    },
    UPDATE_GOAL: (
        state: ProjectState,
        body: {
            index: number
            goal: GoalModel
        }
    ) => {
        state.project.goals.splice(body.index, 1, body.goal)
    },
    DELETE_GOAL: (state: ProjectState, index: number) => {
        state.project.goals.splice(index, 1)
    },

    // MEMBERS
    SET_PROJECT_MEMBERS: (state: ProjectState, project: ProjectOutput) => {
        state.project.team.members = project.team.members
        state.project.team.owners = project.team.owners
        state.project.team.reviewers = project.team.reviewers
        state.project.team.people_groups = project.team.people_groups
    },

    // TAGS
    SET_PROJECT_TAGS: (state: ProjectState, tags: WikipediaTagModel[]) => {
        state.project.tags = tags
    },

    // LINKED PROJECTS
    ADD_LINKED_PROJECT: (state: ProjectState, result: any) => {
        state.project.linked_projects.push(result)
    },
    PATCH_LINKED_PROJECT: (state: ProjectState, result: any) => {
        const index = state.project.linked_projects.findIndex((project) => project.id === result.id)
        state.project.linked_projects.splice(index, 1, result)
    },
    DELETE_LINKED_PROJECT: (state: ProjectState, index: number) => {
        state.project.linked_projects.splice(index, 1)
    },

    // REVIEWS
    SET_REVIEWS: (state: ProjectState, reviews: ReviewModel[]) => {
        state.project.reviews = reviews
    },
    ADD_REVIEW: (state: ProjectState, review: ReviewModel) => {
        state.project.reviews.push(review)
    },
    UPDATE_REVIEW: (
        state: ProjectState,
        body: {
            index: number
            review: ReviewModel
        }
    ) => {
        state.project.reviews.splice(body.index, 1, body.review)
    },
    DELETE_REVIEW: (state: ProjectState, index: number) => {
        state.project.reviews.splice(index, 1)
    },

    // FOLLOWS
    SET_FOLLOWS: (state: ProjectState, follows: FollowOutput[]) => {
        state.project.follows = follows
    },

    ADD_FOLLOW: (state: ProjectState, follow: FollowOutput) => {
        state.project.is_followed.is_followed = true
        state.project.is_followed.follow_id = follow.id
    },

    DELETE_FOLLOW: (state: ProjectState) => {
        state.project.is_followed.is_followed = false
        state.project.is_followed.follow_id = null
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
