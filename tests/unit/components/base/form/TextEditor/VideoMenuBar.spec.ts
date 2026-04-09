import { lpiMount } from '@/../tests/helpers/LpiMount'
import VideoMenuBar from '@/components/base/form/TextEditor/VideoMenuBar.vue'

import { describe, expect, it } from 'vitest'

describe('VideoMenuBar.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(VideoMenuBar, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
