import NewInformationTab from '~/pages/AdminPortalPageV2/Tabs/NewInformationTab.vue'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('NewInformationTab.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiShallowMount(NewInformationTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
