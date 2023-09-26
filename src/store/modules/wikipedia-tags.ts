import { WikipediaTagOutput } from '@/models/wikipedia-tag.model'
import { getAllTags, searchWikiTags } from '@/api/wikipedia-tags.service'
import { APIResponseList } from '@/api/types'

export interface WikipediaTagsState {
    all: WikipediaTagOutput[] // Organizations tags
}

const state = (): WikipediaTagsState => ({
    all: [], // Organizations tags
})

const getters = {
    all: (state: WikipediaTagsState) => state.all,
}

const actions = {
    async searchWikiTags(store, search: string): Promise<WikipediaTagOutput[]> {
        try {
            return await searchWikiTags(search)
        } catch (err) {
            throw new Error(err)
        }
    },

    async searchTags(store, search: string): Promise<APIResponseList<WikipediaTagOutput>> {
        try {
            return await getAllTags({ search })
        } catch (err) {
            throw new Error(err)
        }
    },

    async getAllTags({ commit, rootState }): Promise<APIResponseList<WikipediaTagOutput>> {
        try {
            const response = await getAllTags({
                organization: rootState.organizations.current.code,
            })
            commit('SET_TAGS', response.results)

            return response
        } catch (err) {
            throw new Error(err)
        }
    },
}

const mutations = {
    SET_TAGS(state: WikipediaTagsState, tags: WikipediaTagOutput[]): void {
        state.all = tags
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
