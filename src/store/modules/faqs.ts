import { FaqInput, FaqOutput } from '@/models/faq.model'
import { getFaq, createFaq, putFaq, deleteFaq } from '@/api/faqs.service'
import { APIResponseList } from '@/api/types'

export interface FaqsState {
    current: FaqOutput
}

const state = () => ({
    current: null,
})

const getters = {
    current: (state: FaqsState) => state.current,
}

const actions = {
    async getFaq({ commit }, orgCode): Promise<APIResponseList<FaqOutput>> {
        try {
            const faq = await getFaq(orgCode)

            commit('SET_FAQ', faq)

            return faq
        } catch (err) {
            throw new Error(err)
        }
    },

    async createFaq({ commit }, body: FaqInput): Promise<APIResponseList<FaqOutput>> {
        try {
            const faq = await createFaq(body)

            commit('SET_FAQ', faq)

            return faq
        } catch (err) {
            throw new Error(err)
        }
    },

    async updateFaq({ commit }, body: FaqInput): Promise<FaqOutput> {
        try {
            const faq = await putFaq(body)

            commit('SET_FAQ', faq)

            return faq
        } catch (err) {
            throw new Error(err)
        }
    },

    async deleteFaq({ commit }, { orgCode }): Promise<FaqOutput> {
        try {
            const faq = await deleteFaq({ orgCode })

            commit('DELETE_FAQ', faq)

            return faq
        } catch (err) {
            throw new Error(err)
        }
    },

    updateFaqContent({ commit }, content: string): void {
        commit('UPDATE_FAQ_CONTENT', content)
    },

    updateFaqTitle({ commit }, title: string): void {
        commit('UPDATE_FAQ_TITLE', title)
    },
}

const mutations = {
    SET_FAQ(state: FaqsState, faq: FaqOutput): void {
        state.current = faq
    },

    DELETE_FAQ(state: FaqsState): void {
        state.current = null
    },

    UPDATE_FAQ_CONTENT(state: FaqsState, content: string): void {
        if (!state.current)
            state.current = {
                content: undefined,
                title: undefined,
                id: undefined,
                created_at: undefined,
                updated_at: undefined,
                deleted_at: undefined,
                images: undefined,
            }
        state.current = { ...state.current, content }
    },

    UPDATE_FAQ_TITLE(state: FaqsState, title: string): void {
        if (!state.current)
            state.current = {
                content: undefined,
                title: undefined,
                id: undefined,
                created_at: undefined,
                updated_at: undefined,
                deleted_at: undefined,
                images: undefined,
            }
        state.current = { ...state.current, title }
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
