import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import RequestAccessPage from '@/pages/RequestAccessPage/RequestAccessPage.vue'

import { describe, expect, it } from 'vitest'

describe('RequestAccessPage.vue', () => {
  it('should render component', async () => {
    const props = {}
    const wrapper = await lpiMountSuspended(RequestAccessPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
