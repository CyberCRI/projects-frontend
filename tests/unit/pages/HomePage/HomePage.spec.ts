import { lpiShallowMount } from '../../../helpers/LpiMount'
import HomePage from '@/pages/HomePage/HomePage.vue'
import english from '@/locales/en.json'
import { OrganizationOutputFactory } from '../../../factories/organization.factory'
import { ProjectCategoryOutputFactory } from '../../../factories/project-category.factory'
import { AnnouncementFactory } from '../../../factories/announcement.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'

import { axios, configFormData } from '@/api/api.config'

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

const store = {
    modules: {
        app: {
            namespaced: true,
            actions: {
                updateLoading: vi.fn(),
            },
        },
        projectCategories: {
            namespaced: true,
            getters: {
                allOrderedByOrderId: vi.fn(() => ProjectCategoryOutputFactory.generateMany(2)),
            },
        },

        organizations: {
            namespaced: true,
            getters: {
                current: vi.fn(() => OrganizationOutputFactory.generate()),
                all: vi.fn(() => OrganizationOutputFactory.generateMany(2)),
            },
            actions: {
                getAllOrganizations: vi.fn(),
            },
        },

        announcements: {
            namespaced: true,
            actions: {
                getAnnouncements: vi.fn(() => ({ results: AnnouncementFactory.generateMany(2) })),
            },
        },

        users: {
            namespaced: true,
            getters: {
                getPermissions: vi.fn(() => []),
            },
        },
    },
}

describe('Button', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: {},
            i18n,
            store,
        }
    })

    it('should render HomePage component', () => {
        wrapper = lpiShallowMount(HomePage, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
