import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupSnapshotTab from '@/pages/GroupPageV2/Tabs/GroupSnapshotTab.vue'

import { describe, expect, it } from 'vitest'

describe('GroupSnapshotTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupSnapshotTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
