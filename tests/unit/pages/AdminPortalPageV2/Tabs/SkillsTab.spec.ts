import { lpiMount } from '@/../tests/helpers/LpiMount'
import SkillsTab from '@/pages/AdminPortalPageV2/Tabs/SkillsTab.vue'

import { describe, expect, it } from 'vitest'

describe('SkillsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(SkillsTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
