import { lpiMount } from '@/../tests/helpers/LpiMount'
import EditMentorshipDrawer from '@/components/people/skill/EditMentorshipDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('EditMentorshipDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(EditMentorshipDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
