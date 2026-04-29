import ProjectGoalsTab from '~/pages/ProjectPageV2/Tabs/ProjectGoalsTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { TranslatedProjectFactory } from '~~/tests/factories/project.factory'
import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectGoalsTab.vue', () => {
  it('should render component', async () => {
    const project = TranslatedProjectFactory.generate()
    const wrapper = await lpiMountSuspended(ProjectGoalsTab, {
      props: {
        project,
      },
      provide: {
        projectLayoutToggleAddModal: vi.fn(),
      },
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
