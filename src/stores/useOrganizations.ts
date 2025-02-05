import { defineStore } from 'pinia'
import {
    getOrganizationByCode,
    getOrganizations,
    patchOrganization,
} from '@/api/organizations.service'

// import { getPeopleGroups } from '@/api/groups.service'
import type { APIResponseList } from '@/api/types'
import type { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'

import analytics from '@/analytics'

export interface OrganizationsState {
    all: OrganizationOutput[]
    current: OrganizationOutput | null
}

const useOrganizationsStore = defineStore('organizations', {
    state: (): OrganizationsState => ({
        all: [],
        current: null,
    }),

    getters: {
        isDefault(): boolean {
            return this.current?.code === 'DEFAULT'
        },

        allClassifications(): object[] {
            const index = {}
            this.current?.enabled_projects_tag_classifications.forEach((classification) => {
                if (!index[classification.id]) {
                    index[classification.id] = classification
                }
                index[classification.id].is_enabled_for_projects = true
            })

            this.current?.enabled_skills_tag_classifications.forEach((classification) => {
                if (!index[classification.id]) {
                    index[classification.id] = classification
                }
                index[classification.id].is_enabled_for_skills = true
            })
            return Object.values(index)
        },
    },
    actions: {
        async getCurrentOrganization(code: string): Promise<OrganizationOutput> {
            try {
                const organization = await getOrganizationByCode(code)

                this.current = organization
                analytics.setOrganizationProperties()

                return organization
            } catch (err) {
                throw new Error(err)
            }
        },

        async getAllOrganizations(): Promise<APIResponseList<OrganizationOutput>> {
            try {
                const response = await getOrganizations()
                this.all = response.results

                return response
            } catch (err) {
                throw new Error(err)
            }
        },

        async updateCurrentOrganization(
            organization: OrganizationPatchInput | FormData
        ): Promise<OrganizationOutput> {
            try {
                const result = await patchOrganization(this.current.code, organization)
                const currentOrganization = { ...this.current, ...organization, ...result }
                this.current = currentOrganization
                return currentOrganization
            } catch (err) {
                throw new Error(err)
            }
        },
    },
})

export default useOrganizationsStore
// const state = (): OrganizationsState => ({
//     all: [],
//     current: null,
// })

// const getters = {
//     current: (state: OrganizationsState) => state.current,
//     all: (state: OrganizationsState) => state.all,
//     isDefault: (state: OrganizationsState) => state.current.code === 'DEFAULT',
// }

// const actions = {
//     async getCurrentOrganization({ commit }, code: string): Promise<OrganizationOutput> {
//         try {
//             const organization = await getOrganizationByCode(code)

//             commit('SET_CURRENT_ORGANIZATION', organization)
//             analytics.setOrganizationProperties()

//             return organization
//         } catch (err) {
//             throw new Error(err)
//         }
//     },

//     async getAllOrganizations({ commit }): Promise<APIResponseList<OrganizationOutput>> {
//         try {
//             const response = await getOrganizations()
//             commit('SET_ORGANIZATIONS', response.results)

//             return response
//         } catch (err) {
//             throw new Error(err)
//         }
//     },

//     async updateCurrentOrganization(
//         { commit, state },
//         organization: OrganizationPatchInput | FormData
//     ): Promise<OrganizationOutput> {
//         try {
//             const result = await patchOrganization(state.current.code, organization)
//             const currentOrganization = { ...state.current, ...organization, ...result }
//             commit('SET_CURRENT_ORGANIZATION', currentOrganization)
//             return currentOrganization
//         } catch (err) {
//             throw new Error(err)
//         }
//     },
// }

// const mutations = {
//     SET_CURRENT_ORGANIZATION(state: OrganizationsState, organization: OrganizationOutput): void {
//         state.current = organization
//     },
//     SET_ORGANIZATIONS(state: OrganizationsState, organizations: OrganizationOutput[]): void {
//         state.all = organizations
//     },
// }
