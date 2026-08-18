import ProfileSummaryTab from '~/pages/UserProfilePageV2/Tabs/ProfileSummaryTab.vue'
import { lpiMountSuspended, lpiShallowMount } from '~~/tests/helpers/LpiMount'
import { userTranslatedFactory } from '~~/tests/factories/user.factory'
import { flushPromises } from '@vue/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { OrganizationFactory } from '~~/tests/factories/organization.factory'
import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { ProjectFactory } from '~~/tests/factories/project.factory'
import useOrganizationsStore from '~/stores/useOrganizations'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import useUsersStore from '~/stores/useUsers'

describe('ProfileSummaryTab', () => {
  let usersStore

  beforeEach(() => {
    usersStore = useUsersStore()
    const user = userTranslatedFactory.generate({ id: 123 })
    registerEndpoint(`user/${user.id}/`, () => user)
    usersStore.userFromApi = usersStore.userFromToken = user

    const organizationsStore = useOrganizationsStore()
    organizationsStore._current = OrganizationFactory.generate()

    registerEndpoint(`project/`, () =>
      PaginationsFactory.generate({
        results: ProjectFactory.generateMany(10),
      })
    )
  })

  it('should render ProfileSummaryTab component', () => {
    const user = userTranslatedFactory.generate()
    const wrapper = lpiShallowMount(ProfileSummaryTab, { props: { user } })

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should see that current user is the logged one', () => {
    const user = userTranslatedFactory.generate({ id: 123 })
    usersStore.userFromApi = usersStore.userFromToken = user
    const wrapper = lpiShallowMount(ProfileSummaryTab, { props: { user } })
    const vm: any = wrapper.vm
    expect(vm.isCurrentUser).toBeTruthy()
  })

  it('should see that current user is not the logged one', () => {
    const user = userTranslatedFactory.generate({ id: 123 })
    const user2 = userTranslatedFactory.generate({ id: 456 })
    usersStore.userFromApi = usersStore.userFromToken = user2

    const wrapper = lpiShallowMount(ProfileSummaryTab, { props: { user } })
    const vm: any = wrapper.vm
    expect(vm.isCurrentUser).toBeFalsy()
  })

  it('shouldnt display a message if user has no bio set', async () => {
    const user = userTranslatedFactory.generate()
    user.description = null
    const wrapper = lpiShallowMount(ProfileSummaryTab, { props: { user } })

    await flushPromises()
    expect(wrapper.find('user-descriptions-stub').exists()).toBe(false)
  })

  it('should display bio if user has one', async () => {
    const user = userTranslatedFactory.generate()
    const wrapper = lpiShallowMount(ProfileSummaryTab, { props: { user } })

    await flushPromises()
    expect(wrapper.find('user-descriptions-stub').exists()).toBe(true)
    expect(wrapper.find('.empty-field').exists()).toBe(false)
  })

  it('shouldnt display resources', async () => {
    const user = userTranslatedFactory.generate()
    user.modules.files = user.modules.links = 0
    const wrapper = await lpiMountSuspended(ProfileSummaryTab, {
      props: { user },
      global: {
        provide: {
          tabsLayoutSelectTab: vi.fn(),
        },
      },
    })

    await flushPromises()
    expect(wrapper.find('.resources-recap').exists()).toBe(false)
  })

  it('should display resources', async () => {
    const user = userTranslatedFactory.generate()
    user.modules.files = user.modules.links = 5
    const wrapper = await lpiMountSuspended(ProfileSummaryTab, {
      props: { user },
      global: {
        provide: {
          tabsLayoutSelectTab: vi.fn(),
        },
      },
    })

    await flushPromises()
    expect(wrapper.find('.resources-recap').exists()).toBe(true)
  })
})
