import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import GroupsPage from '~/pages/GroupsPage/GroupsPage.vue'

import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('GroupsPage.vue', () => {
  it('should render component', async () => {
    const organizationCode = useOrganizationCode()

    registerEndpoint(`organization/${organizationCode}/people-groups-hierarchy/`, () => {
      return {
        id: 1,
        children: [],
      }
    })

    const wrapper = await lpiMountSuspended(GroupsPage, { route: '/groups/' })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
