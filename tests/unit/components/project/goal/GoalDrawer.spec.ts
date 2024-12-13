import { lpiShallowMount, lpiMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import GoalDrawer from '@/components/project/goal/GoalDrawer.vue'
import { ProjectOutputFactory } from '@/../tests/factories/project.factory'
import { OrganizationOutputFactory } from '@/../tests/factories/organization.factory'
import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import useProjectsStore from '@/stores/useProjects'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('GoalDrawer.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        const projectsStore = useProjectsStore(pinia)

        projectsStore.project = {
            ...ProjectOutputFactory.generate(),
            files: [],
            links: [],
        }
        const organizationsStore = useOrganizationsStore(pinia)
        organizationsStore.current = OrganizationOutputFactory.generate()
        defaultParams = {
            i18n,
        }
    })
    it('should render component', () => {
        const wrapper = lpiShallowMount(GoalDrawer, defaultParams)
        expect(wrapper.exists()).toBe(true)
    })

    it('should render GoalDrawer component fully', () => {
        wrapper = lpiMount(GoalDrawer, defaultParams)
        expect(wrapper.exists()).toBe(true)
    })

    it('should emit the close event', () => {
        wrapper = lpiMount(GoalDrawer, defaultParams)
        const vm: any = wrapper.vm

        vm.closeModalNoConfirm()
        expect(wrapper.emitted('close')).toBeTruthy()
    })
})
