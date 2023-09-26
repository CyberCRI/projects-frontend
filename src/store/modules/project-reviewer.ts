import {
    getProjectReviewers,
    postProjectReviewer,
    deleteProjectReviewer,
} from '@/api/project-reviewer.service'
import { APIResponseList } from '@/api/types'
import { ProjectReviewerModel } from '@/models/project-reviewer'

export interface ProjectReviewerState {
    all: ProjectReviewerModel[]
}

const state = (): ProjectReviewerState => ({
    all: [],
})

const getters = {
    all: (state: ProjectReviewerState) => state.all,
}

const actions = {
    async getProjectReviewers({ commit }, params): Promise<APIResponseList<ProjectReviewerModel>> {
        try {
            const result = await getProjectReviewers(params)

            commit('SET_PROJECT_REVIEWERS', result)
            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async postProjectReviewer({ commit }, body): Promise<ProjectReviewerModel> {
        try {
            return await postProjectReviewer(body)
        } catch (err) {
            throw new Error(err)
        }
    },

    async deleteProjectReviewer({ commit }, id): Promise<void> {
        try {
            return await deleteProjectReviewer(id)
        } catch (err) {
            throw new Error(err)
        }
    },
}

const mutations = {
    SET_PROJECT_REVIEWERS(state: ProjectReviewerState, reviewer: ProjectReviewerModel[]): void {
        state.all = reviewer
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
