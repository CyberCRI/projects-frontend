import { lpiMount } from '@/../tests/helpers/LpiMount'
import DefaultTermsOfService from '@/components/app/DefaultTermsOfService.vue'

import { describe, expect, it } from 'vitest'

describe('DefaultTermsOfService.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(DefaultTermsOfService, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
