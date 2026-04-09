import { lpiMount } from '@/../tests/helpers/LpiMount'
import LegalNoticesPage from '@/pages/LegalNoticesPage/LegalNoticesPage.vue'

import { describe, expect, it } from 'vitest'

describe('LegalNoticesPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LegalNoticesPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
