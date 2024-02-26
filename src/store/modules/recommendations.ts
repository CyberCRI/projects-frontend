import { getProjectsRecommendations, getUsersRecommendations } from '@/api/recommendations.service'
import { ProjectOutput } from '@/models/project.model'
import { UserModel } from '@/models/user.model'

export interface RecommendationsState {
    projectsRecommendations: ProjectOutput[]
    usersRecommendations: UserModel[]
}

const state = (): RecommendationsState => ({
    projectsRecommendations: [],
    usersRecommendations: [],
})

const getters = {
    projectsRecommendations: (state: RecommendationsState) => {
        return state.projectsRecommendations
    },
    usersRecommendations: (state: RecommendationsState) => {
        return state.usersRecommendations
    },
}

const actions = {
    async getProjectsRecommendations({ commit }, body): Promise<ProjectOutput[]> {
        try {
            const result = await getProjectsRecommendations(body)

            commit('SET_PROJECTS_RECOMMENDATIONS', result)

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async getUsersRecommendations({ commit }, body): Promise<UserModel[]> {
        try {
            const result = await getUsersRecommendations(body)

            commit('SET_USERS_RECOMMENDATIONS', result)

            return result
        } catch (err) {
            throw new Error(err)
        }
    },
}

const mutations = {
    SET_PROJECTS_RECOMMENDATIONS(
        state: RecommendationsState,
        projectsRecommendations: ProjectOutput[]
    ): void {
        state.projectsRecommendations = projectsRecommendations
    },

    SET_USERS_RECOMMENDATIONS(
        state: RecommendationsState,
        usersRecommendations: UserModel[]
    ): void {
        state.usersRecommendations = usersRecommendations
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}
