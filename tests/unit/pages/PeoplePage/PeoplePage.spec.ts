import { lpiMount } from '@/../tests/helpers/LpiMount'
import PeoplePage from '@/pages/PeoplePage/PeoplePage.vue'

import { describe, expect, it } from 'vitest'

describe('PeoplePage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(PeoplePage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
