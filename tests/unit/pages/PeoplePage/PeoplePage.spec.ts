import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import PeoplePage from '@/pages/PeoplePage/PeoplePage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('PeoplePage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMountSuspended(PeoplePage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
