import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'

import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { ProjectFactory } from '../../../../factories/project.factory'
import ProjectSummaryTab from '@/pages/ProjectPageV2/Tabs/Summary/ProjectSummaryTab.vue'

describe('ProjectSummaryTab.vue', () => {
  it('should render component', async () => {
    const project = ProjectFactory.generate()
    const props = { project }

    const wrapper = await lpiMountSuspended(ProjectSummaryTab, {
      props,
      provide: {
        projectLayoutToggleAddModal: vi.fn(),
        projectLayoutGoToTab: vi.fn(),
      },
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
