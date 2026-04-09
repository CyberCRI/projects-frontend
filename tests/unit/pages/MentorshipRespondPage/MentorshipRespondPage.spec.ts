import { lpiMount } from '@/../tests/helpers/LpiMount'
import MentorshipRespondPage from '@/pages/MentorshipRespondPage/MentorshipRespondPage.vue'

import { describe, expect, it } from 'vitest'

describe('MentorshipRespondPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(MentorshipRespondPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
