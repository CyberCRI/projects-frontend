import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'

import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import ProjectResourcesTab from '@/pages/ProjectPageV2/Tabs/Resources/ProjectResourcesTab.vue'

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
