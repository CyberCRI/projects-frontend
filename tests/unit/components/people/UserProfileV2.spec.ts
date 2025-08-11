import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import UserProfileV2 from '@/components/people/UserProfileV2.vue'
import { UserFactory } from '@/../tests/factories/user.factory'
import { loadLocaleMessages } from '@/../tests/helpers/loadLocaleMessages'
import { getUser } from '@/api/people.service'
import { flushPromises } from '@vue/test-utils'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'

import pinia from '@/stores'
import useUsersStore from '@/stores/useUsers'
import useOrganizationsStore from '@/stores/useOrganizations'

import { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'
import { name } from 'faker'

vi.mock('@/api/people.service.ts', () => ({
  getUser: vi.fn(() => Promise.resolve({ id: 12, permissions: [] })),
}))

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
}

const route = {
  name: 'ProfileSummary',
}

const buildParams = (userId, showPageLink) => ({
  i18n,
  props: {
    userId, // UserFactory.generate(),
    showPageLink,
  },
  global: {
    mocks: {
      $route: route,
    },
  },
})

describe('UserProfileV2', () => {
  let usersStore
  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore.$patch({ current: { id: 'TEST' } as any })
    usersStore = useUsersStore()
    usersStore.$patch({
      id: 12,
      userFromApi: {},
      permissions: {},
    })
  })
  afterEach(() => {
    // usersStore.$reset()
  })
  it('should render UserProfileV2 component', () => {
    let wrapper = lpiShallowMount(UserProfileV2, buildParams(123, false))

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should use logged user if no id is provided', () => {
    let wrapper = lpiShallowMount(UserProfileV2, buildParams(null, false))

    expect(usersStore.getUser).toHaveBeenCalled()
  })

  it("should emit 'user-not-found' if no user found", async () => {
    vi.mocked(getUser).mockRejectedValue(null)

    let wrapper = lpiShallowMount(UserProfileV2, buildParams(123, false))
    await flushPromises()
    expect(wrapper.emitted()['user-not-found']).toBeTruthy()
  })

  it('should see that current user is the logged one', async () => {
    const user: any = UserFactory.generate()
    user.id = 123
    vi.mocked(getUser).mockResolvedValue(user)
    usersStore.userFromApi = user
    let wrapper = lpiShallowMount(UserProfileV2, buildParams(null, false))
    let vm: any = wrapper.vm
    await flushPromises()
    expect(vm.isSelf).toBeTruthy()
  })

  it('should see that current user is not the logged one', async () => {
    const user: any = UserFactory.generate()
    user.id = 123
    vi.mocked(getUser).mockResolvedValue(user)

    const user2: any = UserFactory.generate()
    user2.id = 456
    usersStore.userFromApi = user2

    let wrapper = lpiShallowMount(UserProfileV2, buildParams(123, false))
    let vm: any = wrapper.vm
    await flushPromises()
    expect(vm.isSelf).toBeFalsy()
  })

  it('should allow edition of self profile', async () => {
    const user: any = UserFactory.generate()
    user.id = 123
    vi.mocked(getUser).mockResolvedValue(user)
    usersStore.userFromApi = user
    let wrapper = lpiShallowMount(UserProfileV2, buildParams(null, false))
    let vm: any = wrapper.vm
    await flushPromises()
    expect(vm.canEditUserOrIsSelf).toBe(true)
  })

  it('should not allow edition of other profile without specific rights', async () => {
    const user: any = UserFactory.generate()
    user.id = 123
    vi.mocked(getUser).mockResolvedValue(user)

    const user2: any = UserFactory.generate()
    user.id = 456
    usersStore.userFromApi = user2

    let wrapper = lpiShallowMount(UserProfileV2, buildParams(123, false))
    let vm: any = wrapper.vm
    await flushPromises()
    expect(vm.canEditUserOrIsSelf).toBe(false)
  })

  // it('should display a loader first then the content', async () => {
  //   let wrapper = lpiShallowMount(UserProfileV2, buildParams(123, false))
  //   let vm: any = wrapper.vm

  //   expect(vm.isLoading).toBe(true)
  //   expect(wrapper.find('loader-simple-stub').exists()).toBe(true)
  //   expect(wrapper.find('profile-header-stub').exists()).toBe(false)
  //   expect(wrapper.find('profile-tabs-stub').exists()).toBe(false)

  //   await flushPromises()

  //   expect(vm.isLoading).toBe(false)
  //   expect(wrapper.find('loader-simple-stub').exists()).toBe(false)
  //   expect(wrapper.find('profile-header-stub').exists()).toBe(true)
  //   expect(wrapper.find('profile-tabs-stub').exists()).toBe(true)
  // })
})
