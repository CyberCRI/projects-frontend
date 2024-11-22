import { lpiMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import waitForExpect from 'wait-for-expect'
import TagsFilterEditor from '@/components/search/Filters/TagsFilterEditor.vue'

import { getOrgClassificationTags } from '@/api/tag-classification.service'

import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'

import { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'

vi.mock('@/api/tag-classification.service', () => ({
    getOrgClassificationTags: vi.fn().mockResolvedValue({ results: [] }),
}))

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'

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
            enabled_projects_tag_classifications: [{ id: 123, slug: 'test' }],
            enabled_skills_tag_classifications: [{ id: 123, slug: 'test' }],
            default_projects_tags: [],
            default_skills_tags: [],
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

    it('goes back to add mode', () => {
        wrapper = lpiMount(TagsFilterEditor, defaultParams)
        const vm: any = wrapper.vm

        vm.search = 'test'
        vm.goBackToAddMode()
        expect(vm.search).toBe('')
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
})
