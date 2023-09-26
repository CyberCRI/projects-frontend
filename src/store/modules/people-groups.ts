export interface PeopleGroupsState {
    currentId: number | null
}

const state = (): PeopleGroupsState => ({
    currentId: null,
})

const getters = {
    currentId: (state: PeopleGroupsState) => state.currentId,
}

const actions = {
    setCurrentId({ commit }, groupId: number): void {
        commit('SET_CURRENT_ID', groupId)
    },
}

const mutations = {
    SET_CURRENT_ID(state: PeopleGroupsState, groupId: number | null): void {
        state.currentId = groupId
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}
