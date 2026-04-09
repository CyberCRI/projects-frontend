import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProfileHeaderV2 from '@/components/people/FullProfile/ProfileHeaderV2.vue'

import { describe, expect, it } from 'vitest'

describe('ProfileHeaderV2.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProfileHeaderV2, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
