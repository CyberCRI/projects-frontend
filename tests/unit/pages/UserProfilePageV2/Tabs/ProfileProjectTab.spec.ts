import ProfileProjectTab from '~/pages/UserProfilePageV2/Tabs/ProfileProjectTab.vue'
import { UserFactory } from '~~/tests/factories/user.factory'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import { flushPromises } from '@vue/test-utils'

import useOrganizationsStore from '~/stores/useOrganizations'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import useUsersStore from '~/stores/useUsers'
import pinia from '~/stores'

import useProjectsStore from '~/stores/useProjects'

import type { OrganizationOutput } from 'shared-projects-frontend/models'

vi.mock('shared-projects-frontend/apis', async (orginalImporter) => ({
  ...(await orginalImporter()),
  getUserFollows: vi.fn().mockResolvedValue({ results: [] }),
}))

describe('ProfileProjectTab', () => {
  let usersStore
  beforeEach(() => {
    usersStore = useUsersStore(pinia)
    usersStore.userFromApi = usersStore.userFromToken = UserFactory.generate({ id: 123 })
    usersStore.isConnected = true
    usersStore.getUser = vi.fn()
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = { id: 'TEST' } as unknown as OrganizationOutput
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
    const user = UserFactory.generate({ id: 123 })
    const organizationCode = useOrganizationCode()

    user.roles.push(`organization:#${organizationCode}:viewers`)
    usersStore.userFromApi = usersStore.userFromToken = user
    const wrapper = lpiShallowMount(ProfileProjectTab, { props: { user } })

    await flushPromises()
    expect(wrapper.find('.create-project').exists()).toBe(true)
  })
})
