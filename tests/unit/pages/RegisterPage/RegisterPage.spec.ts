import RegisterPage from '~/pages/RegisterPage/RegisterPage.vue'

import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('RegisterPage.vue', () => {
  it('should render component', async () => {
    const props = { token: '' }

    const wrapper = await lpiMountSuspended(RegisterPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
