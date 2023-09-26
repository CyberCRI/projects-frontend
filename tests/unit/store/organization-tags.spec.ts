import organizationTagsStore from '@/store/modules/organization-tags'
import { createTag, getAllTags } from '@/api/organization-tags.service'

import { OrganizationOutputFactory } from '../../factories/organization.factory'
import OrganizationTagFactory from '../../factories/organization-tag.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
vi.mock('@/api/organization-tags.service')

vi.mock('@/router/index', () => ({
    default: {
        push: vi.fn(),
    },
}))

vi.mock('vuex')
describe('Store module | organization tags | getters', () => {
    const state = { all: OrganizationTagFactory.generateMany(2) }

    it('all', () => {
        const result = organizationTagsStore.getters.all(state)

        expect(result).toEqual(state.all)
    })
})

describe('Store module | organization tags | actions', () => {
    const commit = vi.fn()
    const organization = OrganizationOutputFactory.generate()
    const state = { all: OrganizationTagFactory.generateMany(2) }
    const rootState = { organizations: { current: organization } }

    it('addTag', async () => {
        const tag = OrganizationTagFactory.generate()
        const createTagMock = createTag as Mock

        createTagMock.mockResolvedValue(tag)

        const result = await organizationTagsStore.actions.addTag({ commit, state, rootState }, tag)

        expect(result).toEqual(tag)
    })

    it('getAllTags', async () => {
        const tags = OrganizationTagFactory.generateMany(2)
        const getAllTagsMock = getAllTags as Mock

        getAllTagsMock.mockResolvedValue({ results: tags })

        await organizationTagsStore.actions.getAllTags({ commit, rootState })

        expect(commit).toHaveBeenCalledWith('SET_TAGS', tags)
    })
})
