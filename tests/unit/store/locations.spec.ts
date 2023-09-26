import locationsStore from '@/store/modules/locations'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
import { LocationsFactory, LocationsInputFactory } from '../../factories/locations.factory'
import { ProjectFactory } from '../../factories/project.factory'
import {
    getLocations,
    postLocations,
    patchLocation,
    deleteLocation,
} from '@/api/locations.services'
import analytics from '@/analytics'

vi.mock('vuex')
vi.mock('@/api/locations.services')
vi.mock('@/analytics')

describe('Store module | locations | getters', () => {
    const state = {
        all: LocationsFactory.generateMany(2),
    }

    it('all', () => {
        const result = locationsStore.getters.all(state)

        expect(result).toEqual(state.all)
    })
})

describe('Store module | locations | actions', () => {
    const commit = vi.fn()
    const rootState = {
        projects: {
            project: ProjectFactory.generate(),
        },

        organizations: {
            current: {
                code: 'CRI',
            },
        },
    }

    it('getLocations', async () => {
        const locations = LocationsFactory.generateMany(2)

        const getLocationsMock = getLocations as Mock

        getLocationsMock.mockResolvedValue(locations)

        await locationsStore.actions.getLocations({ commit, rootState }, null)

        expect(getLocationsMock).toHaveBeenCalledWith({ organizations: ['CRI'] }, null)
    })

    it('postLocations', async () => {
        const locations = LocationsInputFactory.generate()
        const postLocationsMock = postLocations as Mock
        const setAddLocationMapPoint = analytics.location.addLocationMapPoint as Mock

        postLocationsMock.mockResolvedValue(locations)

        const result = await locationsStore.actions.postLocations({ commit, rootState }, locations)

        expect(postLocationsMock).toHaveBeenCalledWith(locations)
        expect(result).toBe(locations)
        expect(setAddLocationMapPoint).toHaveBeenCalled()
    })

    it('patchLocation', async () => {
        const locations = LocationsInputFactory.generate()
        const patchLocationsMock = patchLocation as Mock
        const setUpdateLocationMapPoint = analytics.location.updateLocationMapPoint as Mock

        patchLocationsMock.mockResolvedValue(locations)

        const result = await locationsStore.actions.patchLocation({ commit, rootState }, locations)

        expect(patchLocationsMock).toHaveBeenCalledWith(locations)
        expect(result).toBe(locations)
        expect(setUpdateLocationMapPoint).toHaveBeenCalled()
    })

    it('deleteLocation', async () => {
        const locations = LocationsInputFactory.generate()
        const deleteLocationsMock = deleteLocation as Mock

        deleteLocationsMock.mockResolvedValue(locations)

        const result = await locationsStore.actions.deleteLocation({ commit }, locations)

        expect(deleteLocationsMock).toHaveBeenCalledWith(locations)
        expect(result).toBe(locations)
    })
})

describe('Store module | locations | mutations', () => {
    const state = {
        all: LocationsFactory.generateMany(2),
    }

    it('SET_LOCATIONS', () => {
        const payload = LocationsFactory.generateMany(2)

        locationsStore.mutations.SET_LOCATIONS(state, payload)

        expect(state.all).toEqual(payload)
    })
})
