import { lpiMount } from '@/../tests/helpers/LpiMount'
import OnBoardingTab from '@/pages/HelpPage/Tabs/OnBoardingTab.vue'

import { describe, expect, it } from 'vitest'

describe('OnBoardingTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(OnBoardingTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
