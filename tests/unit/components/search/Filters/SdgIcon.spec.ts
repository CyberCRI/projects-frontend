import { lpiMount } from '@/../tests/helpers/LpiMount'
import SdgIcon from '@/components/search/Filters/SdgIcon.vue'

import { describe, expect, it } from 'vitest'

describe('SdgIcon.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(SdgIcon, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
