import { lpiMount } from '@/../tests/helpers/LpiMount'
import AccessibilityPage from '@/pages/AccessibilityPage/AccessibilityPage.vue'
import { flushPromises } from '@vue/test-utils'

import { describe, expect, it } from 'vitest'

describe('AccessibilityPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(AccessibilityPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
