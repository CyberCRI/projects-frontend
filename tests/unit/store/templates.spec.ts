import templatesStore from '@/store/modules/templates'
import { createTemplate, patchTemplate } from '@/api/templates.service'
import { TemplateInputFactory } from '../../factories/template.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
vi.mock('@/api/templates.service')

vi.mock('vuex')
describe('Store module | templates | getters', () => {
    const state = {
        current: TemplateInputFactory.generate(),
    }

    it('current', () => {
        const template = templatesStore.getters.current(state)

        expect(template).toEqual(state.current)
    })
})

describe('Store module | templates | actions', () => {
    const commit = vi.fn()
    const rootState = {
        projectCategories: {
            current: {},
        },
    }

    it('createTemplate', async () => {
        const template = TemplateInputFactory.generate()
        const createTemplateAsMock = createTemplate as Mock

        createTemplateAsMock.mockResolvedValue(template)

        await templatesStore.actions.createTemplate({ commit, rootState }, template)

        expect(commit).toHaveBeenCalledWith('SET_CURRENT_TEMPLATE', template)
    })

    it('patchTemplate', async () => {
        const template = TemplateInputFactory.generate()
        const createTemplateAsMock = patchTemplate as Mock

        createTemplateAsMock.mockResolvedValue(template)

        await templatesStore.actions.patchTemplate({ commit }, template)

        expect(commit).toHaveBeenCalledWith('SET_CURRENT_TEMPLATE', template)
    })
})

describe('Store module | templates | mutations', () => {
    const state = {
        current: TemplateInputFactory.generate(),
    }
    it('SET_CURRENT_TEMPLATE', () => {
        const payload = TemplateInputFactory.generate()

        templatesStore.mutations.SET_CURRENT_TEMPLATE(state, payload)

        expect(state.current).toEqual(payload)
    })
})
