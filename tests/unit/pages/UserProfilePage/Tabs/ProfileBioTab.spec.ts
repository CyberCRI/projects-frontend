import ProfileBioTab from '@/pages/UserProfilePage/Tabs/ProfileBioTab.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import { UserFactory } from '@/../tests/factories/user.factory'
import { loadLocaleMessages } from '@/../tests/helpers/loadLocaleMessages'
import { flushPromises } from '@vue/test-utils'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import useUsersStore from '@/stores/useUsers'
import { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
}

const buildParams = (user) => ({
  i18n,
  props: {
    user,
  },
})

describe('ProfileBioTab', () => {
  let usersStore
  beforeEach(() => {
    usersStore = useUsersStore(pinia)
    usersStore.id = 123
    usersStore.userFromApi = {}
    usersStore.permissions = {}
    usersStore.getUser = vi.fn()
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore.current = { id: 'TEST' } as unknown as OrganizationOutput
  })
  afterEach(() => {
    // usersStore.$reset()
  })
  it('should render ProfileBioTab component', () => {
    let wrapper = lpiShallowMount(ProfileBioTab, buildParams(UserFactory.generate()))

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should see that current user is the logged one', () => {
    const id = '123'
    const user: any = UserFactory.generate()
    user.id = id

    usersStore.id = id
    let wrapper = lpiShallowMount(ProfileBioTab, buildParams(user))
    let vm: any = wrapper.vm
    expect(vm.isCurrentUser).toBeTruthy()
  })

  it('should see that current user is not the logged one', () => {
    const user: any = UserFactory.generate()
    user.id = '123'

    usersStore.id = '456'

    let wrapper = lpiShallowMount(ProfileBioTab, buildParams(user))
    let vm: any = wrapper.vm
    expect(vm.isCurrentUser).toBeFalsy()
  })

  it('should display a message if user has no bio set', async () => {
    const user = UserFactory.generate()
    user.description = null
    let wrapper = lpiShallowMount(ProfileBioTab, buildParams(user))

    await flushPromises()
    expect(wrapper.find('user-descriptions-stub').exists()).toBe(false)
    expect(wrapper.find('.empty-field').exists()).toBe(true)
  })

  it('should display bio if user has one', async () => {
    const user = UserFactory.generate()
    let wrapper = lpiShallowMount(ProfileBioTab, buildParams(user))

    await flushPromises()
    expect(wrapper.find('user-descriptions-stub').exists()).toBe(true)
    expect(wrapper.find('.empty-field').exists()).toBe(false)
  })
})
