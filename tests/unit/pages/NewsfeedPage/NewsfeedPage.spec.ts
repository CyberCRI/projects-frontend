import { lpiMount } from '@/../tests/helpers/LpiMount'
import NewsfeedPage from '@/pages/NewsfeedPage/NewsfeedPage.vue'

import { describe, expect, it } from 'vitest'

describe('NewsfeedPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(NewsfeedPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
