import wikipediaTagsStore from '@/store/modules/wikipedia-tags'
import { getAllTags, searchWikiTags } from '@/api/wikipedia-tags.service'

import { OrganizationOutputFactory } from '../../factories/organization.factory'
import TagFactory from '../../factories/wikipedia-tag.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'

vi.mock('@/api/wikipedia-tags.service')

vi.mock('vuex')

vi.mock('@/router/index', () => ({
    default: {
        push: vi.fn(),
    },
}))
describe('Store module | wikipedia tags | getters', () => {
    const state = { all: TagFactory.generateMany(2) }

    it('all', () => {
        const result = wikipediaTagsStore.getters.all(state)

        expect(result).toEqual(state.all)
    })
})

describe('Store module | wikipedia tags | actions', () => {
    const store = vi.fn()
    const commit = vi.fn()
    const organization = OrganizationOutputFactory.generate()
    const rootState = { organizations: { current: organization } }

    // TODO: recheck this (ambiguous rebase stuff removed from store)
    // it('getWikiTag', async () => {
    //     const tag = TagFactory.generate()
    //     const title = 'test'
    //     const getWikiTagMock = getWikiTag as Mock

    //     getWikiTagMock.mockResolvedValue(tag)

    //     const result = await wikipediaTagsStore.actions.getWikiTag(store, title)

    //     expect(result).toEqual(tag)
    // })

    it('searchWikiTags', async () => {
        const tags = TagFactory.generateMany(2)
        const search = 'test'
        const searchWikiTagsMock = searchWikiTags as Mock

        searchWikiTagsMock.mockResolvedValue(tags)

        const result = await wikipediaTagsStore.actions.searchWikiTags(store, search)

        expect(result).toEqual(tags)
    })

    it('searchTags', async () => {
        const tags = TagFactory.generateMany(2)
        const search = 'test'
        const getAllTagsMock = getAllTags as Mock

        getAllTagsMock.mockResolvedValue({ results: tags })

        const result = await wikipediaTagsStore.actions.searchTags(store, search)

        expect(result).toEqual({ results: tags })
    })

    it('getAllTags', async () => {
        const tags = TagFactory.generateMany(2)
        const getAllTagsMock = getAllTags as Mock

        getAllTagsMock.mockResolvedValue({ results: tags })

        const result = await wikipediaTagsStore.actions.getAllTags({ commit, rootState })

        expect(commit).toHaveBeenCalledWith('SET_TAGS', tags)
        expect(result).toEqual({ results: tags })
    })
})

describe('Store module | comments | mutations', () => {
    const state = { all: TagFactory.generateMany(2) }

    it('SET_TAGS', () => {
        const payload = TagFactory.generateMany(2)
        wikipediaTagsStore.mutations.SET_TAGS(state, payload)

        expect(state.all.length).toEqual(2)
    })
})
