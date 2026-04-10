import { lpiMount } from '@/../tests/helpers/LpiMount'
import HelpPage from '@/pages/HelpPage/HelpPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { MockRouter } from '../../../helpers/router'

describe('HelpPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(HelpPage, {
      props,
      router: MockRouter(),
      global: {
        mocks: {
          $route: { path: '', matched: [] },
        },
      },
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
