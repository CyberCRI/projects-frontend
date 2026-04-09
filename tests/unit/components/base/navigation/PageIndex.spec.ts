import { lpiMount } from '@/../tests/helpers/LpiMount'
import PageIndex from '@/components/base/navigation/PageIndex.vue'

import { describe, expect, it } from 'vitest'

describe('PageIndex.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(PageIndex, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
