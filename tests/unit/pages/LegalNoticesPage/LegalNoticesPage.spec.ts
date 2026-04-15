import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import LegalNoticesPage from '@/pages/LegalNoticesPage/LegalNoticesPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('LegalNoticesPage.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(LegalNoticesPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
