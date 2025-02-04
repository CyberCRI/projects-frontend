import { lpiMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import waitForExpect from 'wait-for-expect'
import ClassificationAdmin from '@/components/admin/ClassificationAdmin.vue'

import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'

import { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
import flushPromises from 'flush-promises'

import {
    getAllOrgClassifications,
    getOrgClassificationTags,
} from '@/api/tag-classification.service'

vi.mock('@/api/tag-classification.service', () => ({
    getOrgClassificationTags: vi
        .fn()
        .mockResolvedValue({ data: { count: 3, results: [{ id: 1 }, { id: 2 }, { id: 3 }] } }),
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

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('ClassificationAdmin', () => {
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

    it('should render ClassificationAdmin component', () => {
        wrapper = lpiMount(ClassificationAdmin, { ...defaultParams, props: { type: 'projects' } })

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should display activate state for project', async () => {
        wrapper = lpiMount(ClassificationAdmin, { ...defaultParams, props: { type: 'projects' } })

        const vm: any = wrapper.vm
        await flushPromises()
        const switchComp = wrapper.findAllComponents(
            '[data-test="classification-switch-for-projects"]'
        )

        expect(switchComp.length).toBe(3)

        expect(switchComp[0].vm.modelValue).toBe(true)
        expect(switchComp[1].vm.modelValue).toBe(false)
        expect(switchComp[2].vm.modelValue).toBe(true)

        const otherSwitchComp = wrapper.findAllComponents(
            '[data-test="classification-switch-for-skills"]'
        )
        expect(otherSwitchComp.length).toBe(0)
    })

    it('should display activate state for skills', async () => {
        wrapper = lpiMount(ClassificationAdmin, { ...defaultParams, props: { type: 'skills' } })

        const vm: any = wrapper.vm
        await flushPromises()
        const switchComp = wrapper.findAllComponents(
            '[data-test="classification-switch-for-skills"]'
        )

        expect(switchComp.length).toBe(3)

        expect(switchComp[0].vm.modelValue).toBe(false)
        expect(switchComp[1].vm.modelValue).toBe(true)
        expect(switchComp[2].vm.modelValue).toBe(true)

        const otherSwitchComp = wrapper.findAllComponents(
            '[data-test="classification-switch-for-projects"]'
        )
        expect(otherSwitchComp.length).toBe(0)
    })

    it('should allow to activate and deactivate enabled state', async () => {
        wrapper = lpiMount(ClassificationAdmin, { ...defaultParams, props: { type: 'skills' } })

        const vm: any = wrapper.vm
        await flushPromises()
        let switchComp = wrapper.findComponent(
            '[data-test="classification-switch-for-skills"]:nth(1)'
        )

        expect(switchComp.vm.modelValue).toBe(false)

        await switchComp.vm.$emit('update:modelValue', true)
        await switchComp.vm.$nextTick()

        expect(switchComp.emitted()['update:modelValue'][0]).toStrictEqual([true])

        await vm.$nextTick()
        await flushPromises()
        await new Promise((resolve) => setTimeout(resolve, 1000))
        expect(organizationsStore.updateCurrentOrganization).toHaveBeenLastCalledWith({
            enabled_skills_tag_classifications: [456, 789, 123],
        })

        await switchComp.vm.$emit('update:modelValue', false)
        await switchComp.vm.$nextTick()

        expect(switchComp.emitted()['update:modelValue'][0]).toStrictEqual([true])

        await vm.$nextTick()
        await flushPromises()
        await new Promise((resolve) => setTimeout(resolve, 1000))
        expect(organizationsStore.updateCurrentOrganization).toHaveBeenLastCalledWith({
            enabled_skills_tag_classifications: [456, 789],
        })
    })

    it('should ask confirmation for deleting classification', async () => {
        wrapper = lpiMount(ClassificationAdmin, { ...defaultParams, props: { type: 'skills' } })

        const vm: any = wrapper.vm
        await flushPromises()
        const deleteButtons = wrapper.findAllComponents(
            '[data-test="delete-classification-button"]'
        )
        let confirmModal = wrapper.findComponent(
            '[data-test="confirm-delete-classification-modal"]'
        )

        expect(deleteButtons.length).toBe(3)
        expect(confirmModal.exists()).toBeFalsy()

        await deleteButtons[0].trigger('click')

        await vm.$nextTick()

        confirmModal = wrapper.findComponent('[data-test="confirm-delete-classification-modal"]')
        expect(confirmModal.exists()).toBeTruthy()
    })

    it('should allow to edit custom classification', async () => {
        wrapper = lpiMount(ClassificationAdmin, { ...defaultParams, props: { type: 'skills' } })

        const vm: any = wrapper.vm
        await flushPromises()
        const editButtons = wrapper.findAllComponents('[data-test="edit-classification-button"]')
        let editDrawer = wrapper.findComponent('[data-test="edit-classification-drawer"]')

        expect(editButtons.length).toBe(3)
        expect(editDrawer.vm.isOpen).toBeFalsy()

        await editButtons[0].trigger('click')

        await vm.$nextTick()

        expect(editDrawer.vm.isOpen).toBeTruthy()
    })

    it('should not allow to edit or delete non-custom classification', async () => {
        wrapper = lpiMount(ClassificationAdmin, { ...defaultParams, props: { type: 'skills' } })

        const vm: any = wrapper.vm
        await flushPromises()
        const editButtons = wrapper.findAllComponents('[data-test="edit-classification-button"]')
        let editDrawer = wrapper.findComponent('[data-test="edit-classification-drawer"]')

        expect(editButtons.length).toBe(3)
        expect(editDrawer.vm.isOpen).toBeFalsy()

        await editButtons[2].trigger('click')

        await vm.$nextTick()

        expect(editDrawer.vm.isOpen).toBeFalsy()

        const deleteButtons = wrapper.findAllComponents(
            '[data-test="delete-classification-button"]'
        )

        let confirmModal = wrapper.findComponent(
            '[data-test="confirm-delete-classification-modal"]'
        )

        expect(deleteButtons.length).toBe(3)
        expect(confirmModal.exists()).toBeFalsy()

        await deleteButtons[2].trigger('click')

        await vm.$nextTick()

        confirmModal = wrapper.findComponent('[data-test="confirm-delete-classification-modal"]')
        expect(confirmModal.exists()).toBeFalsy()
    })
})
