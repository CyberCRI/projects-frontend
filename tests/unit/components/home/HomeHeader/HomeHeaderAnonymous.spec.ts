import { lpiMount } from '@/../tests/helpers/LpiMount'
import HomeHeaderAnonymous from '@/components/home/HomeHeader/HomeHeaderAnonymous.vue'

import { describe, expect, it } from 'vitest'

describe('HomeHeaderAnonymous.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(HomeHeaderAnonymous, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
