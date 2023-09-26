import projectReviewerStore from '@/store/modules/project-reviewer'
import {
    getProjectReviewers,
    postProjectReviewer,
    deleteProjectReviewer,
} from '@/api/project-reviewer.service'
import {
    ProjectReviewerFactory,
    ProjectReviewerInputFactory,
} from '../../factories/project-reviewer.factory'
import { ProjectFactory } from '../../factories/project.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
vi.mock('@/api/project-reviewer.service')

vi.mock('vuex')
describe('Store module | projectReviewer | getters', () => {
    const state = {
        all: ProjectReviewerInputFactory.generateMany(2),
    }

    it('all', () => {
        const result = projectReviewerStore.getters.all(state)

        expect(result).toEqual(state.all)
    })
})

describe('Store module | projectReviewer | actions', () => {
    const commit = vi.fn()

    it('getProjectReviewers', async () => {
        const projectReviewer = ProjectReviewerFactory.generateMany(2)
        const project = ProjectFactory.generate()
        const getProjectReviewersMock = getProjectReviewers as Mock

        getProjectReviewersMock.mockResolvedValue(projectReviewer)

        await projectReviewerStore.actions.getProjectReviewers(
            { commit },
            { project: project.id, reviewer: '1' }
        )

        expect(commit).toHaveBeenCalledWith('SET_PROJECT_REVIEWERS', projectReviewer)
    })

    it('postProjectReviewer', async () => {
        const projectReviewer = ProjectReviewerInputFactory.generate()
        const postProjectReviewerMock = postProjectReviewer as Mock

        postProjectReviewerMock.mockResolvedValue(projectReviewer)

        const result = await projectReviewerStore.actions.postProjectReviewer(
            { commit },
            projectReviewer
        )

        expect(result).toBe(projectReviewer)
    })

    it('deleteProjectReviewer', async () => {
        const projectReviewer = ProjectReviewerFactory.generate()
        const deleteProjectReviewerMock = deleteProjectReviewer as Mock

        deleteProjectReviewerMock.mockResolvedValue(projectReviewer)

        const result = await projectReviewerStore.actions.deleteProjectReviewer(
            { commit },
            projectReviewer.id
        )

        expect(result).toBe(projectReviewer)
    })
})

describe('Store module | projectReviewer | mutations', () => {
    const state = {
        all: ProjectReviewerInputFactory.generateMany(2),
    }

    it('SET_PROJECT_REVIEWERS', () => {
        const payload = ProjectReviewerInputFactory.generateMany(2)

        projectReviewerStore.mutations.SET_PROJECT_REVIEWERS(state, payload)
    })
})
