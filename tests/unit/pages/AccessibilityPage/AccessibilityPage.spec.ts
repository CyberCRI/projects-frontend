import { lpiMount } from '@/../tests/helpers/LpiMount'
import AccessibilityPage from '@/pages/AccessibilityPage/AccessibilityPage.vue'

import { describe, expect, it } from 'vitest'

describe('AccessibilityPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(AccessibilityPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
