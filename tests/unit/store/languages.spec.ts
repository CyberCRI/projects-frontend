import languages, { LanguageState } from '@/store/modules/languages'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'

vi.mock('vuex')
describe('Store module | organizations | getters', () => {
    const state: LanguageState = {
        all: ['en', 'fr'],
        current: 'fr',
    }

    it('all', () => {
        const result = languages.getters.all(state)

        expect(result).toEqual(state.all)
    })

    it('current', () => {
        const result = languages.getters.current(state)

        expect(result).toEqual(state.current)
    })
})

describe('Store module | languages | actions', () => {
    it('updateCurrentLanguage', () => {
        const commit = vi.fn()
        const newLang = 'fr'

        languages.actions.updateCurrentLanguage({ commit }, newLang)

        expect(commit).toHaveBeenCalledWith('SET_CURRENT_LANGUAGE', newLang)
    })
})

describe('Store module | languages | mutations', () => {
    const state: LanguageState = {
        all: ['en', 'fr'],
        current: 'en',
    }

    it('SET_CURRENT_LANGUAGE', () => {
        const newLang = 'fr'

        languages.mutations.SET_CURRENT_LANGUAGE(state, newLang)

        expect(state.current).toEqual(newLang)
    })
})
