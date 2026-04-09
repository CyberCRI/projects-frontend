import { lpiMount } from '@/../tests/helpers/LpiMount'
import TheVideoPlayer from '@/components/base/media/TheVideoPlayer.vue'

import { describe, expect, it } from 'vitest'

describe('TheVideoPlayer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(TheVideoPlayer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
