import { lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import ProjectResourcesTab from '@/pages/ProjectPage/Tabs/ProjectResourcesTab.vue'
import { OrganizationOutputFactory } from '../../../../factories/organization.factory'
import utils from '@/functs/functions'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
vi.mock('@/functs/functions')
;(utils.hasPermission as Mock).mockImplementation(() => true)

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const store = {
    modules: {
        projects: {
            namespaced: true,
            getters: {
                project: () => ({
                    files: [],
                    links: [],
                }),
            },
        },
    },
}

describe('ProjectResourcesTab.vue', () => {
    beforeEach(() => {
        const organizationsStore = useOrganizationsStore(pinia)
        organizationsStore.current = OrganizationOutputFactory.generate()
    })

    it('should render component', () => {
        const wrapper = lpiShallowMount(ProjectResourcesTab, {
            store,
            i18n,
            provide: {
                projectLayoutToggleAddModal: vi.fn(),
            },
        })
        expect(wrapper.exists()).toBe(true)
    })
})
