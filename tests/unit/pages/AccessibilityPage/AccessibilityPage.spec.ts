import AccessibilityPage from '~/pages/AccessibilityPage/AccessibilityPage.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import { flushPromises } from '@vue/test-utils'

import { describe, expect, it } from 'vitest'

describe('AccessibilityPage.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(AccessibilityPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
