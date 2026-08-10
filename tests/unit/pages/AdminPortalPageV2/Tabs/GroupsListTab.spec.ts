import GroupsListTab from '~/pages/AdminPortalPageV2/Tabs/GroupsListTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { OrganizationFactory } from '~~/tests/factories/organization.factory'
import { peopleGroupFactory } from '~~/tests/factories/group.factory'
import useOrganizationsStore from '~/stores/useOrganizations'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { beforeAll, describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('GroupsListTab.vue', () => {
  beforeAll(() => {
    const organizationStore = useOrganizationsStore()
    organizationStore._current = OrganizationFactory.generate()
  })
  it('should render component', async () => {
    const organizationCode = useOrganizationCode()
    registerEndpoint(`organization/${organizationCode}/people-groups-hierarchy/`, () => {
      return peopleGroupFactory.generate()
    })
    const wrapper = await lpiMountSuspended(GroupsListTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
