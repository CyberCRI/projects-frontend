import MentorshipRespondPage from '~/pages/MentorshipRespondPage/MentorshipRespondPage.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { MentoringFactory } from '~~/tests/factories/mentorship.facotry'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('MentorshipRespondPage.vue', () => {
  it('should render component', async () => {
    const props = { token: 'token' }

    const organizationCode = useOrganizationCode()

    registerEndpoint(`organization/${organizationCode}/mentoring/${props.token}/`, () =>
      MentoringFactory.generate()
    )

    const wrapper = await lpiMountSuspended(MentorshipRespondPage, {
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
