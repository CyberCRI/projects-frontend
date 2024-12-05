import { lpiMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import waitForExpect from 'wait-for-expect'
import TagsFilterEditor from '@/components/search/Filters/TagsFilterEditor.vue'

import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'

import { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
import flushPromises from 'flush-promises'

import {
    getAllOrgClassifications,
    getOrgClassificationTags,
} from '@/api/tag-classification.service'

vi.mock('@/api/tag-classification.service', () => ({
    getOrgClassificationTags: vi
        .fn()
        .mockResolvedValue({ results: [{ id: 1 }, { id: 2 }, { id: 3 }] }),
    getAllOrgClassifications: vi.fn().mockResolvedValue({
        results: [
            {
                id: 123,
                slug: 'for-project',
                is_enabled_for_projects: true,
                is_enabled_for_skills: false,
            },
            {
                id: 456,
                slug: 'for-skill',
                is_enabled_for_projects: false,
                is_enabled_for_skills: true,
            },
            {
                id: 789,
                slug: 'for-skill-and-project',
                is_enabled_for_projects: true,
                is_enabled_for_skills: true,
            },
        ],
    }),
}))

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
        const organizationsStore = useOrganizationsStore(pinia)
        organizationsStore.current = {
            code: 'test',
            tags: [],
            enabled_projects_tag_classifications: [
                { id: 123, slug: 'for-project' },
                { id: 789, slug: 'for-skill-and-project' },
            ],
            enabled_skills_tag_classifications: [
                { id: 456, slug: 'for-skill' },
                { id: 789, slug: 'for-skill-and-project' },
            ],
            default_projects_tags: [{ id: 11 }, { id: 12 }, { id: 13 }],
            default_skills_tags: [{ id: 21 }, { id: 22 }, { id: 23 }],
        } as unknown as OrganizationOutput
        defaultParams = {
            props: {},
            i18n,
        }
    })

    it('should render TagsFilterEditor component', () => {
        wrapper = lpiMount(TagsFilterEditor, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should fetch  tags', async () => {
        wrapper = lpiMount(TagsFilterEditor, defaultParams)
        wrapper.vm.selectedClassificationId = 123
        await waitForExpect(() => {
            expect(getOrgClassificationTags).toHaveBeenCalled()
        })
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

    // TODO rework this
    // it('launches search mode after three characters typed into the search input', async () => {
    //     wrapper = lpiMount(TagsFilterEditor, defaultParams)
    //     const vm: any = wrapper.vm

    //     expect(vm.isAddMode).toBe(true)
    //     vm.search += 'a'
    //     expect(vm.isAddMode).toBe(true)
    //     vm.search += 'b'
    //     expect(vm.isAddMode).toBe(true)
    //     vm.search += 'c'
    //     await waitForExpect(() => {
    //         expect(vm.isAddMode).toBe(false)
    //     })
    // })

    it('should not allow to pick a tag framework by default', () => {
        wrapper = lpiMount(TagsFilterEditor, {
            ...defaultParams,
            props: {
                // allSearchMode: true,
                hideOrganizationTags: true,
            },
        })
        const vm: any = wrapper.vm

        const select = wrapper.findComponent('[data-test="classification-picker"]')
        expect(select.exists()).toBeFalsy()
    })

    it('should display suggested tags when searching all classification and there no query', async () => {
        wrapper = lpiMount(TagsFilterEditor, {
            ...defaultParams,
            props: {
                // allSearchMode: true,
                hideOrganizationTags: false,
            },
        })
        const vm: any = wrapper.vm
        await flushPromises()
        const select = wrapper.findComponent('[data-test="suggested-tags"]')
        expect(select.exists()).toBeTruthy()
        expect(vm.suggestedTags.length).toBe(3)
        expect(vm.suggestedTags[0].id).toBe(11)
        expect(vm.suggestedTags[1].id).toBe(12)
        expect(vm.suggestedTags[2].id).toBe(13)
    })

    it('should display display result tags when searching', async () => {
        wrapper = lpiMount(TagsFilterEditor, {
            ...defaultParams,
            props: {
                // allSearchMode: true,
                hideOrganizationTags: false,
            },
        })
        const vm: any = wrapper.vm
        // should diplay search input
        const searchComp = wrapper.findComponent('[data-test="tag-search-input"]')
        expect(searchComp.exists()).toBeTruthy()
        vm.search = 'test'
        await flushPromises()
        // should display search results
        const resultsComp = wrapper.findComponent('[data-test="tag-results"]')
        expect(resultsComp.exists()).toBeTruthy()
    })

    it('should allow to pick a tag framework if all search mode is disabled', async () => {
        wrapper = lpiMount(TagsFilterEditor, {
            ...defaultParams,
            props: {
                allSearchMode: false,
                hideOrganizationTags: true,
            },
        })
        const vm: any = wrapper.vm

        const select = wrapper.findComponent('[data-test="classification-picker"]')
        expect(select.exists()).toBeTruthy()

        // resolve mock api call for classifcation options
        await flushPromises()

        // should show only enabled classifications for tags
        const selectOptions = vm.orgClassificationOptions
        expect(selectOptions.length).toBe(2)
        expect(selectOptions[0].value).toBe(123)
        expect(selectOptions[1].value).toBe(789)
    })
})
