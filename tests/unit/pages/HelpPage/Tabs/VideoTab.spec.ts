import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import VideoTab from '@/pages/HelpPage/Tabs/VideoTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('VideoTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMountSuspended(VideoTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
