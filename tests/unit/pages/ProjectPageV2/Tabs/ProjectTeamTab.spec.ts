import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import ProjectTeamsTab from '~/pages/ProjectPageV2/Tabs/Teams/ProjectTeamsTab.vue'
import { TranslatedProjectFactory } from '~~/tests/factories/project.factory'
import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectTeamsTab.vue', () => {
  it('should render component', async () => {
    const project = TranslatedProjectFactory.generate()
    const props = { project }

    const wrapper = await lpiMountSuspended(ProjectTeamsTab, {
      props,
      provide: {
        projectLayoutToggleAddModal: vi.fn(),
      },
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
