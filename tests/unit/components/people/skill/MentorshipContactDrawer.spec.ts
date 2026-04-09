import { lpiMount } from '@/../tests/helpers/LpiMount'
import MentorshipContactDrawer from '@/components/people/skill/MentorshipContactDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('MentorshipContactDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(MentorshipContactDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
