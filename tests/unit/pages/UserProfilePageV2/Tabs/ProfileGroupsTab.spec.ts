import ProfileGroupsTab from '~/pages/UserProfilePageV2/Tabs/ProfileGroupsTab.vue'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import { UserFactory } from '~~/tests/factories/user.factory'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import pinia from '~/stores'
import useOrganizationsStore from '~/stores/useOrganizations'
import { OrganizationOutput } from '~/models/organization.model'
vi.mock('~/api/groups.service', () => ({
  getGroup: vi.fn().mockResolvedValue({ results: {} }),
}))

describe('ProfileGroupsTab', () => {
  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = { id: 'TEST' } as unknown as OrganizationOutput
  })

  it('should render ProfileGroupsTab component', () => {
    const wrapper = lpiShallowMount(ProfileGroupsTab, { props: { user: UserFactory.generate() } })

    expect(wrapper.exists()).toBeTruthy()
  })
})
