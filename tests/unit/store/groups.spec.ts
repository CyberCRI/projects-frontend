import groupsStore from '@/store/modules/groups'
import { getGroups } from '@/api/groups.service'
import { groupFactory } from '../../factories/group.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
vi.mock('@/api/groups.service')

vi.mock('vuex')
describe('Store module | groups | getters', () => {
    const groups = groupFactory.generateMany(2)
    const state = {
        all: groups,
    }

    it('all', () => {
        const result = groupsStore.getters.all(state)

        expect(result).toBe(state.all)
    })
})

describe('Store module | groups | actions', () => {
    const commit = vi.fn()

    it('getGroups', async () => {
        const groups = groupFactory.generateMany(2)

        const getGroupsMock = getGroups as Mock

        getGroupsMock.mockResolvedValue(groups)

        await groupsStore.actions.getGroups({ commit }, 'CRI')

        expect(getGroupsMock).toHaveBeenCalledWith('CRI')
    })
})

describe('Store module | groups | mutations', () => {
    const state = {
        all: groupFactory.generateMany(2),
    }

    it('SET_ALL_GROUPS', () => {
        const payload = groupFactory.generateMany(2)

        groupsStore.mutations.SET_ALL_GROUPS(state, payload)

        expect(state.all).toEqual(payload)
    })
})
