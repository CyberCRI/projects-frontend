import ProfileBioTab from '~/pages/UserProfilePageV2/Tabs/ProfileBioTab.vue'
import type { OrganizationOutput } from 'shared-projects-frontend/models'
import { userTranslatedFactory } from '~~/tests/factories/user.factory'
import useOrganizationsStore from '~/stores/useOrganizations'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import { flushPromises } from '@vue/test-utils'
import useUsersStore from '~/stores/useUsers'

import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it } from 'vitest'

describe('ProfileBioTab', () => {
  let usersStore
  beforeEach(() => {
    usersStore = useUsersStore()
    const user = userTranslatedFactory.generate({ id: 123 })
    registerEndpoint(`user/${user.id}/`, () => user)
    usersStore.userFromApi = usersStore.userFromToken = user

    const organizationsStore = useOrganizationsStore()
    organizationsStore._current = { id: 'TEST' } as unknown as OrganizationOutput
  })
  it('should render ProfileBioTab component', () => {
    const wrapper = lpiShallowMount(ProfileBioTab, {
      props: { user: userTranslatedFactory.generate() },
    })

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should see that current user is the logged one', () => {
    const user = userTranslatedFactory.generate({ id: 123 })
    usersStore.userFromApi = usersStore.userFromToken = user
    const wrapper = lpiShallowMount(ProfileBioTab, { props: { user } })
    const vm: any = wrapper.vm
    expect(vm.isCurrentUser).toBeTruthy()
  })

  it('should see that current user is not the logged one', () => {
    const user = userTranslatedFactory.generate({ id: 123 })
    const user2 = userTranslatedFactory.generate({ id: 456 })

    usersStore.userFromApi = usersStore.userFromToken = user2

    const wrapper = lpiShallowMount(ProfileBioTab, { props: { user } })
    const vm: any = wrapper.vm
    expect(vm.isCurrentUser).toBeFalsy()
  })

  it('should display a message if user has no bio set', async () => {
    const user = userTranslatedFactory.generate()
    user.description = null
    const wrapper = lpiShallowMount(ProfileBioTab, { props: { user } })

    await flushPromises()
    expect(wrapper.find('user-descriptions-stub').exists()).toBe(false)
    expect(wrapper.find('.empty-field').exists()).toBe(true)
  })

  it('should display bio if user has one', async () => {
    const user = userTranslatedFactory.generate()
    const wrapper = lpiShallowMount(ProfileBioTab, { props: { user } })

    await flushPromises()
    expect(wrapper.find('user-descriptions-stub').exists()).toBe(true)
    expect(wrapper.find('.empty-field').exists()).toBe(false)
  })
})
