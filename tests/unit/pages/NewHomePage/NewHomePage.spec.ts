import { lpiShallowMountSuspended } from '~~/tests/helpers/LpiMount'
import NewHomePage from '~/pages/NewHomePage/NewHomePage.vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

import { ProjectCategoryOutputFactory } from '~~/tests/factories/project-category.factory'

import type { OrganizationOutput } from 'shared-projects-frontend/models'
import useProjectCategoriesStore from '~/stores/useProjectCategories'
import { UserFactory } from '~~/tests/factories/user.factory'
import useOrganizationsStore from '~/stores/useOrganizations'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import useUsersStore from '~/stores/useUserStore'
import pinia from '~/stores'

function connectedStore(usersStore) {
  const user = UserFactory.generate({ id: 123 })
  registerEndpoint(`user/${user.id}/`, () => user)
  usersStore.userFromApi = usersStore.userFromToken = user
}

const router = [{ name: 'Home', path: '/', component: NewHomePage }]

describe('NewHomePage', () => {
  let usersStore
  beforeEach(() => {
    usersStore = useUsersStore(pinia)
    usersStore.userFromApi = usersStore.userFromToken = null
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = { id: 'TEST', code: 'TEST' } as unknown as OrganizationOutput
    const projectCategories = useProjectCategoriesStore(pinia)
    projectCategories._all = ProjectCategoryOutputFactory.generateMany(2)
  })

  it('should render NewHomePage', async () => {
    const wrapper = await lpiShallowMountSuspended(NewHomePage, { router })

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should contain site header as non connected user', async () => {
    const wrapper = await lpiShallowMountSuspended(NewHomePage, {
      router,
    })
    // org header should be visible
    expect(wrapper.find('home-header-anonymous-stub').exists()).toBe(true)
    // user header should NOT be visible
    expect(wrapper.find('home-header-connected-stub').exists()).toBe(false)
    // categories dropdown visible
    expect(wrapper.find('project-categories-dropdown-stub').exists()).toBe(true)
    // search visible
    expect(wrapper.find('home-search-options-stub').exists()).toBe(true)
    // newsfeed visible
    expect(wrapper.find('home-newsfeed-stub').exists()).toBe(true)
    // recommendation block visible
    expect(wrapper.find('recommendation-block-stub').exists()).toBe(true)
    // home buttons NOT visible
    expect(wrapper.find('home-buttons-stub').exists()).toBe(false)
  })

  it('should contain user header as a connected user', async () => {
    connectedStore(usersStore)
    const wrapper = await lpiShallowMountSuspended(NewHomePage, { router })
    // TODO mock loadEvent and loadInstructions
    await flushPromises() // wait for data to be "loaded"
    // org header should not be visible
    expect(wrapper.find('home-header-anonymous-stub').exists()).toBe(false)
    // user header should be visible
    expect(wrapper.find('home-header-connected-stub').exists()).toBe(true)
    // search visible
    expect(wrapper.find('home-search-options-stub').exists()).toBe(true)
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
