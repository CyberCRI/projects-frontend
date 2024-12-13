import { lpiMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import waitForExpect from 'wait-for-expect'
import DefaultTagsAdmin from '@/components/admin/DefaultTagsAdmin.vue'

import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'

import { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
import flushPromises from 'flush-promises'

import {
    getAllOrgClassifications,
    getOrgClassificationTags,
} from '@/api/tag-classification.service'

import debounce from 'lodash.debounce'

vi.mock('lodash.debounce', () => ({ default: vi.fn((fn) => fn) }))

vi.mock('@/api/tag-classification.service', () => ({
    getOrgClassificationTags: vi.fn().mockResolvedValue({
        data: {
            count: 3,
            current_page: 1,
            total_page: 1,
            previous: null,
            next: null,
            first: null,
            last: null,
            results: [{ id: 1 }, { id: 2 }, { id: 3 }],
        },
        config: {},
    }),
    getAllOrgClassifications: vi.fn().mockResolvedValue({
        count: 3,
        results: [
            {
                id: 123,
                slug: 'for-project',
                type: 'Custom',
                is_enabled_for_projects: true,
                is_enabled_for_skills: false,
            },
            {
                id: 456,
                slug: 'for-skill',
                type: 'Custom',
                is_enabled_for_projects: false,
                is_enabled_for_skills: true,
            },
            {
                id: 789,
                slug: 'for-skill-and-project',
                type: 'Wikipedia',
                is_enabled_for_projects: true,
                is_enabled_for_skills: true,
            },
        ],
    }),
}))

const classification = {
    id: 123,
    slug: 'for-project',
    type: 'Custom',
    is_enabled_for_projects: true,
    is_enabled_for_skills: false,
}

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('DefaultTagsAdmin', () => {
    let wrapper
    let defaultParams
    let organizationsStore

    beforeEach(() => {
        organizationsStore = useOrganizationsStore(pinia)
        organizationsStore.updateCurrentOrganization = vi.fn()
        organizationsStore.current = {
            code: 'test',
            tags: [],
            enabled_projects_tag_classifications: [
                { id: 123, slug: 'for-project', type: 'Custom' },
                { id: 789, slug: 'for-skill-and-project', type: 'Custom' },
            ],
            enabled_skills_tag_classifications: [
                { id: 456, slug: 'for-skill', type: 'Custom' },
                { id: 789, slug: 'for-skill-and-project', type: 'Custom' },
            ],
            default_projects_tags: [{ id: 11 }, { id: 12 }, { id: 13 }],
            default_skills_tags: [{ id: 21 }, { id: 22 }, { id: 23 }],
        } as unknown as OrganizationOutput
        defaultParams = {
            props: {},
            i18n,
        }
    })

    it('should render DefaultTagsAdmin component', () => {
        wrapper = lpiMount(DefaultTagsAdmin, {
            ...defaultParams,
            props: {},
        })

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should display default skills entry', async () => {
        wrapper = lpiMount(DefaultTagsAdmin, {
            ...defaultParams,
            props: {},
        })

        const vm: any = wrapper.vm
        await flushPromises()
        await vm.$nextTick()
        expect(vm.organizationTags.length).toBe(3)
        const tagEntries = wrapper.findAll('[data-test="default-tag"]')
        expect(tagEntries.length).toBe(3)
    })

    it('should ask confirmation for deleting tag', async () => {
        wrapper = lpiMount(DefaultTagsAdmin, {
            ...defaultParams,
            props: {},
        })

        const vm: any = wrapper.vm
        await flushPromises()
        const deleteButtons = wrapper.findAllComponents('[data-test="default-tag"]')
        let confirmModal = wrapper.findComponent('[data-test="confirm-delete-default-tag"]')

        expect(deleteButtons.length).toBe(3)
        expect(confirmModal.exists()).toBeFalsy()

        await deleteButtons[0].trigger('click')

        await vm.$nextTick()

        confirmModal = wrapper.findComponent('[data-test="confirm-delete-default-tag"]')
        expect(confirmModal.exists()).toBeTruthy()
    })

    it('should allow to add skills', async () => {
        wrapper = lpiMount(DefaultTagsAdmin, {
            ...defaultParams,
            props: {},
        })

        const vm: any = wrapper.vm
        await flushPromises()
        const editButtons = wrapper.findAllComponents('[data-test="add-default-tags"]')
        let addDrawer = wrapper.findComponent('[data-test="add-default-tags-drawer"]')

        expect(editButtons.length).toBe(1)
        expect(addDrawer.vm.isOpened).toBeFalsy()

        await editButtons[0].trigger('click')

        await vm.$nextTick()
        addDrawer = wrapper.findComponent('[data-test="add-default-tags-drawer"]')
        expect(addDrawer.vm.isOpened).toBeTruthy()
    })
})
