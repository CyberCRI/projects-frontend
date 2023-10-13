import { GroupModel, GroupOuput } from '@/models/group.model'
import { getGroups, addParentGroup } from '@/api/groups.service'
import { APIResponseList } from '@/api/types'

export interface GroupsState {
    all: Array<GroupModel>
}

const state = (): GroupsState => ({
    all: [],
})

const getters = {
    all: (state: GroupsState) => state.all,
}

const actions = {
    async getGroups({ commit }, org_id): Promise<APIResponseList<GroupModel>> {
        try {
            const result = await getGroups(org_id)

            commit('SET_ALL_GROUPS', result.results)

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async addParent({ dispatch }, { orgId, groupId, body }): Promise<GroupOuput> {
        try {
            const result = await addParentGroup(orgId, groupId, body)
            dispatch('groups/getGroups', orgId)
            return result
        } catch (err) {
            throw new Error(err)
        }
    },
}

const mutations = {
    SET_ALL_GROUPS(state: GroupsState, groups: GroupModel[]): void {
        state.all = groups
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}
