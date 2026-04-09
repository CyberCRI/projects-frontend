import { lpiMount } from '@/../tests/helpers/LpiMount'
import SdgList from '@/components/sdgs/SdgList.vue'

import { describe, expect, it } from 'vitest'

describe('SdgList.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(SdgList, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
