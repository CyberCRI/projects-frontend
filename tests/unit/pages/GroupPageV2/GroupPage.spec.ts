import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupPage from '@/pages/GroupPageV2/GroupPage.vue'

import { describe, expect, it } from 'vitest'

describe('GroupPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
