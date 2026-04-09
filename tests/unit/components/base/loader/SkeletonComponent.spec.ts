import { lpiMount } from '@/../tests/helpers/LpiMount'
import SkeletonComponent from '@/components/base/loader/SkeletonComponent.vue'

import { describe, expect, it } from 'vitest'

describe('SkeletonComponent.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(SkeletonComponent, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
