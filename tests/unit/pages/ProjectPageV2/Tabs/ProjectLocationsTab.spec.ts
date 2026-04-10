import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectLocationsTab from '@/pages/ProjectPageV2/Tabs/ProjectLocationsTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectLocationsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(ProjectLocationsTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
