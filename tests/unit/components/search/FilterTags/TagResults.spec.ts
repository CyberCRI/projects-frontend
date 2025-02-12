import { lpiShallowMount, lpiMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import TagResults from '@/components/search/FilterTags/TagResults.vue'
import { flushPromises } from '@vue/test-utils'

import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import useAPI from '@/composables/useAPI'

vi.mock('@/api/api.config', function () {
    return {
        useAPI: vi.fn().mockResolvedValue({ data: { results: [] } }), // TODO nuxt check this
    }
})

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const mockSearch = vi
    .spyOn((TagResults as any).methods, 'launchSearch')
    .mockImplementation(() => Promise.resolve())

describe('TagResults', () => {
    beforeEach(() => {
        // tell vitest we use mocked time
        vi.useFakeTimers()
    })

    afterEach(() => {
        // restoring date after each test run
        vi.useRealTimers()
    })
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
        }
    })

    it('should render TagResults component', async () => {
        wrapper = lpiShallowMount(TagResults, defaultParams)

        await flushPromises()
        expect(wrapper.exists()).toBeTruthy()
        expect(mockSearch).toHaveBeenCalled()
    })

    it('should pass existingTags to searchResults', async () => {
        wrapper = lpiMount(TagResults, { ...defaultParams, props: { existingTags: [1, 2] } })

        const vm: any = wrapper.vm
        vm.isLoading = false
        await flushPromises()
        // should display search results
        const resultsComp = wrapper.findComponent('[data-test="search-results"]')
        expect(resultsComp.vm.existingTags.length).toBe(2)
        expect(resultsComp.vm.existingTags[0]).toBe(1)
        expect(resultsComp.vm.existingTags[1]).toBe(2)
    })
})
