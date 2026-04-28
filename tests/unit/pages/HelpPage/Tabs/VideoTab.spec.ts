import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import VideoTab from '~/pages/HelpPage/Tabs/VideoTab.vue'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('VideoTab.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(VideoTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
