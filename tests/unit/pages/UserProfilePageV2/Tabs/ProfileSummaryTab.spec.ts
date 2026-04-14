import ProfileSummaryTab from '@/pages/UserProfilePageV2/Tabs/ProfileSummaryTab.vue'
import { lpiMountSuspended, lpiShallowMount } from '@/../tests/helpers/LpiMount'
import { UserFactory } from '@/../tests/factories/user.factory'
import { flushPromises } from '@vue/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import useUsersStore from '@/stores/useUsers'
import { OrganizationOutput } from '@/models/organization.model'
vi.mock('@/api/follows.service', () => ({
  getUserFollows: vi.fn().mockResolvedValue({ results: [] }),
}))

describe('ProfileSummaryTab', () => {
  let usersStore
  beforeEach(() => {
    usersStore = useUsersStore(pinia)
    usersStore.id = 123
    usersStore.userFromApi = {}
    usersStore.permissions = {}
    usersStore.getUser = vi.fn()
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = { id: 'TEST' } as unknown as OrganizationOutput
  })

  it('should render ProfileSummaryTab component', () => {
    const user = UserFactory.generate()
    const wrapper = lpiShallowMount(ProfileSummaryTab, { props: { user } })

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should see that current user is the logged one', () => {
    const id = 123
    const user: any = UserFactory.generate()
    user.id = id

    usersStore.id = id
    const wrapper = lpiShallowMount(ProfileSummaryTab, { props: { user } })
    const vm: any = wrapper.vm
    expect(vm.isCurrentUser).toBeTruthy()
  })

  it('should see that current user is not the logged one', () => {
    const user: any = UserFactory.generate()
    user.id = 123

    usersStore.id = '456'

    const wrapper = lpiShallowMount(ProfileSummaryTab, { props: { user } })
    const vm: any = wrapper.vm
    expect(vm.isCurrentUser).toBeFalsy()
  })

  it('shouldnt display a message if user has no bio set', async () => {
    const user = UserFactory.generate()
    user.description = null
    const wrapper = lpiShallowMount(ProfileSummaryTab, { props: { user } })

    await flushPromises()
    expect(wrapper.find('user-descriptions-stub').exists()).toBe(false)
  })

  it('should display bio if user has one', async () => {
    const user = UserFactory.generate()
    const wrapper = lpiShallowMount(ProfileSummaryTab, { props: { user } })

    await flushPromises()
    expect(wrapper.find('user-descriptions-stub').exists()).toBe(true)
    expect(wrapper.find('.empty-field').exists()).toBe(false)
  })

  it('shouldnt display resources', async () => {
    const user = UserFactory.generate()
    user.resources.files = user.resources.links = 0
    const wrapper = await lpiMountSuspended(ProfileSummaryTab, { props: { user } })

    await flushPromises()
    expect(wrapper.find('.resources-recap').exists()).toBe(false)
  })

  it('should display resources', async () => {
    const user = UserFactory.generate()
    user.resources.files = user.resources.links = 5
    const wrapper = await lpiMountSuspended(ProfileSummaryTab, { props: { user } })

    await flushPromises()
    expect(wrapper.find('.resources-recap').exists()).toBe(true)
  })
})
