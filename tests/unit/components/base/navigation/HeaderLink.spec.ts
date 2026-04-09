import { lpiMount } from '@/../tests/helpers/LpiMount'
import HeaderLink from '@/components/base/navigation/HeaderLink.vue'

import { describe, expect, it } from 'vitest'

describe('HeaderLink.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(HeaderLink, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
