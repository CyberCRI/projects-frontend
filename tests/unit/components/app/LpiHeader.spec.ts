import { ProjectCategoryOutputFactory } from '~~/tests/factories/project-category.factory'
import { OrganizationOutputFactory } from '~~/tests/factories/organization.factory'
import useProjectCategoriesStore from '~/stores/useProjectCategories'
import useOrganizationsStore from '~/stores/useOrganizations'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import LpiHeader from '~/components/app/LpiHeader.vue'
import useUsersStore from '~/stores/useUserStore'

import { AnnouncementFactory } from '~~/tests/factories/announcement.factory'
import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { UserFactory } from '~~/tests/factories/user.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it } from 'vitest'

describe('LpiHeader.vue', () => {
  let usersStore

  let organization
  let organizations
  let user

  beforeEach(() => {
    organization = OrganizationOutputFactory.generate()
    organizations = OrganizationOutputFactory.generateMany(2)
    user = UserFactory.generate({
      roles: ['superadmins', `organization:#${organization.id}:admins`],
    })

    registerEndpoint(`organization/${organization.code}/category/`, () =>
      PaginationsFactory.generate({
        results: ProjectCategoryOutputFactory.generateMany(10),
      })
    )

    const organizationsStore = useOrganizationsStore()
    organizationsStore._current = organization
    organizationsStore._all = organizations

    const projectCategories = useProjectCategoriesStore()
    projectCategories._all = ProjectCategoryOutputFactory.generateMany(2)

    usersStore = useUsersStore()
    registerEndpoint(`user/${user.id}/`, () => user)
    usersStore.userFromApi = usersStore.userFromToken = user

    registerEndpoint('announcement/', () =>
      PaginationsFactory.generate({
        results: AnnouncementFactory.generateMany(10),
      })
    )
  })

  it('should render LpiHeader component', () => {
    const wrapper = lpiShallowMount(LpiHeader)
    expect(wrapper.exists()).toBeTruthy()
  })

  it('should trigger the change visibility button', () => {
    usersStore.userFromApi = usersStore.userFromToken = null
    const wrapper = lpiShallowMount(LpiHeader)
    const vm = wrapper.vm as unknown as typeof LpiHeader
    const isNavOpen = vm.isNavOpen
    const loginButton = wrapper.find('[data-test="login-button"]')

    expect(isNavOpen).toBe(false)
    expect(loginButton.exists()).toBeTruthy()
  })

  it('should find the language button', () => {
    const wrapper = lpiShallowMount(LpiHeader)

    const langButton = wrapper.find('header-drop-down-stub')

    expect(langButton.exists()).toBe(true)
  })

  it('should find the drawers', () => {
    const wrapper = lpiShallowMount(LpiHeader)

    // Notifications
    const notificationDrawer = wrapper.findAll('notification-list-stub')
    expect(notificationDrawer.length).toEqual(1)
    // contact form
    const contactDrawer = wrapper.findAll('contact-drawer-stub')
    expect(contactDrawer.length).toEqual(1)
  })

  it('should find the user menu content to equal only 2 as not connected', () => {
    usersStore.userFromApi = usersStore.userFromToken = null
    const wrapper = lpiShallowMount(LpiHeader)

    expect(wrapper.vm.userMenu.length).toEqual(2)
  })

  it('should find the user menu content to equal only 6 as user is connected and is admin', () => {
    const wrapper = lpiShallowMount(LpiHeader)

    expect(wrapper.vm.userMenu.length).toEqual(6)
  })

  it('should find the user menu content to equal only 4 as user is connected and is not admin', () => {
    user.roles = ['notadmin']
    usersStore.userFromApi = usersStore.userFromToken = { ...user }

    const wrapper = lpiShallowMount(LpiHeader)

    expect(wrapper.vm.userMenu.length).toEqual(4)
  })
})
