import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectEditGeneralInfos from '@/pages/ProjectPageV2/Tabs/ProjectEditGeneralInfos.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectEditGeneralInfos.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(ProjectEditGeneralInfos, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
