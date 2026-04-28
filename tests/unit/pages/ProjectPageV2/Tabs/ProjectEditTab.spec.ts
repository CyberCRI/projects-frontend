import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import ProjectEditTab from '~/pages/ProjectPageV2/Tabs/Team/ProjectEditTab.vue'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('ProjectEditTab.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(ProjectEditTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
