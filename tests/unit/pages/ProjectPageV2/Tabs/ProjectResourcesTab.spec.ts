import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import ProjectResourcesTab from '@/pages/ProjectPageV2/Tabs/Resources/ProjectResourcesTab.vue'
import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectResourcesTab.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(ProjectResourcesTab, {
      provide: {
        projectLayoutToggleAddModal: vi.fn(),
      },
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
