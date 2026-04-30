import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import ErrorPage from '~/pages/ErrorPage/ErrorPage.vue'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('ErrorPage.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(ErrorPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
