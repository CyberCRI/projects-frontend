import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'

import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { TranslatedProjectFactory } from '../../../../factories/project.factory'
import ProjectDescriptionTab from '@/pages/ProjectPageV2/Tabs/Description/ProjectDescriptionTab.vue'

describe('ProjectDescriptionTab.vue', () => {
  it('should render component', async () => {
    const project = TranslatedProjectFactory.generate()
    const props = { project }

    const wrapper = await lpiMountSuspended(ProjectDescriptionTab, {
      props,
      provide: {
        projectLayoutProjectPatched: vi.fn(),
      },
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
