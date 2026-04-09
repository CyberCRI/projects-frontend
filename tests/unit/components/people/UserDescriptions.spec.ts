import { lpiMount } from '@/../tests/helpers/LpiMount'
import UserDescriptions from '@/components/people/UserDescriptions.vue'

import { describe, expect, it } from 'vitest'

describe('UserDescriptions.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(UserDescriptions, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
