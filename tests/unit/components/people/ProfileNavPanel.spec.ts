import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProfileNavPanel from '@/components/people/ProfileNavPanel.vue'

import { describe, expect, it } from 'vitest'

describe('ProfileNavPanel.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProfileNavPanel, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
