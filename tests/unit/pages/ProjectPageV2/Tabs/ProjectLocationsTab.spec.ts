import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import ProjectLocationsTab from '~/pages/ProjectPageV2/Tabs/ProjectLocationsTab.vue'

import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { ProjectFactory } from '../../../../factories/project.factory'

describe('ProjectLocationsTab.vue', () => {
  it('should render component', async () => {
    const project = ProjectFactory.generate()
    const props = { project }

    const wrapper = await lpiMountSuspended(ProjectLocationsTab, {
      props,
      provide: {
        projectLayoutToggleAddModal: vi.fn(),
      },
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
