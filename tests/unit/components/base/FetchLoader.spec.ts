import { lpiMount } from '@/../tests/helpers/LpiMount'
import FetchLoader from '@/components/base/FetchLoader.vue'

import { describe, expect, it } from 'vitest'

describe('FetchLoader.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(FetchLoader, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
