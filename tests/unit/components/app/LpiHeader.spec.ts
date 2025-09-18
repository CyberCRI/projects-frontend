import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/i18n/locales/en.json'
import LpiHeader from '@/components/app/LpiHeader.vue'
import { OrganizationOutputFactory } from '@/../tests/factories/organization.factory'
import { ProjectCategoryOutputFactory } from '@/../tests/factories/project-category.factory'
import MockComponent from '@/../tests/helpers/MockComponent.vue'
import pinia from '@/stores'
import useProjectCategoriesStore from '@/stores/useProjectCategories'
import useOrganizationsStore from '@/stores/useOrganizations'
import useUsersStore from '@/stores/useUsers'

import useAPI from '@/composables/useAPI'
// quick fix for vi error
// "Cannot log after tests are done. Did you forget to wait for something async in your test?"
// caused by error log af failing call to fetch announcement in LpiHeader
vi.mock('@/composables/useAPI', () => {
  return {
    default: vi.fn().mockResolvedValue({ data: { results: [] } }), // TODO nuxt check this
  }
})

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

const organization = OrganizationOutputFactory.generate()
const organizations = OrganizationOutputFactory.generateMany(2)
const roles = ['superadmins', `organization:#${organization.id}:admins`]
const permissions = {}
const user = {
  name: {
    firstname: 'test',
    lastname: 'test',
  },
}

describe('LpiHeader.vue', () => {
  let wrapper
  let defaultParams
  let usersStore
  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = organization
    organizationsStore._all = organizations
    const projectCategories = useProjectCategoriesStore(pinia)
    projectCategories.all = ProjectCategoryOutputFactory.generateMany(2)
    usersStore = useUsersStore(pinia)
    usersStore.isConnected = false
    usersStore.roles = roles
    usersStore.permissions = permissions
    usersStore.user = user
    usersStore.roles = roles
    usersStore.permissions = permissions

    defaultParams = {
      props: {},
      i18n,
      router: [
        { path: '/', component: MockComponent },
        { path: '/blank', component: MockComponent, name: 'blank' },
      ],
    }
  })
  afterEach(() => {
    // usersStore.$reset()
  })

  it('should render LpiHeader component', () => {
    wrapper = lpiShallowMount(LpiHeader, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should trigger the change visibility button', () => {
    wrapper = lpiShallowMount(LpiHeader, defaultParams)

    const isNavOpen = wrapper.vm.$data.isNavOpen
    const loginButton = wrapper.find('[data-test="login-button"]')

    expect(isNavOpen).toBe(false)
    expect(loginButton.exists()).toBeTruthy()
  })

  it('should find the language button', () => {
    wrapper = lpiShallowMount(LpiHeader, defaultParams)

    const langButton = wrapper.find('header-drop-down-stub')

    expect(langButton.exists()).toBe(true)
  })

  it('should find the drawers', () => {
    wrapper = lpiShallowMount(LpiHeader, defaultParams)

    // Notifications
    const notificationDrawer = wrapper.findAll('notification-list-stub')
    expect(notificationDrawer.length).toEqual(1)
    // contact form
    const contactDrawer = wrapper.findAll('contact-drawer-stub')
    expect(contactDrawer.length).toEqual(1)
  })

  it('should find the user menu content to equal only 2 as not connected', () => {
    wrapper = lpiShallowMount(LpiHeader, defaultParams)

    expect(wrapper.vm.userMenu.length).toEqual(2)
  })

  it('should find the user menu content to equal only 6 as user is connected and is admin', () => {
    usersStore.isConnected = true

    wrapper = lpiShallowMount(LpiHeader, defaultParams)

    expect(wrapper.vm.userMenu.length).toEqual(6)
  })

  it('should find the user menu content to equal only 4 as user is connected and is not admin', () => {
    usersStore.isConnected = true

    usersStore.roles = ['notadmin']

    wrapper = lpiShallowMount(LpiHeader, defaultParams)

    expect(wrapper.vm.userMenu.length).toEqual(4)
  })
})
