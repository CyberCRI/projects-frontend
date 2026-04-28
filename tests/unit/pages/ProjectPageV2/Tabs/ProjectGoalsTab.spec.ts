import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import ProjectGoalsTab from '~/pages/ProjectPageV2/Tabs/ProjectGoalsTab.vue'

import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { TranslatedProjectFactory } from '../../../../factories/project.factory'

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
