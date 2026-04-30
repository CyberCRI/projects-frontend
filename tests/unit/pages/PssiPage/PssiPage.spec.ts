import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import PssiPage from '~/pages/PssiPage/PssiPage.vue'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('PssiPage.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(PssiPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
