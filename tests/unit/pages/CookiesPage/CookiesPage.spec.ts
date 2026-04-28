import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import CookiesPage from '~/pages/CookiesPage/CookiesPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('CookiesPage.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(CookiesPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
