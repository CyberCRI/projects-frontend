import { lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import waitForExpect from 'wait-for-expect'
import FilterTags from '@/components/lpikit/FilterTags/FilterTags.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
function buildStore() {
    return {
        modules: {
            organizationTags: {
                namespaced: true,
                actions: {
                    getAllTags: vi.fn(() => []),
                },
                getters: {
                    all: vi.fn(() => []),
                },
            },
            wikipediaTags: {
                namespaced: true,
                actions: {
                    getAllTags: vi.fn(() => []),
                },
                getters: {
                    all: vi.fn(() => []),
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

describe('FilterTags', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: {
                label: 'FilterTags',
                triggerUpdate: false,
            },
            store: buildStore(),
            i18n,
        }
    })

    it('should render FilterTags component', () => {
        wrapper = lpiShallowMount(FilterTags, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })

    it('goes back to add mode', () => {
        wrapper = lpiShallowMount(FilterTags, defaultParams)
        const vm: any = wrapper.vm

        vm.isAddMode = false
        vm.queryString = 'test'
        vm.goBackToAddMode()
        expect(vm.isAddMode).toBe(true)
        expect(vm.queryString).toBe('')
    })

    it('adds a non-added tag', () => {
        wrapper = lpiShallowMount(FilterTags, defaultParams)
        const vm: any = wrapper.vm

        const tag = {
            name: 'Test',
            alreadyAdded: false,
        }
        vm.addTag(tag)
        expect(vm.tags.find((tag) => tag.name === 'Test')).toBeTruthy()
    })

    it('empties current tags', () => {
        wrapper = lpiShallowMount(FilterTags, defaultParams)
        const vm: any = wrapper.vm

        vm.tags = [{ name: 'Test' }]

        vm.emptyCurrentTags()
        expect(vm.tags.length).toBe(0)
    })

    it('removes a tag', () => {
        wrapper = lpiShallowMount(FilterTags, { ...defaultParams, currentTags: ['evolution'] })
        const vm: any = wrapper.vm

        const tag = { name: 'Test', id: 1 }
        vm.tags = [tag]

        vm.removeTag(tag)
        expect(vm.tags.length).toBe(0)
    })

    it('launches search mode after three characters typed into the search input', async () => {
        wrapper = lpiShallowMount(FilterTags, defaultParams)
        const vm: any = wrapper.vm

        expect(vm.isAddMode).toBe(true)
        vm.queryString += 'a'
        expect(vm.isAddMode).toBe(true)
        vm.queryString += 'b'
        expect(vm.isAddMode).toBe(true)
        vm.queryString += 'c'
        await waitForExpect(() => {
            expect(vm.isAddMode).toBe(false)
        })
    })
})
