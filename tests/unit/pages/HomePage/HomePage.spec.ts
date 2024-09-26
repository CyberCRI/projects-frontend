import { lpiShallowMount } from '../../../helpers/LpiMount'
import HomePage from '@/pages/HomePage/HomePage.vue'
import english from '@/locales/en.json'
import { OrganizationOutputFactory } from '../../../factories/organization.factory'
import { AnnouncementFactory } from '../../../factories/announcement.factory'
import { ProjectCategoryOutputFactory } from '../../../factories/project-category.factory'
import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
import { axios, configFormData } from '@/api/api.config'
import pinia from '@/stores'
import useProjectCategoriesStore from '@/stores/useProjectCategories'
import useOrganizationsStore from '@/stores/useOrganizations'
import useUsersStore from '@/stores/useUsers'

// fix unhnadled rejection due to invalid url
vi.mock('@/api/api.config', () => {
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

describe('Button', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        const organizationsStore = useOrganizationsStore(pinia)
        organizationsStore.current = OrganizationOutputFactory.generate()
        organizationsStore.all = OrganizationOutputFactory.generateMany(2)
        const projectCategories = useProjectCategoriesStore(pinia)
        projectCategories.all = ProjectCategoryOutputFactory.generateMany(2)
        const usersStore = useUsersStore(pinia)
        defaultParams = {
            props: {},
            i18n,
        }
    })

    it('should render HomePage component', () => {
        wrapper = lpiShallowMount(HomePage, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
