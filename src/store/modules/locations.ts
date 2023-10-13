import { LocationInput, LocationOutput } from '@/models/location.model'
import {
    getLocations,
    postLocations,
    patchLocation,
    deleteLocation,
} from '@/api/locations.services'
import { APIResponseList } from '@/api/types'
import analytics from '@/analytics'

export interface LocationsState {
    all: LocationOutput[]
}

const state = (): LocationsState => ({
    all: [],
})

const getters = {
    all: (state: LocationsState) => state.all,
}

const actions = {
    async getLocations({ rootState }, page: number): Promise<APIResponseList<LocationOutput>> {
        try {
            return await getLocations(
                {
                    organizations: [rootState.organizations.current.code],
                },
                page
            )
        } catch (err) {
            throw new Error(err)
        }
    },

    async postLocations({ rootState }, location: LocationInput): Promise<LocationOutput> {
        try {
            const result = await postLocations(location)

            analytics.location.addLocationMapPoint({
                project: {
                    id: rootState.projects.project.id,
                },
                location: result,
            })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async patchLocation({ rootState }, location: LocationInput): Promise<LocationOutput> {
        try {
            const result = await patchLocation(location)

            analytics.location.updateLocationMapPoint({
                project: {
                    id: rootState.projects.project.id,
                },
                location: result,
            })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async deleteLocation(_, location: LocationInput): Promise<LocationOutput> {
        try {
            return await deleteLocation(location)
        } catch (err) {
            throw new Error(err)
        }
    },
}

const mutations = {
    SET_LOCATIONS(state: LocationsState, locations: LocationOutput[]): void {
        state.all = locations
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
