import faqStore from '@/store/modules/faqs'
import { createFaq, getFaq, putFaq, deleteFaq } from '@/api/faqs.service'
import { OrganizationOutputFactory } from '../../factories/organization.factory'
import FaqFactory, { FaqInputFactory } from '../../factories/faq.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
vi.mock('@/router/index', () => ({
    default: {
        push: vi.fn(),
    },
}))
vi.mock('@/api/faqs.service')

vi.mock('vuex')
describe('Store module | faqs | getters', () => {
    const state = {
        current: FaqFactory.generate(),
    }

    it('gets current faq', () => {
        const result = faqStore.getters.current(state)

        expect(result).toEqual(state.current)
    })
})

describe('Store module | faqs | actions', () => {
    const commit = vi.fn()
    const community = OrganizationOutputFactory.generate()

    it('createFaq', async () => {
        const faq = FaqInputFactory.generate()
        const createFaqMock = createFaq as Mock

        createFaqMock.mockResolvedValue(faq)

        const result = await faqStore.actions.createFaq({ commit }, faq)

        expect(commit).toHaveBeenCalledWith('SET_FAQ', result)
        expect(createFaqMock).toHaveBeenCalledWith(faq)
    })

    it('getFaq', async () => {
        const faq = FaqFactory.generate()
        const getFaqMock = getFaq as Mock

        getFaqMock.mockResolvedValue(faq)

        const result = await faqStore.actions.getFaq({ commit }, community.code)

        expect(commit).toHaveBeenCalledWith('SET_FAQ', result)
        expect(getFaqMock).toHaveBeenCalledWith(community.code)
    })

    it('updateFaq', async () => {
        const faq = FaqInputFactory.generate()
        const putFaqMock = putFaq as Mock

        putFaqMock.mockResolvedValue(faq)

        const result = await faqStore.actions.updateFaq({ commit }, faq)

        expect(commit).toHaveBeenCalledWith('SET_FAQ', result)
        expect(putFaqMock).toHaveBeenCalledWith(faq)
    })

    it('deleteFaq', async () => {
        const faq = FaqFactory.generate()
        const deleteFaqMock = deleteFaq as Mock

        deleteFaqMock.mockResolvedValue(faq)

        const result = await faqStore.actions.deleteFaq({ commit }, { orgCode: community.code })

        expect(commit).toHaveBeenCalledWith('DELETE_FAQ', result)
        expect(deleteFaqMock).toHaveBeenCalledWith({ orgCode: community.code })
    })
})

describe('Store module | faqs | mutations', () => {
    const state = {
        current: FaqFactory.generate(),
    }

    it('SET_FAQ', () => {
        const faq = FaqFactory.generate()

        faqStore.mutations.SET_FAQ(state, faq)

        expect(state.current).toEqual(faq)
    })

    it('UPDATE_FAQ_CONTENT', () => {
        const payload = 'aaaaa'

        faqStore.mutations.UPDATE_FAQ_CONTENT(state, payload)

        expect(state.current.content).toEqual(payload)
    })

    it('UPDATE_FAQ_TITLE', () => {
        const payload = 'aaaaa'

        faqStore.mutations.UPDATE_FAQ_TITLE(state, payload)

        expect(state.current.title).toEqual(payload)
    })
})
