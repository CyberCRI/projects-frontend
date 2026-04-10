import { lpiMount } from '@/../tests/helpers/LpiMount'
import MentorshipRespondPage from '@/pages/MentorshipRespondPage/MentorshipRespondPage.vue'

import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('MentorshipRespondPage.vue', () => {
  it('should render component', async () => {
    const props = { token: 'token' }

    const wrapper = await lpiMount(MentorshipRespondPage, {
      props,
      global: {
        mocks: {
          $router: { replace: vi.fn() },
          $route: { path: '' },
        },
      },
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
