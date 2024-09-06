import analytics from '@/analytics'
import { APIResponseList } from '@/api/types'
import { ProjectMessageInputModel, ProjectMessageOutput } from '@/models/project-message.model'
import {
    deleteProjectMessage,
    getProjectMessage,
    getProjectMessages,
    patchProjectMessage,
    postProjectMessage,
} from '@/api/project-messages.service'

interface Body {
    id: number
    projectMessage: ProjectMessageInputModel
}

export interface ProjectMessagesState {
    all: Array<ProjectMessageOutput>
}

const state = (): ProjectMessagesState => ({
    all: [],
})

const getters = {
    all: (state: ProjectMessagesState) => state.all,
}

const actions = {
    async getProjectMessages(
        { commit },
        project_id: string
    ): Promise<APIResponseList<ProjectMessageOutput>> {
        try {
            const response = await getProjectMessages(project_id)

            commit('SET_ALL_PROJECT_MESSAGES', response.results)

            return response
        } catch (err) {
            throw new Error(err)
        }
    },

    async postProjectMessage(
        { commit, rootState },
        projectMessage: ProjectMessageInputModel
    ): Promise<ProjectMessageOutput> {
        try {
            const result = await postProjectMessage(projectMessage)

            // reply_on_id in comment
            if (projectMessage.reply_on) {
                commit('SET_REPLY', { id: projectMessage.reply_on, projectMessage: result }) // reply_on_id in comment
            } else {
                commit('SET_PROJECT_MESSAGE', result)
            }

            analytics.projectMessage.projectMessage({
                project: {
                    id: rootState.projects.project.id,
                },
                projectMessage: result,
            })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async getProjectMessage(body): Promise<ProjectMessageOutput> {
        try {
            return await getProjectMessage(body)
        } catch (err) {
            throw new Error(err)
        }
    },

    async patchProjectMessage(
        { commit, rootState },
        {
            body,
            mainProjectMessage,
        }: { body: Body; mainProjectMessage: ProjectMessageOutput | null }
    ): Promise<ProjectMessageOutput> {
        try {
            const result = await patchProjectMessage(body.id, body.projectMessage)

            if (mainProjectMessage) {
                commit('UPDATE_REPLY_PROJECT_MESSAGE', { reply: result, mainProjectMessage })
            } else {
                commit('UPDATE_PROJECT_MESSAGE', result)
            }

            analytics.projectMessage.updateProjectMessage({
                project: {
                    id: rootState.projects.project.id,
                },
                projectMessage: result,
            })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async deleteProjectMessage(
        { commit, rootState },
        { id, mainProjectMessage }: { id: number; mainProjectMessage: ProjectMessageOutput }
    ): Promise<void> {
        try {
            await deleteProjectMessage(rootState.projects.project.id, id)

            let index

            if (mainProjectMessage) {
                const mainProjectMessageIndex = rootState.projectMessages.all.findIndex(
                    (projectMessage) => mainProjectMessage.id === projectMessage.id
                )
                index = mainProjectMessage.replies.findIndex(
                    (projectMessage) => projectMessage.id === id
                )

                analytics.projectMessage.deleteProjectMessage({
                    project: {
                        id: rootState.projects.project.id,
                    },
                    projectMessage: mainProjectMessage.replies[index],
                })

                commit('REMOVE_REPLY_PROJECT_MESSAGE', { index, mainProjectMessageIndex })
            } else {
                index = rootState.projectMessages.all.findIndex(
                    (projectMessage) => id === projectMessage.id
                )
                analytics.projectMessage.deleteProjectMessage({
                    project: {
                        id: rootState.projects.project.id,
                    },
                    projectMessage: rootState.projectMessages.all[index],
                })

                commit('REMOVE_PROJECT_MESSAGE', index)
            }

            return
        } catch (err) {
            throw new Error(err)
        }
    },
}

const mutations = {
    SET_ALL_PROJECT_MESSAGES(
        state: ProjectMessagesState,
        projectMessages: ProjectMessageOutput[]
    ): void {
        state.all = projectMessages
    },

    SET_PROJECT_MESSAGE(state: ProjectMessagesState, projectMessage: ProjectMessageOutput): void {
        state.all.unshift(projectMessage)
    },

    SET_REPLY(
        state: ProjectMessagesState,
        { id, projectMessage }: { id: number; projectMessage: ProjectMessageOutput }
    ): void {
        const index = state.all.findIndex((c) => c.id === id)

        state.all[index].replies.push(projectMessage)
    },

    UPDATE_PROJECT_MESSAGE(
        state: ProjectMessagesState,
        projectMessage: ProjectMessageOutput
    ): void {
        const index = state.all.findIndex((c) => projectMessage.id === c.id)
        state.all.splice(index, 1, projectMessage)
    },

    UPDATE_REPLY_PROJECT_MESSAGE(
        state: ProjectMessagesState,
        {
            reply,
            mainProjectMessage,
        }: { reply: ProjectMessageOutput; mainProjectMessage: ProjectMessageOutput }
    ): void {
        const index = state.all.findIndex((c) => mainProjectMessage.id === c.id)
        const replyIndex = state.all[index].replies.findIndex((r) => r.id === reply.id)
        state.all[index].replies.splice(replyIndex, 1, reply)
    },

    REMOVE_PROJECT_MESSAGE(state: ProjectMessagesState, index: number): void {
        state.all[index].deleted_at = new Date()
    },

    REMOVE_REPLY_PROJECT_MESSAGE(
        state: ProjectMessagesState,
        { index, mainProjectMessageIndex }: { index: number; mainProjectMessageIndex: number }
    ): void {
        state.all[mainProjectMessageIndex].replies[index].deleted_at = new Date()
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
