import GroupsListTab from '~/pages/AdminPortalPageV2/Tabs/GroupsListTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { peopleGroupFactory } from '~~/tests/factories/group.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('GroupsListTab.vue', () => {
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
