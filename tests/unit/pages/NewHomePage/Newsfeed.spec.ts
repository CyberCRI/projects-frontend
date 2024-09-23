import NewsFeed from '@/components/app/NewsFeed.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import { loadLocaleMessages } from '@/locales/i18n'
import { describe, expect, it } from 'vitest'
import flushPromises from 'flush-promises'
import MockComponent from '../../../helpers/MockComponent.vue'
import { ProjectOutputFactory } from '../../../factories/project.factory'
import { AnnouncementFactory } from '../../../factories/announcement.factory'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: loadLocaleMessages(),
}

const store = {
    modules: {
        // projectCategories: {
        //     namespaced: true,
        //     getters: {
        //         allOrderedByOrderId: vi.fn().mockReturnValue([]),
        //     },
        // },
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

describe('Newsfeed', () => {
    it('should render NewsFeed', async () => {
        let wrapper = lpiShallowMount(NewsFeed, { props: { newsfeed: [] }, store, router, i18n })
        await flushPromises()
        expect(wrapper.exists()).toBeTruthy()
    })

    it('should display projects', async () => {
        let wrapper = lpiShallowMount(NewsFeed, {
            props: {
                newsfeed: [
                    { id: 1, type: 'project', project: ProjectOutputFactory.generate() },
                    { id: 2, type: 'project', project: ProjectOutputFactory.generate() },
                ],
            },
            store,
            router,
            i18n,
        })
        await flushPromises()
        expect(wrapper.findAll('newsfeed-project-item-stub')).toHaveLength(2)
    })

    it('should display announcements', async () => {
        let wrapper = lpiShallowMount(NewsFeed, {
            props: {
                newsfeed: [
                    { id: 1, type: 'announcement', announcement: AnnouncementFactory.generate() },
                    { id: 2, type: 'announcement', announcement: AnnouncementFactory.generate() },
                ],
            },
            store,
            router,
            i18n,
        })
        await flushPromises()
        expect(wrapper.findAll('newsfeed-announcements-item-stub')).toHaveLength(2)
    })

    it('should display news', async () => {
        let wrapper = lpiShallowMount(NewsFeed, {
            props: {
                newsfeed: [
                    { id: 1, type: 'news', news: { id: 1 } }, /// TODO: news factory
                    { id: 2, type: 'news', news: { id: 2 } },
                ],
            },
            store,
            router,
            i18n,
        })
        await flushPromises()
        expect(wrapper.findAll('news-list-item-stub')).toHaveLength(2)
    })

    it('should display mix of news, announcements and projects', async () => {
        let wrapper = lpiShallowMount(NewsFeed, {
            props: {
                newsfeed: [
                    { id: 1, type: 'news', news: { id: 1 } }, /// TODO: news factory
                    { id: 2, type: 'announcement', announcement: AnnouncementFactory.generate() },
                    { id: 3, type: 'project', project: ProjectOutputFactory.generate() },
                ],
            },
            store,
            router,
            i18n,
        })
        await flushPromises()
        expect(wrapper.findAll('news-list-item-stub')).toHaveLength(1)
        expect(wrapper.findAll('newsfeed-announcements-item-stub')).toHaveLength(1)
        expect(wrapper.findAll('newsfeed-project-item-stub')).toHaveLength(1)
    })
})
