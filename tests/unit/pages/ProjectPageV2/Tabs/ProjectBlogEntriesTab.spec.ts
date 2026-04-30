import ProjectBlogEntriesTab from '~/pages/ProjectPageV2/Tabs/ProjectBlogEntriesTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { TranslatedProjectFactory } from '~~/tests/factories/project.factory'
import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectBlogEntriesTab.vue', () => {
  it('should render component', async () => {
    const project = TranslatedProjectFactory.generate()
    const props = { project }

    const wrapper = await lpiMountSuspended(ProjectBlogEntriesTab, {
      props,
      provide: {
        projectLayoutToggleAddModal: vi.fn(),
      },
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
