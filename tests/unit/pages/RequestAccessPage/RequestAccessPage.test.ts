import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import RequestAccessPage from '~/pages/RequestAccessPage/RequestAccessPage.vue'

import { describe, expect, it } from 'vitest'

describe('RequestAccessPage.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(RequestAccessPage)
    expect(wrapper.exists()).toBe(true)
  })
})
