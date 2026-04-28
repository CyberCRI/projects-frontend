import ProfileProjectTab from '~/pages/UserProfilePageV2/Tabs/ProfileProjectTab.vue'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import { UserFactory } from '~~/tests/factories/user.factory'
import { flushPromises } from '@vue/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import pinia from '~/stores'
import useOrganizationsStore from '~/stores/useOrganizations'
import useUsersStore from '~/stores/useUsers'

import usePeopleGroupsStore from '~/stores/usePeopleGroups'
import useProjectsStore from '~/stores/useProjects'

import { OrganizationOutput } from '~/models/organization.model'

vi.mock('~/api/follows.service', () => ({
  getUserFollows: vi.fn().mockResolvedValue({ results: [] }),
}))

describe('ProfileProjectTab', () => {
  let usersStore
  beforeEach(() => {
    usersStore = useUsersStore(pinia)
    usersStore.id = 123
    usersStore.userFromApi = {}
    usersStore.permissions = {}
    usersStore.isConnected = true
    usersStore.getUser = vi.fn()
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = { id: 'TEST' } as unknown as OrganizationOutput
    usePeopleGroupsStore(pinia)
    useProjectsStore(pinia)
  })

  it('should render ProfileProjectTab component', () => {
    const wrapper = lpiShallowMount(ProfileProjectTab, { props: { user: UserFactory.generate() } })

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should display 3 project lists', async () => {
    const user = UserFactory.generate()
    const wrapper = lpiShallowMount(ProfileProjectTab, { props: { user } })

    await flushPromises()
    expect(wrapper.findAll('user-projects-search-stub').length).toBe(3)
  })

  it('should not display a create project button if not on self profile', async () => {
    const user = UserFactory.generate()
    const wrapper = lpiShallowMount(ProfileProjectTab, { props: { user } })

    await flushPromises()
    expect(wrapper.find('.create-project').exists()).toBe(false)
  })

  it('should display a create project button if on self profile and has persimission', async () => {
    const id = 123
    const user: any = UserFactory.generate()
    user.id = id

    usersStore.id = id
    const wrapper = lpiShallowMount(ProfileProjectTab, { props: { user } })

    await flushPromises()
    expect(wrapper.find('.create-project').exists()).toBe(true)
  })
})
