import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import TagsTab from '~/pages/AdminPortalPageV2/Tabs/TagsTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('TagsTab.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiShallowMount(TagsTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
