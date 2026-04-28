import SkillsTab from '~/pages/AdminPortalPageV2/Tabs/SkillsTab.vue'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('SkillsTab.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiShallowMount(SkillsTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
