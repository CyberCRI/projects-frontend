import { lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import WikipediaResults from '@/components/search/FilterTags/WikipediaResults.vue'
import { flushPromises } from '@vue/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { axios } from '@/api/api.config'

vi.mock('@/api/api.config', function () {
    return {
        axios: {
            get: vi.fn().mockResolvedValue({ data: { results: [] } }),
        },
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
    .spyOn((WikipediaResults as any).methods, 'launchSearch')
    .mockImplementation(() => Promise.resolve())

describe('WikipediaResults', () => {
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

    it('should render WikipediaResults component', async () => {
        wrapper = lpiShallowMount(WikipediaResults, defaultParams)

        await flushPromises()
        expect(wrapper.exists()).toBeTruthy()
        expect(mockSearch).toHaveBeenCalled()
    })
})
