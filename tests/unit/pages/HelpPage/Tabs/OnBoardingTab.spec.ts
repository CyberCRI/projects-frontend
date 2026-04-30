import OnBoardingTab from '~/pages/HelpPage/Tabs/OnBoardingTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('OnBoardingTab.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(OnBoardingTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
