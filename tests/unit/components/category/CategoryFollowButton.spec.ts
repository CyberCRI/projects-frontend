import { lpiMount } from '@/../tests/helpers/LpiMount'
import CategoryFollowButton from '@/components/category/CategoryFollowButton.vue'

import { describe, expect, it } from 'vitest'

describe('CategoryFollowButton.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(CategoryFollowButton, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
