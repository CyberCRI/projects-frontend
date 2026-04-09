import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectEditGeneralInfos from '@/pages/ProjectPageV2/Tabs/ProjectEditGeneralInfos.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectEditGeneralInfos.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectEditGeneralInfos, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
