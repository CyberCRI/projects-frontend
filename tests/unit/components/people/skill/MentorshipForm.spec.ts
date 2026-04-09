import { lpiMount } from '@/../tests/helpers/LpiMount'
import MentorshipForm from '@/components/people/skill/MentorshipForm.vue'

import { describe, expect, it } from 'vitest'

describe('MentorshipForm.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(MentorshipForm, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
