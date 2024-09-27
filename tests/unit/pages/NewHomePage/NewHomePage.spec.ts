import NewHomePage from '@/pages/NewHomePage/NewHomePage.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import { loadLocaleMessages } from '@/locales/i18n'
import { describe, expect, it } from 'vitest'
import flushPromises from 'flush-promises'

import { ProjectCategoryOutputFactory } from '../../../factories/project-category.factory'

import pinia from '@/stores'
import useUsersStore from '@/stores/useUsers'
import useProjectCategoriesStore from '@/stores/useProjectCategories'
import useOrganizationsStore from '@/stores/useOrganizations'
import { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: loadLocaleMessages(),
}

function connectedStore(usersStore) {
    usersStore.id = 123
    usersStore.userFromApi = {}
    usersStore.permissions = {}
    usersStore.isLoggedIn = true
    usersStore.getUser = vi.fn()
}

const router = [{ name: 'Home', path: '/', component: NewHomePage }]

describe('NewHomePage', () => {
    let usersStore
    beforeEach(() => {
        usersStore = useUsersStore(pinia)
        usersStore.isLoggedIn = false
        const organizationsStore = useOrganizationsStore(pinia)
        organizationsStore.current = { id: 'TEST', code: 'TEST' } as unknown as OrganizationOutput
        const projectCategories = useProjectCategoriesStore(pinia)
        projectCategories.all = ProjectCategoryOutputFactory.generateMany(2)
    })

    afterEach(() => {
        usersStore.$reset()
    })

    it('should render NewHomePage', () => {
        let wrapper = lpiShallowMount(NewHomePage, { router, i18n })

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should contain site header as non connected user', () => {
        let wrapper = lpiShallowMount(NewHomePage, { router, i18n })
        // org header should be visible
        expect(wrapper.find('home-header-anonymous-stub').exists()).toBe(true)
        // user header should NOT be visible
        expect(wrapper.find('home-header-connected-stub').exists()).toBe(false)
        // categories dropdown visible
        expect(wrapper.find('project-categories-dropdown-stub').exists()).toBe(true)
        // search visible
        expect(wrapper.find('search-options-stub').exists()).toBe(true)
        // newsfeed visible
        expect(wrapper.find('home-newsfeed-stub').exists()).toBe(true)
        // recommendation block visible
        expect(wrapper.find('recommendation-block-stub').exists()).toBe(true)
        // home buttons NOT visible
        expect(wrapper.find('home-buttons-stub').exists()).toBe(false)
    })

    it('should contain user header as a connected user', async () => {
        connectedStore(usersStore)
        let wrapper = lpiShallowMount(NewHomePage, { router, i18n })
        // TODO mock loadEvent and loadInstructions
        await flushPromises() // wait for data to be "loaded"
        // org header should not be visible
        expect(wrapper.find('home-header-anonymous-stub').exists()).toBe(false)
        // user header should be visible
        expect(wrapper.find('home-header-connected-stub').exists()).toBe(true)
        // search visible
        expect(wrapper.find('search-options-stub').exists()).toBe(true)
        // categories dropdown visible
        expect(wrapper.find('project-categories-dropdown-stub').exists()).toBe(true)
        // newsfeed visible
        expect(wrapper.find('home-newsfeed-stub').exists()).toBe(true)
        // recommendation block visible
        expect(wrapper.find('recommendation-block-stub').exists()).toBe(true)
        // home buttons visible
        expect(wrapper.find('home-buttons-stub').exists()).toBe(true)
    })
})
