import ProfileBioTab from '@/pages/UserProfilePageV2/Tabs/ProfileBioTab.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import { UserFactory } from '@/../tests/factories/user.factory'
import { flushPromises } from '@vue/test-utils'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import useUsersStore from '@/stores/useUsers'
import { OrganizationOutput } from '@/models/organization.model'

import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('ProfileBioTab', () => {
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
  it('should render ProfileBioTab component', () => {
    const wrapper = lpiShallowMount(ProfileBioTab, { props: { user: UserFactory.generate() } })

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should see that current user is the logged one', () => {
    const id = '123'
    const user: any = UserFactory.generate()
    user.id = id

    usersStore.id = id
    const wrapper = lpiShallowMount(ProfileBioTab, { props: { user } })
    const vm: any = wrapper.vm
    expect(vm.isCurrentUser).toBeTruthy()
  })

  it('should see that current user is not the logged one', () => {
    const user: any = UserFactory.generate()
    user.id = '123'

    usersStore.id = '456'

    const wrapper = lpiShallowMount(ProfileBioTab, { props: { user } })
    const vm: any = wrapper.vm
    expect(vm.isCurrentUser).toBeFalsy()
  })

  it('should display a message if user has no bio set', async () => {
    const user = UserFactory.generate()
    user.description = null
    const wrapper = lpiShallowMount(ProfileBioTab, { props: { user } })

    await flushPromises()
    expect(wrapper.find('user-descriptions-stub').exists()).toBe(false)
    expect(wrapper.find('.empty-field').exists()).toBe(true)
  })

  it('should display bio if user has one', async () => {
    const user = UserFactory.generate()
    const wrapper = lpiShallowMount(ProfileBioTab, { props: { user } })

    await flushPromises()
    expect(wrapper.find('user-descriptions-stub').exists()).toBe(true)
    expect(wrapper.find('.empty-field').exists()).toBe(false)
  })
})
