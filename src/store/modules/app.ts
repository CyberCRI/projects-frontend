interface Loading {
    visible: Boolean
    message?: String
}

export interface AppState {
    loading: Loading
}

const state = (): AppState => ({
    loading: {
        visible: true,
        message: null,
    },
})

const getters = {
    loading: (state: AppState) => state.loading.visible,
}

const actions = {
    updateLoading({ commit }, loading: Loading) {
        commit('UPDATE_LOADING', loading)
    },
}

const mutations = {
    UPDATE_LOADING(state: AppState, loading: Loading): void {
        if (loading.message) state.loading.message = loading.message
        if (!loading.visible) state.loading.message = null
        state.loading.visible = loading.visible
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}
