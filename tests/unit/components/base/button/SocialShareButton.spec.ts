import { lpiMount } from '@/../tests/helpers/LpiMount'
import SocialShareButton from '@/components/base/button/SocialShareButton.vue'

import { describe, expect, it } from 'vitest'

describe('SocialShareButton.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(SocialShareButton, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
