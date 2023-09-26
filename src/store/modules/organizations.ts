import {
    getOrganizationByCode,
    getOrganizations,
    patchOrganization,
    addGroupMember,
    removeGroupMember,
    getPeopleGroups,
} from '@/api/organizations.service'
import { APIResponseList } from '@/api/types'
import { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'

import { PeopleGroupOutput } from '@/models/people-group'
import analytics from '@/analytics'

export interface OrganizationsState {
    all: OrganizationOutput[]
    current: OrganizationOutput
    peopleGroups: PeopleGroupOutput[]
}

const state = (): OrganizationsState => ({
    all: [],
    current: null,
    peopleGroups: [],
})

const getters = {
    current: (state: OrganizationsState) => state.current,
    all: (state: OrganizationsState) => state.all,
    isDefault: (state: OrganizationsState) => state.current.code === 'DEFAULT',
    peopleGroups: (state: OrganizationsState) => state.peopleGroups,
}

const actions = {
    async getCurrentOrganization({ commit }, code: string): Promise<OrganizationOutput> {
        try {
            const organization = await getOrganizationByCode(code)

            commit('SET_CURRENT_ORGANIZATION', organization)
            commit('wikipediaTags/SET_TAGS', organization.wikipedia_tags, { root: true })
            analytics.setOrganizationProperties()

            return organization
        } catch (err) {
            throw new Error(err)
        }
    },

    async getAllOrganizations({ commit }): Promise<APIResponseList<OrganizationOutput>> {
        try {
            const response = await getOrganizations()
            commit('SET_ORGANIZATIONS', response.results)

            return response
        } catch (err) {
            throw new Error(err)
        }
    },

    async updateCurrentOrganization(
        { commit, state },
        organization: OrganizationPatchInput | FormData
    ): Promise<OrganizationOutput> {
        try {
            const result = await patchOrganization(state.current.code, organization)
            const currentOrganization = { ...state.current, ...organization, ...result }
            commit('SET_CURRENT_ORGANIZATION', currentOrganization)
            commit('wikipediaTags/SET_TAGS', currentOrganization.wikipedia_tags, { root: true })
            // @TODO uncomment when API is ready to update its tag property
            // commit('organizationTags/SET_TAGS', currentOrganization.tags, { root: true })

            return currentOrganization
        } catch (err) {
            throw new Error(err)
        }
    },

    async addGroupMember({ commit }, { org_id, body }) {
        try {
            return await addGroupMember({ org_id, body })
        } catch (err) {
            throw new Error(err)
        }
    },

    async removeGroupMember({ commit }, { org_id, body }) {
        try {
            return await removeGroupMember({ org_id, body })
        } catch (err) {
            throw new Error(err)
        }
    },

    async getPeopleGroups({ commit }, org_code) {
        try {
            const { results } = await getPeopleGroups(org_code, { organizations: org_code })

            commit('SET_PEOPLE_GROUPS', results)

            return results
        } catch (err) {
            throw new Error(err)
        }
    },
}

const mutations = {
    SET_CURRENT_ORGANIZATION(state: OrganizationsState, organization: OrganizationOutput): void {
        state.current = organization
    },
    SET_ORGANIZATIONS(state: OrganizationsState, organizations: OrganizationOutput[]): void {
        state.all = organizations
    },

    SET_PEOPLE_GROUPS(state: OrganizationsState, groups: PeopleGroupOutput[]) {
        state.peopleGroups = groups
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
