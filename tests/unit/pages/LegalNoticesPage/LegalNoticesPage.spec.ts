import LegalNoticesPage from '~/pages/LegalNoticesPage/LegalNoticesPage.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('LegalNoticesPage.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(LegalNoticesPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
