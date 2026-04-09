import { lpiMount } from '@/../tests/helpers/LpiMount'
import BreadCrumbs from '@/components/base/navigation/BreadCrumbs.vue'

import { describe, expect, it } from 'vitest'

describe('BreadCrumbs.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(BreadCrumbs, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
