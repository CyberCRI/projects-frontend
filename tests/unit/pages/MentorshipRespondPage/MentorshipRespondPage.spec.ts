import { lpiMount } from '@/../tests/helpers/LpiMount'
import MentorshipRespondPage from '@/pages/MentorshipRespondPage/MentorshipRespondPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('MentorshipRespondPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(MentorshipRespondPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
