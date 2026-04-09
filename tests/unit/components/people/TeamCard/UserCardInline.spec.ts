import { lpiMount } from '@/../tests/helpers/LpiMount'
import UserCardInline from '@/components/people/TeamCard/UserCardInline.vue'

import { describe, expect, it } from 'vitest'

describe('UserCardInline.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(UserCardInline, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
