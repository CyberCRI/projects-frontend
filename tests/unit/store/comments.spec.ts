import commentsStore from '@/store/modules/comments'
import {
    getComments,
    postComment,
    getComment,
    patchComment,
    deleteComment,
} from '@/api/comments.service'
import { CommentFactory, CommentInputFactory } from '../../factories/comment.factory'
import { ProjectFactory } from '../../factories/project.factory'
import analytics from '@/analytics'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
vi.mock('@/api/comments.service')
vi.mock('@/analytics')

vi.mock('vuex')
describe('Store module | comments | getters', () => {
    const state = {
        all: CommentFactory.generateMany(2),
    }

    it('all', () => {
        const result = commentsStore.getters.all(state)

        expect(result).toBe(state.all)
    })
})

describe('Store model | comment | actions', () => {
    const commit = vi.fn()
    const project = ProjectFactory.generate()
    const rootState = {
        projects: { project },
        comments: {
            all: CommentFactory.generateMany(2),
        },
    }

    it('getComments', async () => {
        const comments = CommentFactory.generateMany(2)
        const getCommentsMock = getComments as Mock

        getCommentsMock.mockResolvedValue({ results: comments })

        await commentsStore.actions.getComments({ commit }, project.id)

        expect(commit).toHaveBeenCalledWith('SET_ALL_COMMENTS', comments)
        expect(getCommentsMock).toHaveBeenCalledWith(project.id)
    })

    it('postComment', async () => {
        const comment = CommentInputFactory.generate()
        const postCommentMock = postComment as Mock
        const commentMock = analytics.comment.comment as Mock

        postCommentMock.mockResolvedValue(comment)

        const result = await commentsStore.actions.postComment({ commit, rootState }, comment)

        expect(result).toEqual(comment)
        expect(commit).toHaveBeenCalledWith('SET_REPLY', {
            id: comment.reply_on_id,
            comment: result,
        })

        expect(commentMock).toHaveBeenCalledWith({
            project: {
                id: rootState.projects.project.id,
            },
            comment: result,
        })
    })

    it('getComment', async () => {
        const comment = CommentFactory.generate()
        const getCommentMock = getComment as Mock

        getCommentMock.mockResolvedValue(comment)

        const result = await commentsStore.actions.getComment(comment.id)

        expect(result).toEqual(comment)
    })

    it('patchComment', async () => {
        const comment = CommentFactory.generate()
        const commentInput = CommentInputFactory.generate()
        const patchCommentMock = patchComment as Mock
        const updateCommentMock = analytics.comment.comment as Mock

        const body = {
            id: comment.id,
            comment: commentInput,
        }

        patchCommentMock.mockResolvedValue(commentInput)

        const result = await commentsStore.actions.patchComment(
            { commit, rootState },
            { body: body, mainComment: null }
        )

        expect(commit).toHaveBeenCalledWith('UPDATE_COMMENT', result)
        expect(result).toEqual(commentInput)
        expect(updateCommentMock).toHaveBeenCalled()
    })

    it('deleteComment', async () => {
        const comment = CommentFactory.generate()
        const deleteCommentsMock = deleteComment as Mock
        const deleteCommentMock = analytics.comment.deleteComment as Mock

        deleteCommentsMock.mockResolvedValue(comment)

        await commentsStore.actions.deleteComment(
            { commit, rootState },
            { id: comment.id, mainComment: null }
        )

        expect(deleteCommentsMock).toHaveBeenCalled()
        expect(deleteCommentMock).toHaveBeenCalled()
    })
})

describe('Store module | comments | mutations', () => {
    const state = {
        all: CommentFactory.generateMany(2),
    }

    it('SET_ALL_COMMENTS', () => {
        const payload = CommentFactory.generateMany(2)
        commentsStore.mutations.SET_ALL_COMMENTS(state, payload)

        expect(state.all).toEqual(payload)
    })

    it('SET_COMMENT', () => {
        const payload = CommentFactory.generate()
        commentsStore.mutations.SET_COMMENT(state, payload)

        expect(state.all.length).toEqual(3)
    })

    it('UPDATE_COMMENT', () => {
        const payload = CommentFactory.generate()

        state.all[1] = payload

        commentsStore.mutations.UPDATE_COMMENT(state, payload)

        expect(state.all[1]).toEqual(payload)
    })

    it('REMOVE_COMMENT', () => {
        const payload = 1
        commentsStore.mutations.REMOVE_COMMENT(state, payload)

        //We expect 3 after we delete one, because we still display a deleted comment.
        expect(state.all.length).toEqual(3)
    })
})
