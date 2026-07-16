import ProfileProjectTab from '~/pages/UserProfilePageV2/Tabs/ProfileProjectTab.vue'
import { userTranslatedFactory } from '~~/tests/factories/user.factory'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import { flushPromises } from '@vue/test-utils'

import useOrganizationsStore from '~/stores/useOrganizations'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import useUsersStore from '~/stores/useUsers'

import { OrganizationFactory } from '~~/tests/factories/organization.factory'

vi.mock('shared-projects-frontend/apis', async (orginalImporter) => ({
  ...(await orginalImporter()),
  getUserFollows: vi.fn().mockResolvedValue({ results: [] }),
}))

describe('ProfileProjectTab', () => {
  let usersStore
  beforeEach(() => {
    usersStore = useUsersStore()
    usersStore.userFromApi = usersStore.userFromToken = userTranslatedFactory.generate({ id: 123 })
    const organizationsStore = useOrganizationsStore()
    organizationsStore._current = OrganizationFactory.generate()
  })

  it('should render ProfileProjectTab component', () => {
    const wrapper = lpiShallowMount(ProfileProjectTab, {
      props: { user: userTranslatedFactory.generate() },
    })

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should display 3 project lists', async () => {
    const user = userTranslatedFactory.generate()
    const wrapper = lpiShallowMount(ProfileProjectTab, { props: { user } })

    await flushPromises()
    expect(wrapper.findAll('user-projects-search-stub').length).toBe(3)
  })

  it('should not display a create project button if not on self profile', async () => {
    const user = userTranslatedFactory.generate()
    const wrapper = lpiShallowMount(ProfileProjectTab, { props: { user } })

    await flushPromises()
    expect(wrapper.find('.create-project').exists()).toBe(false)
  })

  it('should display a create project button if on self profile and has persimission', async () => {
    const user = userTranslatedFactory.generate({ id: 123 })
    const organizationsStore = useOrganizationsStore()
    user.roles.push(`organization:#${organizationsStore.current.id}:viewers`)
    usersStore.userFromApi = usersStore.userFromToken = user
    const wrapper = lpiShallowMount(ProfileProjectTab, { props: { user } })

    await flushPromises()
    expect(wrapper.find('.create-project').exists()).toBe(true)
  })
})
