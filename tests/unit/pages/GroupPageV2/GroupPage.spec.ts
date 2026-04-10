import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupPage from '@/pages/GroupPageV2/GroupPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('GroupPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(GroupPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
