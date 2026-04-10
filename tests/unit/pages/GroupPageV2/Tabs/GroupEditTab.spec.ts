import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupEditTab from '@/pages/GroupPageV2/Tabs/GroupEditTab.vue'

import { describe, expect, it } from 'vitest'
import { peopleGroupFactory } from '../../../../factories/group.factory'

describe('GroupEditTab.vue', () => {
  it('should render component', async () => {
    const group = peopleGroupFactory.generate()
    const props = { groupIdOrSlug: group.id }
    const orgganizationCode = useOrganizationCode()
    group.organization.code = orgganizationCode

    const wrapper = lpiMount(GroupEditTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
