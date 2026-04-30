import GroupEditTab from '~/pages/GroupPageV2/Tabs/GroupEditTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { peopleGroupFactory } from '~~/tests/factories/group.factory'
import { describe, expect, it } from 'vitest'

describe('GroupEditTab.vue', () => {
  it('should render component', async () => {
    const group = peopleGroupFactory.generate()
    const props = { groupIdOrSlug: group.id }
    const orgganizationCode = useOrganizationCode()
    group.organization.code = orgganizationCode

    const wrapper = await lpiMountSuspended(GroupEditTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
