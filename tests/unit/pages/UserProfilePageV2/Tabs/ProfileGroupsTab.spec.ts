import ProfileGroupsTab from '~/pages/UserProfilePageV2/Tabs/ProfileGroupsTab.vue'
import { UserFactory } from '~~/tests/factories/user.factory'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { OrganizationOutput } from 'shared-projects-frontend/models'
import useOrganizationsStore from '~/stores/useOrganizations'
import pinia from '~/stores'
vi.mock('shared-projects-frontend/apis', () => ({
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
