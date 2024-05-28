import reviewsStore from '@/store/modules/reviews'

import { ReviewFactory, ReviewInputFactory } from '../../../factories/review.factory'
import { getReviews, postReview, patchReview } from '@/api/reviews.service'
import { ProjectFactory } from '../../../factories/project.factory'

vi.mock('vuex')
import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
vi.mock('@/api/reviews.service')
vi.mock('@/analytics')

describe('Store module | Reviews | actions', () => {
    const commit = vi.fn()
    const rootState = {
        projects: {
            project: ProjectFactory.generate(),
        },
    }

    it('getReviews', async () => {
        const review = ReviewFactory.generateMany(1)
        const getReviewsMock = getReviews as Mock

        getReviewsMock.mockResolvedValue({ results: review })

        const result = await reviewsStore.actions.getReviews(
            { commit },
            rootState.projects.project.id
        )

        expect(getReviewsMock).toHaveBeenCalledWith(rootState.projects.project.id)
        expect(commit).toHaveBeenCalledWith('projects/SET_REVIEWS', result.results, { root: true })
    })

    it('postReview', async () => {
        const review = ReviewInputFactory.generate()
        const postReviewMock = postReview as Mock

        postReviewMock.mockResolvedValue({ results: review })

        const result = await reviewsStore.actions.postReview({ commit, rootState }, review)

        expect(postReviewMock).toHaveBeenCalledWith(review)
        expect(commit).toHaveBeenCalledWith('projects/ADD_REVIEW', result, { root: true })
    })

    it('patchReview', async () => {
        const review = ReviewInputFactory.generate()
        const patchReviewMock = patchReview as Mock

        patchReviewMock.mockResolvedValue(review)

        const result = await reviewsStore.actions.patchReview({ commit, rootState }, review)
        const index = rootState.projects.project.reviews.findIndex(
            (review) => review.id === result.id
        )

        expect(patchReviewMock).toHaveBeenCalledWith(result)
        expect(commit).toHaveBeenCalledWith(
            'projects/UPDATE_REVIEW',
            { index, review: result },
            { root: true }
        )
    })
})
