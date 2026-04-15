import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import LoginPage from '@/pages/LoginPage/LoginPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('LoginPage.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(LoginPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
