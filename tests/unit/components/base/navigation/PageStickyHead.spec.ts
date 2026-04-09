import { lpiMount } from '@/../tests/helpers/LpiMount'
import PageStickyHead from '@/components/base/navigation/PageStickyHead.vue'

import { describe, expect, it } from 'vitest'

describe('PageStickyHead.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(PageStickyHead, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
