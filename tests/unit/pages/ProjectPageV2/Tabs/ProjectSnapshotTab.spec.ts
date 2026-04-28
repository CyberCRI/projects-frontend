import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import ProjectSnapshotTab from '~/pages/ProjectPageV2/ProjectSnapshotTab.vue'
import { ProjectFactory } from '~~/tests/factories/project.factory'
import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectSnapshotTab.vue', () => {
  it('should render component', async () => {
    const project = ProjectFactory.generate()
    const props = { project }

    const wrapper = await lpiMountSuspended(ProjectSnapshotTab, {
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
