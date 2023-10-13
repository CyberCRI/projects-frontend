import { OrganizationTagOutput } from '@/models/organization-tag.model'
import { createTag, getAllTags, deleteTag } from '@/api/organization-tags.service'
import { APIResponseList } from '@/api/types'

export interface OrganizationTagsState {
    all: OrganizationTagOutput[]
}

const state = (): OrganizationTagsState => ({
    all: [],
})

const getters = {
    all: (state: OrganizationTagsState) => state.all,
}

const actions = {
    async addTag(
        { commit, state },
        tag: OrganizationTagOutput
    ): Promise<APIResponseList<OrganizationTagOutput>> {
        try {
            const response = await createTag(tag)
            const updatedTags = [...state.all, response]
            commit('SET_TAGS', updatedTags)

            return response
        } catch (err) {
            throw new Error(err)
        }
    },
    async getAllTags({ commit, rootState }): Promise<APIResponseList<OrganizationTagOutput>> {
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
    async deleteTag(
        { commit, state },
        id: number
    ): Promise<APIResponseList<OrganizationTagOutput>> {
        try {
            const response = await deleteTag(id)
            const updatedTags = state.all.filter((tag) => tag.id !== id)

            commit('SET_TAGS', updatedTags)

            return response
        } catch (err) {
            throw new Error(err)
        }
    },
}

const mutations = {
    SET_TAGS(state: OrganizationTagsState, tags: OrganizationTagOutput[]): void {
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
