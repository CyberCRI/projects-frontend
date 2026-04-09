import { lpiMount } from '@/../tests/helpers/LpiMount'
import BreadCrumbsSkeleton from '@/components/base/navigation/BreadCrumbsSkeleton.vue'

import { describe, expect, it } from 'vitest'

describe('BreadCrumbsSkeleton.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(BreadCrumbsSkeleton, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
