import analytics from '@/analytics'
import { APIResponseList } from '@/api/types'
import { CommentInputModel, CommentOutput } from '@/models/comment.model'
import {
    deleteComment,
    getComment,
    getComments,
    patchComment,
    postComment,
} from '@/api/comments.service'

interface Body {
    id: number
    comment: CommentInputModel
}

export interface CommentsState {
    all: Array<CommentOutput>
}

const state = (): CommentsState => ({
    all: [],
})

const getters = {
    all: (state: CommentsState) => state.all,
}

const actions = {
    async getComments({ commit }, project_id: string): Promise<APIResponseList<CommentOutput>> {
        try {
            const response = await getComments(project_id)

            commit('SET_ALL_COMMENTS', response.results)

            return response
        } catch (err) {
            throw new Error(err)
        }
    },

    async postComment({ commit, rootState }, comment: CommentInputModel): Promise<CommentOutput> {
        try {
            const result = await postComment(comment)

            if (comment.reply_on_id) {
                commit('SET_REPLY', { id: comment.reply_on_id, comment: result })
            } else {
                commit('SET_COMMENT', result)
            }

            analytics.comment.comment({
                project: {
                    id: rootState.projects.project.id,
                },
                comment: result,
            })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async getComment(body): Promise<CommentOutput> {
        try {
            return await getComment(body)
        } catch (err) {
            throw new Error(err)
        }
    },

    async patchComment(
        { commit, rootState },
        { body, mainComment }: { body: Body; mainComment: CommentOutput | null }
    ): Promise<CommentOutput> {
        try {
            const result = await patchComment(body.id, body.comment)

            if (mainComment) {
                commit('UPDATE_REPLY_COMMENT', { reply: result, mainComment })
            } else {
                commit('UPDATE_COMMENT', result)
            }

            analytics.comment.updateComment({
                project: {
                    id: rootState.projects.project.id,
                },
                comment: result,
            })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async deleteComment(
        { commit, rootState },
        { id, mainComment }: { id: number; mainComment: CommentOutput }
    ): Promise<void> {
        try {
            await deleteComment(rootState.projects.project.id, id)

            let index

            if (mainComment) {
                const mainCommentIndex = rootState.comments.all.findIndex(
                    (comment) => mainComment.id === comment.id
                )
                index = mainComment.replies.findIndex((comment) => comment.id === id)

                analytics.comment.deleteComment({
                    project: {
                        id: rootState.projects.project.id,
                    },
                    comment: mainComment.replies[index],
                })

                commit('REMOVE_REPLY_COMMENT', { index, mainCommentIndex })
            } else {
                index = rootState.comments.all.findIndex((comment) => id === comment.id)
                analytics.comment.deleteComment({
                    project: {
                        id: rootState.projects.project.id,
                    },
                    comment: rootState.comments.all[index],
                })

                commit('REMOVE_COMMENT', index)
            }

            return
        } catch (err) {
            throw new Error(err)
        }
    },
}

const mutations = {
    SET_ALL_COMMENTS(state: CommentsState, comments: CommentOutput[]): void {
        state.all = comments
    },

    SET_COMMENT(state: CommentsState, comment: CommentOutput): void {
        state.all.unshift(comment)
    },

    SET_REPLY(state: CommentsState, { id, comment }: { id: number; comment: CommentOutput }): void {
        const index = state.all.findIndex((c) => c.id === id)

        state.all[index].replies.push(comment)
    },

    UPDATE_COMMENT(state: CommentsState, comment: CommentOutput): void {
        const index = state.all.findIndex((c) => comment.id === c.id)
        state.all.splice(index, 1, comment)
    },

    UPDATE_REPLY_COMMENT(
        state: CommentsState,
        { reply, mainComment }: { reply: CommentOutput; mainComment: CommentOutput }
    ): void {
        const index = state.all.findIndex((c) => mainComment.id === c.id)
        const replyIndex = state.all[index].replies.findIndex((r) => r.id === reply.id)
        state.all[index].replies.splice(replyIndex, 1, reply)
    },

    REMOVE_COMMENT(state: CommentsState, index: number): void {
        state.all[index].deleted_at = new Date()
    },

    REMOVE_REPLY_COMMENT(
        state: CommentsState,
        { index, mainCommentIndex }: { index: number; mainCommentIndex: number }
    ): void {
        state.all[mainCommentIndex].replies[index].deleted_at = new Date()
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
