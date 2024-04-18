import HomeNewsfeed from '@/components/lpikit/HomeNewsfeed/HomeNewsfeed.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import { loadLocaleMessages } from '@/locales/i18n'
import { describe, expect, it } from 'vitest'
import flushPromises from 'flush-promises'
import MockComponent from '../../../helpers/MockComponent.vue'
import { getAllProjects } from '@/api/projects.service'
import { getAnnouncements } from '@/api/announcements.service'
import { ProjectOutputFactory } from '../../../factories/project.factory'
import { AnnouncementFactory } from '../../../factories/announcement.factory'

vi.mock('@/api/projects.service', () => ({
    getAllProjects: vi.fn().mockResolvedValue({ results: [] }),
}))

vi.mock('@/api/announcements.service', () => ({
    getAnnouncements: vi.fn().mockResolvedValue({ results: [] }),
}))

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: loadLocaleMessages(),
}

const store = {
    modules: {
        projectCategories: {
            namespaced: true,
            getters: {
                allOrderedByOrderId: vi.fn().mockReturnValue([]),
            },
        },
        organizations: {
            state: {
                current: { id: 'TEST', code: 'TEST' },
            },
            namespaced: true,
            getters: {
                current: vi.fn().mockReturnValue({ id: 'TEST', code: 'TEST' }),
            },
        },
        users: {
            namespaced: true,
            getters: {
                isLoggedIn: vi.fn().mockReturnValue(false),
            },
        },
    },
}

const connectedStore = {
    modules: {
        ...store.modules,
        users: {
            namespaced: true,
            getters: {
                id: vi.fn(),
                userFromApi: vi.fn(),
                getPermissions: vi.fn().mockReturnValue({}),
                isLoggedIn: vi.fn().mockReturnValue(true),
            },
            actions: {
                getUser: vi.fn(),
            },
        },
    },
}

const router = [{ name: 'Home', path: '/', component: MockComponent }]

const props = {
    organization: {
        code: 'TEST',
    },
}

describe('HomeNewsfeed', () => {
    it('should render HomeNews', async () => {
        let wrapper = lpiShallowMount(HomeNewsfeed, { props, store, router, i18n })
        await flushPromises()
        expect(wrapper.exists()).toBeTruthy()
    })

    it('should display projects', async () => {
        vi.mocked(getAllProjects).mockResolvedValueOnce({
            count: 2,
            next: null,
            previous: null,
            results: ProjectOutputFactory.generateMany(2),
        })
        let wrapper = lpiShallowMount(HomeNewsfeed, { props, store, router, i18n })
        await flushPromises()
        expect(wrapper.findAll('newsfeed-project-item-stub')).toHaveLength(2)
    })

    it('should display announcements', async () => {
        vi.mocked(getAnnouncements).mockResolvedValueOnce({
            count: 2,
            next: null,
            previous: null,
            results: AnnouncementFactory.generateMany(2),
        })
        let wrapper = lpiShallowMount(HomeNewsfeed, { props, store, router, i18n })
        await flushPromises()
        expect(wrapper.findAll('newsfeed-announcements-item-stub')).toHaveLength(2)
    })
})
