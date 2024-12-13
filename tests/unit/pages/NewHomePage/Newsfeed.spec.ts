import NewsFeed from '@/components/app/NewsFeed.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import { loadLocaleMessages } from '@/locales/i18n'
import { describe, expect, it } from 'vitest'
import flushPromises from 'flush-promises'
import MockComponent from '@/../tests/helpers/MockComponent.vue'
import { ProjectOutputFactory } from '@/../tests/factories/project.factory'
import { AnnouncementFactory } from '@/../tests/factories/announcement.factory'
import { ProjectCategoryOutputFactory } from '@/../tests/factories/project-category.factory'
import pinia from '@/stores'
import useProjectCategoriesStore from '@/stores/useProjectCategories'
import useOrganizationsStore from '@/stores/useOrganizations'
import useUsersStore from '@/stores/useUsers'
import { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: loadLocaleMessages(),
}

const router = [{ name: 'Home', path: '/', component: MockComponent }]

describe('Newsfeed', () => {
    beforeEach(() => {
        const usersStore = useUsersStore(pinia)
        const organizationsStore = useOrganizationsStore(pinia)
        organizationsStore.current = { id: 'TEST', code: 'TEST' } as unknown as OrganizationOutput
        const projectCategories = useProjectCategoriesStore(pinia)
        projectCategories.all = ProjectCategoryOutputFactory.generateMany(2)
    })
    it('should render NewsFeed', async () => {
        let wrapper = lpiShallowMount(NewsFeed, { props: { newsfeed: [] }, router, i18n })
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
            router,
            i18n,
        })
        await flushPromises()
        expect(wrapper.findAll('news-list-item-stub')).toHaveLength(1)
        expect(wrapper.findAll('newsfeed-announcements-item-stub')).toHaveLength(1)
        expect(wrapper.findAll('newsfeed-project-item-stub')).toHaveLength(1)
    })
})
