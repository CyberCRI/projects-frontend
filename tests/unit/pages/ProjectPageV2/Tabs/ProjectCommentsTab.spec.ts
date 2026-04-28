import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import ProjectCommentsTab from '~/pages/ProjectPageV2/Tabs/ProjectCommentsTab.vue'

import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { ProjectFactory } from '../../../../factories/project.factory'
import { CommentFactory } from '../../../../factories/comment.factory'

describe('ProjectCommentsTab.vue', () => {
  it('should render component', async () => {
    const project = ProjectFactory.generate()
    const comments = CommentFactory.generateMany(10)
    const props = { project, comments }

    const wrapper = await lpiMountSuspended(ProjectCommentsTab, {
      props,
      provide: {
        projectLayoutToggleAddModal: vi.fn(),
      },
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
