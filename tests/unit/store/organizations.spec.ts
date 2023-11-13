import organizationsStore from '@/store/modules/organizations'
import {
    patchOrganization,
    getOrganizationByCode,
    getOrganizations,
} from '@/api/organizations.service'
import analytics from '@/analytics'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
import {
    OrganizationPatchInputFactory,
    OrganizationOutputFactory,
} from '../../factories/organization.factory'

vi.mock('@/api/organizations.service')
vi.mock('@/analytics')

vi.mock('vuex')
describe('Store module | organizations | getters', () => {
    const state = {
        all: OrganizationOutputFactory.generateMany(2),
        current: OrganizationOutputFactory.generate(),
        peopleGroups: [],
    }

    it('all', () => {
        const result = organizationsStore.getters.all(state)

        expect(result).toEqual(state.all)
    })

    it('current', () => {
        const result = organizationsStore.getters.current(state)

        expect(result).toEqual(state.current)
    })
})

describe('Store module | organizations | actions', () => {
    const commit = vi.fn()
    const state = {
        theme: 'light',
        all: OrganizationOutputFactory.generateMany(2),
        current: OrganizationOutputFactory.generate(),
    }

    it('getCurrentOrganization', async () => {
        const organization = OrganizationOutputFactory.generate()
        const getOrganizationByCodeMock = getOrganizationByCode as Mock
        const setOrganizationPropertiesMock = analytics.setOrganizationProperties as Mock

        getOrganizationByCodeMock.mockResolvedValue(organization)

        await organizationsStore.actions.getCurrentOrganization(
            { commit, state },
            organization.code
        )

        expect(commit).toHaveBeenCalledWith('SET_CURRENT_ORGANIZATION', organization)
        expect(setOrganizationPropertiesMock).toHaveBeenCalled()
    })

    it('getAllOrganizations', async () => {
        const organizations = OrganizationOutputFactory.generateMany(2)
        const getOrganizationsMock = getOrganizations as Mock

        getOrganizationsMock.mockResolvedValue({ results: organizations })

        await organizationsStore.actions.getAllOrganizations({ commit })

        expect(commit).toHaveBeenCalledWith('SET_ORGANIZATIONS', organizations)
    })

    it('updateCurrentOrganization', async () => {
        const organization = OrganizationPatchInputFactory.generate()
        const patchOrganizationMock = patchOrganization as Mock

        patchOrganizationMock.mockResolvedValue(organization)

        const currentOrganization = await organizationsStore.actions.updateCurrentOrganization(
            { commit, state },
            organization
        )

        expect(commit).toHaveBeenCalledWith('SET_CURRENT_ORGANIZATION', currentOrganization)
    })
})

describe('Store module | organizations | mutations', () => {
    const state = {
        all: OrganizationOutputFactory.generateMany(2),
        current: OrganizationOutputFactory.generate(),
        peopleGroups: [],
    }

    it('SET_CURRENT_ORGANIZATION', () => {
        const payload = OrganizationOutputFactory.generate()

        organizationsStore.mutations.SET_CURRENT_ORGANIZATION(state, payload)

        expect(state.current).toEqual(payload)
    })

    it('SET_ORGANIZATIONS', () => {
        const payload = OrganizationOutputFactory.generateMany(2)

        organizationsStore.mutations.SET_ORGANIZATIONS(state, payload)

        expect(state.all).toEqual(payload)
    })
})
