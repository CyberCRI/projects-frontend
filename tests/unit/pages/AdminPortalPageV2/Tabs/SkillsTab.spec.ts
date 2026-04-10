import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import SkillsTab from '@/pages/AdminPortalPageV2/Tabs/SkillsTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('SkillsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiShallowMount(SkillsTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
