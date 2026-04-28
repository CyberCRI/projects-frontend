import SubGroupsTab from '~/pages/GroupPageV2/Tabs/SubGroups/SubGroupsTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { peopleGroupFactory } from '~~/tests/factories/group.factory'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('SubGroupsTab.vue', () => {
  it('should render component', async () => {
    const group = peopleGroupFactory.generate()
    const props = {
      group,
    }

    const wrapper = await lpiMountSuspended(SubGroupsTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
