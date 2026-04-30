import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import PeoplePage from '~/pages/PeoplePage/PeoplePage.vue'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('PeoplePage.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(PeoplePage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
