import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import LoginPage from '~/pages/LoginPage/LoginPage.vue'

import { flushTick } from '~~/tests/helpers/utils'
import { describe, expect, it } from 'vitest'

describe('LoginPage.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(LoginPage)
    await flushTick()
    expect(wrapper.exists()).toBe(true)
  })
})
