import { lpiMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import waitForExpect from 'wait-for-expect'
import TagsFilterEditor from '@/components/peopleKit/Filters/TagsFilterEditor.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
function buildStore() {
    return {
        modules: {
            organizations: {
                namespaced: true,
                state: {
                    current: {
                        code: 'test',
                    },
                },
            },
            organizationTags: {
                namespaced: true,
                getters: {
                    all: () => [],
                },
                actions: {
                    getAllTags: vi.fn(),
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

describe('TagsFilterEditor', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: {},
            store: buildStore(),
            i18n,
        }
    })

    it('should render TagsFilterEditor component', () => {
        wrapper = lpiMount(TagsFilterEditor, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })

    it('goes back to add mode', () => {
        wrapper = lpiMount(TagsFilterEditor, defaultParams)
        const vm: any = wrapper.vm

        vm.isAddMode = false
        vm.queryString = 'test'
        vm.goBackToAddMode()
        expect(vm.isAddMode).toBe(true)
        expect(vm.queryString).toBe('')
    })

    it('adds a non-added tag', () => {
        wrapper = lpiMount(TagsFilterEditor, defaultParams)
        const vm: any = wrapper.vm

        const tag = {
            name: 'Test',
            alreadyAdded: false,
        }
        vm.addTag(tag)
        expect(vm.tags.find((tag) => tag.name === 'Test')).toBeTruthy()
    })

    it('removes a tag', () => {
        wrapper = lpiMount(TagsFilterEditor, { ...defaultParams /*currentTags: ['evolution']*/ })
        const vm: any = wrapper.vm

        const tag = { name: 'Test', id: 1 }
        vm.tags = [tag]

        vm.removeTag(tag)
        expect(vm.tags.length).toBe(0)
    })

    it('launches search mode after three characters typed into the search input', async () => {
        wrapper = lpiMount(TagsFilterEditor, defaultParams)
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
