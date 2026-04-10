import { lpiMount } from '@/../tests/helpers/LpiMount'
import NewsfeedPage from '@/pages/NewsfeedPage/NewsfeedPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('NewsfeedPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(NewsfeedPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
