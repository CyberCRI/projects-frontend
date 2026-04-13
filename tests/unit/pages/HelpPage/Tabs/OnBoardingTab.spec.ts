import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import OnBoardingTab from '@/pages/HelpPage/Tabs/OnBoardingTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('OnBoardingTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMountSuspended(OnBoardingTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
