import { lpiMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import TagsFilterSummary from '@/components/peopleKit/Filters/TagsFilterSummary.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
function buildStore() {
    return {
        modules: {
            languages: {
                namespaced: true,
                getters: {
                    all: () => ['en', 'fr'],
                },
            },
        },
    }
}

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('TagsFilterSummary', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: { modelValue: [] },
            i18n,
            store: buildStore(),
        }
    })

    it('should render TagsFilterSummary component', () => {
        wrapper = lpiMount(TagsFilterSummary, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })

    it('goes back to add mode', async () => {
        wrapper = lpiMount(TagsFilterSummary, {
            ...defaultParams,
            ...{
                props: {
                    modelValue: [
                        { name: 'Test', id: 1 },
                        { name: 'Test', id: 2 },
                    ],
                },
            },
        })
        const vm: any = wrapper.vm

        await vm.$nextTick()
        const filterValues = wrapper.findAll('.filter-value')
        expect(filterValues.length).toBe(2)
    })

    it('should emit input event when removing a tag', async () => {
        wrapper = lpiMount(TagsFilterSummary, {
            ...defaultParams,
            ...{
                props: {
                    modelValue: [
                        { name: 'Test', id: 1 },
                        { name: 'Test', id: 2 },
                    ],
                },
            },
        })
        const vm: any = wrapper.vm

        await vm.$nextTick()
        const filterValue = wrapper.find('.filter-value')
        filterValue.trigger('click')
        await vm.$nextTick()
        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })
})
