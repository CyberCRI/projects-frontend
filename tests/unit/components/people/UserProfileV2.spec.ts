import UserProfileV2 from '~/components/people/UserProfileV2.vue'
import { UserFactory } from '~~/tests/factories/user.factory'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import { flushPromises } from '@vue/test-utils'

import { beforeAll, beforeEach, describe, expect, it } from 'vitest'

import useOrganizationsStore from '~/stores/useOrganizations'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import useUsersStore from '~/stores/useUsers'
import pinia from '~/stores'

const route = {
  name: 'ProfileUser',
}

const buildParams = (userId: number, showPageLink: boolean) => ({
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
  const user = UserFactory.generate()
  const user2 = UserFactory.generate()

  beforeAll(() => {
    registerEndpoint(`user/${user.id}/`, () => user)
    registerEndpoint(`user/${user2.id}/`, () => user2)

    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore.$patch({ _current: { id: 'TEST' } as any })
    usersStore = useUsersStore()
  })

  beforeEach(() => {
    usersStore.userFromApi = usersStore.userFromToken = user
  })

  it('should render UserProfileV2 component', () => {
    const wrapper = lpiShallowMount(UserProfileV2, buildParams(user.id, false))

    expect(wrapper.exists()).toBeTruthy()
  })

  it("should emit 'user-not-found' if no user found", async () => {
    registerEndpoint(`user/123333/`, () => {
      throw createError({ statusCode: 404 })
    })
    const wrapper = lpiShallowMount(UserProfileV2, buildParams(123333, false))

    await flushPromises()
    expect(wrapper.emitted()['user-not-found']).toBeTruthy()
  })

  it('should see that current user is the logged one', async () => {
    const wrapper = lpiShallowMount(UserProfileV2, buildParams(null, false))
    const vm: any = wrapper.vm
    await flushPromises()
    expect(vm.isSelf).toBeTruthy()
  })

  it('should see that current user is not the logged one', async () => {
    usersStore.userFromApi = usersStore.userFromToken = user2

    const wrapper = lpiShallowMount(UserProfileV2, buildParams(user.id, false))
    const vm: any = wrapper.vm
    await flushPromises()
    expect(vm.isSelf).toBeFalsy()
  })

  it('should allow edition of self profile', async () => {
    const wrapper = lpiShallowMount(UserProfileV2, buildParams(null, false))
    const vm: any = wrapper.vm
    await flushPromises()
    expect(vm.canEditUserOrIsSelf).toBe(true)
  })

  it('should not allow edition of other profile without specific rights', async () => {
    const wrapper = lpiShallowMount(UserProfileV2, buildParams(user2.id, false))
    const vm: any = wrapper.vm
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
