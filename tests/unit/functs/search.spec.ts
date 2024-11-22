import {
    searchEquals,
    updateSearchQuery,
    resetPaginationIfNeeded,
    updateFiltersFromURL,
} from '@/functs/search'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
describe('updateFiltersFromURL', () => {
    it('should returns defaults if no query parameter are set', () => {
        const search = updateFiltersFromURL({}, [
            'search',
            'categories',
            'tags',
            'members',
            'sdgs',
            'languages',
            'page',
        ])
        expect(search).toEqual({
            search: '',
            categories: [],
            tags: [],
            members: [],
            sdgs: [],
            languages: [],
            page: 1,
        })
    })

    it('should convert string parameters correct types', () => {
        const search = updateFiltersFromURL(
            {
                search: 'search',
                categories: 'cat',
                tags: 'wiki',
                members: 'member',
                sdgs: 'sdg',
                languages: 'lang',
                page: '42',
            },
            ['search', 'categories', 'tags', 'members', 'sdgs', 'languages', 'page']
        )
        expect(search).toEqual({
            search: 'search',
            categories: ['cat'],
            tags: ['wiki'],
            members: ['member'],
            sdgs: ['sdg'],
            languages: ['lang'],
            page: 42,
        })
    })

    it('should ignore non whitelisted parameter', () => {
        const search = updateFiltersFromURL(
            {
                search: 'search',
                categories: 'cat',
                tags: 'wiki',
                members: 'member',
                sdgs: 'sdg',
                languages: 'lang',
                page: '42',
            },
            ['search', 'page']
        )
        expect(search).toEqual({
            search: 'search',
            page: 42,
        })
    })

    it('should ignore non search filter parameter', () => {
        const spyErr = vi.spyOn(console, 'error').mockImplementation(() => {})
        const search = updateFiltersFromURL(
            {
                search: 'search',
                page: 42,
                foo: 'bar',
            },
            ['search', 'page', 'foo']
        )
        expect(spyErr).toHaveBeenCalledWith('No parser for filter foo')
        expect(search).toEqual({
            search: 'search',
            page: 42,
        })
    })
})

describe('searchEquals', () => {
    it('should be true for equals search', () => {
        const search_a = {
            foo: 'bar',
            x: 1,
        }
        const search_b = {
            x: 1,
            foo: 'bar',
        }

        expect(searchEquals(search_a, search_b)).toBeTruthy()
    })

    it('should be false for different search', () => {
        const search_a = {
            foo: 'bazooka',
            x: 1,
        }
        const search_b = {
            x: 1,
            foo: 'bar',
        }

        expect(searchEquals(search_a, search_b)).toBeFalsy()
    })

    it('should should match number and string', () => {
        const search_a = {
            x: 1,
        }
        const search_b = {
            x: '1',
        }

        expect(searchEquals(search_a, search_b)).toBeTruthy()
    })

    it('should should match empty and unset value', () => {
        const search_a = {
            x: null,
            y: 1,
        }
        const search_b = {
            y: 1,
        }

        expect(searchEquals(search_a, search_b)).toBeTruthy()
    })

    it('should should match array with same order', () => {
        const search_a = {
            x: [1, 2, 3],
            y: 1,
        }
        const search_b = {
            x: [1, 2, 3],
            y: 1,
        }

        expect(searchEquals(search_a, search_b)).toBeTruthy()
    })

    it('should should ignore specified key', () => {
        const search_a = {
            bar: 'baz',
            bar2: 'baz',
            y: 1,
        }
        const search_b = {
            bar: 'bazooka',
            bar2: 'bazooka',
            y: 1,
        }

        expect(searchEquals(search_a, search_b, ['bar', 'bar2'])).toBeTruthy()
    })
})

describe('updateSearchQuery', () => {
    function makeThat(search, query) {
        return {
            search: search,
            $route: {
                path: 'path',
                query: query,
            },
            $router: {
                replace: vi.fn(),
            },
        }
    }

    it('should not update route if search is the same', () => {
        const search = { foo: 'bar' }
        const query = { foo: 'bar' }
        const that = makeThat(search, query)
        updateSearchQuery(that, ['foo'])
        expect(that.$router.replace).not.toHaveBeenCalled()
    })

    it('should update route if search is different', () => {
        const search = { foo: 'bar' }
        const query = { foo: '123' }
        const that = makeThat(search, query)
        updateSearchQuery(that, ['foo'])
        expect(that.$router.replace).toHaveBeenCalled()
    })

    it('should not update route if non whitelisted key are different', () => {
        const search = { foo: 'bar', baz: 123 }
        const query = { foo: 'bar' }
        const that = makeThat(search, query)
        updateSearchQuery(that, ['foo'])
        expect(that.$router.replace).not.toHaveBeenCalled()
    })
})

describe('resetPaginationIfNeeded', () => {
    it('sould not reset page if other filter are the same', () => {
        const oldSearch = {
            foo: 'bar',
            page: 2,
        }

        const newSearch = {
            foo: 'bar',
            page: 3,
        }

        const res = resetPaginationIfNeeded(oldSearch, newSearch)

        expect(res).toEqual(newSearch)
    })

    it('sould reset page to if other filter are different', () => {
        const oldSearch = {
            foo: 'bar',
            page: 2,
        }

        const newSearch = {
            foo: 'baz',
            page: 3,
        }

        const res = resetPaginationIfNeeded(oldSearch, newSearch)

        expect(res).toEqual({
            foo: 'baz',
            page: 1,
        })
    })
})
