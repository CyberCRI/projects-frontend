import CookiesPage from '~/pages/CookiesPage/CookiesPage.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('CookiesPage.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(CookiesPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
