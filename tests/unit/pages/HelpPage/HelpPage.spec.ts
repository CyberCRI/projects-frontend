import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import HelpPage from '@/pages/HelpPage/HelpPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('HelpPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMountSuspended(HelpPage, {
      props,
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
