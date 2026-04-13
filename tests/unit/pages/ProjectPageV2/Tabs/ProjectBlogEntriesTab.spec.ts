import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import ProjectBlogEntriesTab from '@/pages/ProjectPageV2/Tabs/ProjectBlogEntriesTab.vue'

import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { MockRouter } from '../../../../helpers/router'
import { TranslatedProjectFactory } from '../../../../factories/project.factory'

describe('ProjectBlogEntriesTab.vue', () => {
  it('should render component', async () => {
    const project = TranslatedProjectFactory.generate()
    const props = { project }

    const wrapper = await lpiMountSuspended(ProjectBlogEntriesTab, {
      props,
      router: MockRouter(),
      provide: {
        projectLayoutToggleAddModal: vi.fn(),
      },
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
