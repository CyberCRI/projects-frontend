import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import HelpPage from '~/pages/HelpPage/HelpPage.vue'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('HelpPage.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(HelpPage, {
      route: '/help',
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
