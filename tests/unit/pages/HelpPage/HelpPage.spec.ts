import { lpiMount } from '@/../tests/helpers/LpiMount'
import HelpPage from '@/pages/HelpPage/HelpPage.vue'

import { describe, expect, it } from 'vitest'

describe('HelpPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(HelpPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
