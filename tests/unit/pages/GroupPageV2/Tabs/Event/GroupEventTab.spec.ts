import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import GroupEventTab from '@/pages/GroupPageV2/Tabs/Event/GroupEventTab.vue'
import { flushPromises } from '@vue/test-utils'

import { describe, expect, it } from 'vitest'
import { peopleGroupFactory } from '../../../../../factories/group.factory'

describe('GroupEventTab.vue', () => {
  it('should render component', async () => {
    const group = peopleGroupFactory.generate()
    const props = {
      group,
    }

    const wrapper = await lpiMountSuspended(GroupEventTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
