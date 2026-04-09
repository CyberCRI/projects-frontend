import { lpiMount } from '@/../tests/helpers/LpiMount'
import VideoTab from '@/pages/HelpPage/Tabs/VideoTab.vue'

import { describe, expect, it } from 'vitest'

describe('VideoTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(VideoTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
