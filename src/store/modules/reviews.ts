import { getReviews, postReview, patchReview, deleteReview } from '@/api/reviews.service'
import { ReviewModel, ReviewModelInput } from '@/models/review.model'
import { APIResponseList } from '@/api/types'

const actions = {
    async getReviews({ commit }, projectId): Promise<APIResponseList<ReviewModel>> {
        try {
            const result = await getReviews(projectId)

            commit('projects/SET_REVIEWS', result.results, { root: true })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async postReview({ commit }, review: ReviewModelInput): Promise<ReviewModel> {
        try {
            const result = await postReview(review)

            commit('projects/ADD_REVIEW', result, { root: true })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async patchReview({ commit, rootState }, review: ReviewModelInput): Promise<ReviewModel> {
        try {
            const result = await patchReview(review)

            const index = rootState.projects.project.reviews.findIndex(
                (review) => review.id === result.id
            )

            commit('projects/UPDATE_REVIEW', { index, review: result }, { root: true })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async deleteReview({ commit, rootState }, id: number): Promise<void> {
        try {
            await deleteReview({ project_id: rootState.projects.project.id, id })

            const index = rootState.projects.project.reviews.findIndex((review) => id === review.id)

            commit('projects/DELETE_REVIEW', index, { root: true })
        } catch (err) {
            throw new Error(err)
        }
    },
}

export default {
    namespaced: true,
    actions,
}
