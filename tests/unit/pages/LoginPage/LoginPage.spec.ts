import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import LoginPage from '~/pages/LoginPage/LoginPage.vue'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('LoginPage.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(LoginPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
